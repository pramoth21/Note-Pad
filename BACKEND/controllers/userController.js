const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
};

const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);
    user.password = undefined;

    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user
        }
    });
};

exports.register = async (req, res) => {
    try {
        const newUser = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        });

        createSendToken(newUser, 201, res);
    } catch (err) {
        console.error('Registration Error:', err);
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Please provide email and password' });
        }

        const user = await User.findOne({ email }).select('+password');

        if (!user || !(await user.correctPassword(password, user.password))) {
            return res.status(401).json({ message: 'Incorrect email or password' });
        }

        createSendToken(user, 200, res);
    } catch (err) {
        console.error('Login Error:', err);
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
};


exports.getMe = (req, res) => {
    res.status(200).json({
        status: 'success',
        data: {
            user: req.user
        }
    });
};

exports.googleLogin = async (req, res) => {
    try {
        const { idToken } = req.body;
        const ticket = await client.verifyIdToken({
            idToken,
            audience: process.env.GOOGLE_CLIENT_ID
        });
        const payload = ticket.getPayload();
        const { email, name, sub: googleId } = payload;

        let user = await User.findOne({ email });

        if (!user) {
            // Create user without password (social login)
            user = await User.create({
                name,
                email,
                password: Math.random().toString(36).slice(-10) + 'A1!' // Randomized password
            });
        }

        createSendToken(user, 200, res);
    } catch (err) {
        console.error('Google Login Error:', err);
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
};

