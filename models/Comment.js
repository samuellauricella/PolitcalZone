const mongoose = require('mongoose')
mongoose.Promise = global.Promise

const commentSchema = new mongoose.Schema({
	created:{
		type: Date,
		default: Date.now
	},
	author: {
		type: mongoose.Schema.ObjectId,
		ref: 'User',
		required: 'You must supply an author'
	},
	article:{
		type: mongoose.Schema.ObjectId,
		ref: 'Article',
		required: 'You must supply an article'
	},
	text: {
		type: String,
		required: 'Your comment must have text'
	}

})


function autoPopulate(next){
	this.populate('author');
	next()
}

commentSchema.pre('find', autoPopulate)
commentSchema.pre('findOne', autoPopulate)


module.exports = mongoose.model('Comment', commentSchema)