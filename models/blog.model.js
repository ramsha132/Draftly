const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: String,
  body: String,
  tags: [String],
  createdAt: { type: Date, default: Date.now },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    require:true
  }
});



module.exports = mongoose.model('Blog', blogSchema);



