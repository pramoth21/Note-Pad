import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { LogIn, User, Lock, Mail, Eye, EyeOff } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';


const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login, googleLogin } = useAuth();
    const navigate = useNavigate();

    const handleGoogleSuccess = async (credentialResponse) => {
        setLoading(true);
        setError('');
        try {
            await googleLogin(credentialResponse.credential);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Google login failed');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to login');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-panel w-full max-w-md rounded-3xl p-8 backdrop-blur-xl"
            >
                <div className="mb-8 text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-pink/20 text-brand-pink">
                        <LogIn size={32} />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight text-white">Welcome Back</h1>
                    <p className="mt-2 text-white/60">Log in to your ambient workspace</p>
                </div>

                {error && (
                    <div className="mb-6 rounded-xl bg-red-500/20 p-4 text-sm text-red-200 border border-red-500/30">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-white/80 ml-1">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={20} />
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full rounded-2xl bg-white/5 border border-white/10 py-3.5 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-brand-pink/50 transition-all"
                                placeholder="name@example.com"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-white/80 ml-1">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={20} />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full rounded-2xl bg-white/5 border border-white/10 py-3.5 pl-12 pr-12 text-white focus:outline-none focus:ring-2 focus:ring-brand-pink/50 transition-all font-light"
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full cursor-pointer rounded-2xl bg-brand-pink py-4 font-semibold text-gray-900 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                    >
                        {loading ? 'Logging in...' : 'Sign In'}
                    </button>

                    <div className="relative my-4">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-white/10"></div>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-[#242424] px-2 text-white/40">Or continue with</span>
                        </div>
                    </div>

                    <div className="flex justify-center">
                        <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onError={() => setError('Google login failed')}
                            theme="dark"
                            shape="pill"
                            width="250"
                        />
                    </div>
                </form>

                <p className="mt-8 text-center text-sm text-white/60">
                    Don't have an account?{' '}
                    <Link to="/register" className="font-semibold text-brand-pink hover:underline">
                        Create account
                    </Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Login;
