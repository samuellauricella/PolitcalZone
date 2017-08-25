const mongoose= require('mongoose')
mongoose.Promise = global.Promise
const slug = require('slugs')

const articleSchema = new mongoose.Schema({
    name:{
        type: String,
        trim: true,
        required: 'Please enter an article name'
    },
    slug: String,
    description:{
        type: String,
        trim: true,
        required: 'Please enter an description'
    },
    content:{
        type: String,
        trim: true,
        required: 'Please enter article content'
    },
    tags: [String]
})


articleSchema.pre('save', function(next){
    if(!this.isModified('name')){
        next()
        return;
    }
    this.slug = slug(this.name)
    next()
})



module.exports = mongoose.model('Article', articleSchema)