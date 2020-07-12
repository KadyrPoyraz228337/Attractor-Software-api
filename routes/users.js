const express = require('express')
const bcrypt = require('bcrypt');

const isAuth = require('../middlewares/isAuth')
const User = require('../models/User');

const router = express.Router();

router.get('/:id', isAuth, async (req, res) => {
    try {
        const {id} = req.params;
        const {_id} = req.currentUser;

        const user = await User.findById(id).select({token: 0});

        if (!user) return res.status(404).send('User not found')
        if (_id.toString() !== user._id.toString()) return res.status(400).send('User not found')

        res.send(user)
    } catch (e) {
        res.status(500).send(e)
    }
})

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

router.delete('/sessions', async (req, res) => {
    const success = {message: "success"};
    try {
        const token = req.get('Authorization').split(' ')[1];

        if (!token) return res.send(success);

        const user = await User.findOne({token});

        if (!user) return res.send(success);

        user.addToken();
        await user.save();

        return res.send(success);

    } catch (e) {
        res.send(success)
    }
});

router.put('/:id', isAuth, async (req, res) => {
    try {
        let {username, password} = req.body;
        const {id} = req.params;
        const {_id} = req.currentUser;

        const user = await User.findById(id);

        if (!user) return res.status(404).send({message: 'User not found'})
        if (_id.toString() !== user._id.toString()) return res.status(400).send({message: 'You can not edit this user'})
        if (password) {
            if (password.length < 3) {
                return res.status(400).send({message: 'Password mast be longer than 3 characters'})
            }
            const salt = await bcrypt.genSalt(10);
            password = await bcrypt.hash(password, salt);
        }

        user.username = username;


        await user.save()

        await User.updateOne({_id: id}, {password: password});

        res.send(user)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.delete('/:id', isAuth, async (req, res) => {
    try {
        const {id} = req.params;
        const {_id} = req.currentUser;

        const user = await User.findById(id);

        if (!user) return res.status(404).send({message: 'User not found'})
        if (_id.toString() !== user._id.toString()) return res.status(400).send({message: 'You can not delete this user'})

        await user.delete()

        res.send(user)
    } catch (e) {
        res.status(500).send(e)
    }
})

module.exports = router;