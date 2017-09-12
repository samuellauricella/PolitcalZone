var express = require('express');
var router = express.Router();
const blogsController = require('../controllers/blogsController')
const userController = require('../controllers/userController')
const authController = require('../controllers/authController')
const adminController = require('../controllers/adminController')

const {catchErrors} = require('../handlers/errorHandlers')

/* GET home page. */
router.get('/', blogsController.getArticles)

// Articles Page
router.get('/articles', blogsController.getArticlesByTag)

// Not sure if i need this route
router.get('/articles/:tag', blogsController.getArticlesByTag)



// Add article page
router.get('/add',
	adminController.isLoggedInSubAdmin,
	blogsController.addArticle)

// Adding an article
router.post('/add',
	blogsController.upload, 
	blogsController.resize, 
	blogsController.createArticle)


// Updating article
router.post('/add/:id', 
	blogsController.upload, 
	blogsController.resize, 
	blogsController.updateArticle)

// Edit page for individual article
router.get('/:id/edit', blogsController.editArticle)

// Getting individual article
router.get('/article/:slug', blogsController.getArticleBySlug)

// Login and Register Forms
router.get('/login', userController.loginForm)
router.post('/login', authController.login)
router.get('/register', userController.registerForm)



// Saving user
router.post('/register', 
	userController.validateRegister,
	userController.register,
	authController.login )

// Logout 
router.get('/logout', authController.logout)

// Viewing account page
router.get('/account',
	authController.isLoggedIn,
	userController.account)


// Update Account
router.post('/account', userController.updateAccount)


// Reset Password
router.post('/account/forgot', authController.forgot)
router.get('/account/reset/:token', authController.reset)
router.post('/account/reset/:token',
	authController.confirmedPasswords,
	authController.update
	)


// ADMIN FEATURES

router.get('/admin', 
	adminController.isLoggedInAdmin,
	adminController.getAdminPage)

router.get('/adminRegister', 
	adminController.isLoggedInAdmin,
	adminController.registerForm)

router.post('/adminRegister', 
	adminController.isLoggedInAdmin,
	adminController.register
	)


// Saving admin user


// api

router.get('/api/search', blogsController.searchArticles)

module.exports = router;
