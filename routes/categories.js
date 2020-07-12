const express = require('express')

const Category = require('../models/Category')
const isAuth = require('../middlewares/isAuth')

const router = express.Router();

router.get('/:category', isAuth, async (req, res) => {
    try {
        const {category} = req.params;

        const parentCategory = await Category.findOne({title: category})

        if (!parentCategory) return res.status(404).send({message: 'category not found'})

        const categories = await Category.find({parentCategory: parentCategory._id});

        res.send(categories)
    } catch (e) {
        console.log(e);
        res.status(500).send(e)
    }
})

router.get('/', isAuth, async (req, res) => {
    try {
        const categories = await Category.find({parentCategory: undefined});
        res.send(categories)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.get('/all/get', isAuth, async (req, res) => {
    try {
        const {role} = req.currentUser;
        if (role !== 'admin') return res.status(400).send({message: 'You can not get all articles'})

        const categories = await Category.find();
        res.send(categories)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.get('/one/:id', isAuth, async (req, res) => {
    try {
        const {role} = req.currentUser;
        const {id} = req.params;
        if (role !== 'admin') return res.status(400).send({message: 'You can not get all articles'})

        const category = await Category.findById(id);

        if (!category) return res.status(404).send({message: 'Category not found'})
        res.send(category)
    } catch (e) {
        res.status(500).send(e)
    }
})


router.post('/', isAuth, async (req, res) => {
    try {
        const {parentCategory, title} = req.body;
        const {role} = req.currentUser;

        if (role !== 'admin') res.status(400).send({message: 'Access denied'})

        const categoryProps = { title }
        if (!!parentCategory) categoryProps.parentCategory = parentCategory

        const category = await Category.create(categoryProps)

        res.send(category)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.put('/:id', isAuth, async (req, res) => {
    try {
        const {parentCategory, title} = req.body;
        const {id} = req.params
        const {role} = req.currentUser;

        if (role !== 'admin') res.status(400).send({message: 'Access denied'})

        const category = await Category.findById(id);

        if (!category) res.status(404).send({message: 'Category not found'})

        if (parentCategory) {
            category.parentCategory = parentCategory;
        }
        category.title = title;
        category.save()

        res.send(category)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.delete('/:id', isAuth, async (req, res) => {
    try {
        const {role} = req.currentUser;
        const {id} = req.params;

        if (role !== 'admin') res.status(400).send({message: 'Access denied'})

        const category = await Category.findById(id);

        if (! category) res.status(404).send({message: 'Category not found'})

        await category.delete()

        res.send('success')
    } catch (e) {
        res.status(500).send(e)
    }
})

module.exports = router;