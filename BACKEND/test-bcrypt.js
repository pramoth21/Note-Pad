try {
    const bcrypt = require('bcryptjs');
    console.log('START');
    const salt = bcrypt.genSaltSync(12);
    const hash = bcrypt.hashSync('test', salt);
    console.log('HASH_SUCCESS: ' + hash.substring(0, 10));
    const match = bcrypt.compareSync('test', hash);
    console.log('MATCH_SUCCESS: ' + match);
} catch (e) {
    console.log('BCRYPT_ERROR: ' + e.message);
}
