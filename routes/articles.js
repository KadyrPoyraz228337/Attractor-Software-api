const fs = require('fs')
const express = require('express')

const Article = require('../models/Article')
const Category = require('../models/Category')
const isAuth = require('../middlewares/isAuth')
const upload = require('../multer')
const config = require('../config')

const router = express.Router();


router.post('/', isAuth, upload.single('image'), async (req, res) => {
    try {
        let {image, title, description, category} = req.body;

        const user = req.currentUser;

        if (req.file) image = req.file.filename;

        const article = await Article.create({image, title, description, user, category});

        res.send(article)
    } catch (e) {
        console.log(e);
        res.status(500).send(e)
    }
})

router.get('/', isAuth, async (req, res) => {
    try {
        const {category} = req.query
        const categoryTitle = await Category.findOne({title: category})

        const populateConf = {
            path: 'user',
            select: '_id username'
        }

        let articles
        if (categoryTitle) {
            articles = await Article.find({category: categoryTitle._id}).populate(populateConf).populate('category').sort({date: -1});
        } else {
            articles = await Article.find().populate(populateConf).populate('category').sort({date: -1});
        }

        res.send(articles)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.get('/:id', isAuth, async (req, res) => {
    try {
        const {id} = req.params;
        const user = req.currentUser;

        const article = await Article.findById(id).populate({
            path: 'user',
            select: '_id username'
        }).populate('category');

        if (article.user._id.toString() === user._id.toString() && user.role !== 'admin') {
            return res.status(400).send({message: 'you cannot get not your article'})
        }

        res.send(article)
    } catch (e) {
        console.log(e);
        res.status(500).send(e)
    }
})

router.put('/:id', isAuth, upload.single('image'), async (req, res) => {
    try {
        let {title, description, category} = req.body;
        const {id} = req.params;
        const user = req.currentUser;

        const article = await Article.findById(id).populate({
            path: 'user',
            select: '_id username'
        }).populate('category');

        if (article.user._id.toString() === user._id.toString() && user.role !== 'admin') {
            return res.status(400).send({message: 'you cannot edit not your article'})
        }

        if (req.file) {
            if (article.image !== 'null') {
                fs.unlinkSync(config.uploadPath+'/'+article.image)
            }
            article.image = req.file.filename
        }
        article.title = title;
        article.description = description;
        article.category = category;
        article.save()

        res.send(article)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.delete('/:id', isAuth, async (req, res) => {
    try {
        const {id} = req.params;
        const user = req.currentUser;

        const article = await Article.findById(id);

        if (!article) return res.status(404).send({message: 'Article not found'})
        if (article.user.toString() !== user._id.toString() && user.role !== 'admin') {
            return  res.status(400).send({message: 'You can\'t delete this article'})
        }

        if (article.image !== 'null') {
                fs.unlinkSync(config.uploadPath+'/'+article.image)
        }

        await article.delete()

        res.send('success')
    } catch (e) {
        console.log(e);
        res.status(500).send(e)
    }
})

    module.exports = router