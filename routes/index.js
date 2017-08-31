var express = require('express');
var router = express.Router();
const blogsController = require('../controllers/blogsController')
const {catchErrors} = require('../handlers/errorHandlers')

/* GET home page. */
router.get('/', blogsController.getArticles)
router.get('/republican', blogsController.getRepublican)
router.get('/add',blogsController.addArticle)


router.post('/add',
	blogsController.upload, 
	blogsController.resize, 
	blogsController.createArticle)



router.post('/add/:id', 
	blogsController.upload, 
	blogsController.resize, 
	blogsController.updateArticle)


router.get('/:id/edit', blogsController.editArticle)

module.exports = router;
