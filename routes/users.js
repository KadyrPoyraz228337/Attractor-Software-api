const express = require('express')
const bcrypt = require('bcrypt');

const isAuth = require('../middlewares/isAuth')
const User = require('../models/User');

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const {username, password} = req.body;

        if (password.length < 3) {
            return res.status(400).send({message: 'Password mast be longer than 3 characters'})
        }

        const user = new User({username, password})
        user.addToken()
        await user.save()

        res.send(user)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.post('/sessions', async (req, res) => {
    try {
        const {username, password} = req.body;

        const user = await User.findOne({username});
        if (!user) {
            return res.status(404).send({message: 'Username or password not correct!'});
        } else {
            const correctPassword = await bcrypt.compare(password, user.password);
            if (!correctPassword) {
                return res.status(404).send({message: 'Username or password not correct!'});
            }
        }

        user.addToken();
        user.save()

        res.send(user)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.delete('/sessions/:id', isAuth, async (req, res) => {
    try {
        const {id} = req.params;

        const user = await User.findOne({_id: id});

        if (!user) return res.status(404).send({message: "User not found"});

        user.addToken()
        user.save();

        res.send('success')
    } catch (e) {
        res.status(500).send(e)
    }
});

module.exports = router;