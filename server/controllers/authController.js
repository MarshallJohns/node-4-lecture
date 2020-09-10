const bcrypt = require('bcryptjs')

module.exports = {
    register: async (req, res) => {
        // TODO: we need email and password
        // TODO: check if user already exists
        // TODO: Salt their password
        // TODO: HASH their password
        // Save the user in the db
        // save the user to the session
        // send back confirmation of signup


        const { email, password, isAmin } = req.body
        const db = req.app.get('db')

        // db.get_user_by_email()

        const user = await db.get_user_by_email([email])

        if (user[0]) {
            return res.stus(409).send('User already exists')
        }

        const salt = bcrypt.genSaltSync(10)

        const hash = bcrypt.hashSync(password, salt)

        const newUser = await db.create_user([email, hash, isAdmin])

        req.session.user = newUser[0]

        res.status(200).send(req.session.user)

    },
    login: async (req, res) => {

        // we need email and pasword
        // see if user exists
        // if the dont exist we reject their request
        // compare their passwword to hash
        // if there is  a mismatch we reject
        // set the user session
        // send confirmation

        const { email, password } = req.body
        const db = req.app.get('db')

        const existingUser = await db.get_user_by_email([email])
        if (!existingUser[0]) {
            return res.status(404).send('User not found')
        }

        const isAuthenticated = bcrypt.compareSync(password, existingUser[0].hash)

        if (!isAuthenticated) {
            return res.status(403).send('Email or Password is incorrect')
        }

        delete existingUser[0].hash

        req.session.user = existingUser[0]

        res.status(200).send(req.session.user)
    },
    logout: (req, res) => {
        req.session.destroy()
        res.sendStatus(200)
    },
    getSession: (req, res) => {
        if (req.session.user) {
            res.status(200).send(req.session.user)
        } else {
            res.status(404).send('No session found')
        }
    }
}