const express = require('express')

const User = require('../models/User');

const router = express.Router();

router.post('/', (req, res) => {
    try {
        const {username, password} = req.body;

        if (password.length < 3) {
            return res.status(400).send({message: 'Password mast be longer than 3 characters'})
        }

        const user = new User({username, password})
        user.addToken()
        user.save()

        res.send(user)
    } catch (e) {
        res.status(500).send(e)
    }
})

module.exports = router;