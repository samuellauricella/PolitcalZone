const express = require('express');
const router = express.Router();
const blogsController = require('../controllers/blogsController')
const {catchErrors} = require('../handlers/errorHandlers')

/* GET home page. */
router.get('/', blogsController.getArticles)
router.get('/add',blogsController.addArticle)
router.post('/add', blogsController.createArticle)
module.exports = router;
