const SL = require('../service-layer')
class UserBL {
    login(_username, _password) {
        return SL.userDL.login(_username, _password);
    }
    getProfile(_userId) {
        return SL.userDL.getProfile(_userId);
    }
    updateProfile(_userId, _selectedTheme) {
        return SL.userDL.updateProfile(_userId, _selectedTheme);
    }
}

module.exports = UserBL;