
module.exports = {
    authenticateUser: (req, res, next) => {
        if (req.session.user) {
            next()
        } else {
            res.status(403).send('Please log in')
        }
    },

    checkAdminStatus: (req, res) => {
        if (req.session.user.is_admin) {
            next()
        } else {
            res.status(403).send('You are not an Admin')
        }

    }
}