
var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var path = require('path');
var Schema = mongoose.Schema;


mongoose.connect('mongodb://localhost/messageboard');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, './static')));
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');


var PostSchema = new mongoose.Schema({
 name: {type: String, required: true, minlength: 2 },
 message: {type: String, required: true, minlength: 4 },
 comments: [{type: Schema.Types.ObjectId, ref: 'Comment'}]
});


var CommentSchema = new mongoose.Schema({
 _post: {type: Schema.Types.ObjectId, ref: 'Post'},
 comment: {type: String, required: true, minlength: 2 }
});


mongoose.model('Post', PostSchema);
mongoose.model('Comment', CommentSchema);

var Post = mongoose.model('Post');
var Comment = mongoose.model('Comment');


app.get('/', function(req, res) {
  Post.find({}, false, true).populate('_comments').exec(function(err, Post) {
    res.render('index', { posts: Post });
  });
});



app.post('/post_message', function(req, res) {
  Post.create(req.body, function (err) {
    if (err){
      console.log(err);
    }
    res.redirect('/');
  });
});



app.listen(8000, function() {
    console.log("listening on port 8000");
});
