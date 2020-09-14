var express = require("express");
var router  = express.Router();
var Blog = require("../models/blog");
var Post = require("../models/post");
var middleware = require("../middleware");
var { isLoggedIn,checkUserPost, isAdmin} = middleware;


//index
router.get("/:catagory", function(req, res){
  Blog.findOne({catagory: req.params.catagory}).populate("blogposts").exec( function(err,blogObject){
    if(err){
      console.log(err);
    } else{
      res.render("blog/index",{catagory: req.params.catagory ,allPosts:blogObject});
    }
  });
});
//new
router.get("/:catagory/new",isLoggedIn, isAdmin, function(req,res){
  res.render("blog/new",{catagory: req.params.catagory});
});
//create
router.post("/:catagory", isLoggedIn, isAdmin, function(req, res){

  var author = {
    id: req.user._id,
    username: req.user.username
  }

  var newPost = {catagory: req.params.catagory, title: req.body.title, imgsource: req.body.imgsource, quote: req.body.quote, text: req.body.blogText, author: author};
  Blog.findOne({catagory: req.params.catagory}, function(err,blog){
    if(err){
      console.log(err);
    } else{
      Post.create(newPost, function(err, newlycreated) {
        if(err){
          console.log(err);
        }else{
          blog.blogposts.push(newlycreated._id);
          blog.save();
          newlycreated.spot = blog.blogposts.length;
          console.log(newlycreated.spot);
          console.log(blog.blogposts.length);
          newlycreated.save();
          res.redirect("/");
        }
      });
    }
  });

});

//edit
router.get("/:catagory/:title/edit",isLoggedIn,checkUserPost, function(req, res){
var maxPosts;


  Blog.findOne(
    {catagory: req.params.catagory}).populate("blogposts").exec( function(err,blogObj){
      if(err){
        console.log(err);
      } else{
        maxPosts = blogObj.blogposts.length;
        res.render("blog/edit",{catagory: req.params.catagory ,post:req.post, maxLoc:maxPosts});
      }
    });


});
//update
router.put("/:catagory/:title/edit",isLoggedIn,checkUserPost, function(req, res){
  var newData = {imgsource: req.body.imgsource, quote: req.body.quote, text: req.body.blogText, spot: req.body.loc};
  if(req.post.spot == req.body.loc){
    Post.findOneAndUpdate({title:req.params.title}, {$set: newData}, function(err, post){
        if(err){
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            req.flash("success","Successfully Updated!");
            res.redirect("/");
        }
    });
    return;
  }
  var start;
  var end;
  if(req.post.spot < req.body.loc) {
    start = req.post.spot;
    end = req.body.loc;
    Post.updateMany(
      {catagory: req.params.catagory, spot: { $gte:start, $lte: end } },
      {$inc: {spot: -1} }).exec(function(err, upDoot){
        Post.findOneAndUpdate({title:req.params.title}, {$set: newData}, function(err, post){
            if(err){
                req.flash("error", err.message);
                res.redirect("back");
            } else {
                req.flash("success","Successfully Updated!");
                res.redirect("/");
            }
        });
    });
  }else {
    start = req.body.loc;
    end = req.post.spot;
    Post.updateMany(
      {catagory: req.params.catagory, spot: { $gte:start, $lte: end } },
      {$inc: {spot: 1} }).exec(function(err, upDoot){
        Post.findOneAndUpdate({title:req.params.title}, {$set: newData}, function(err, post){
            if(err){
                req.flash("error", err.message);
                res.redirect("back");
            } else {
                req.flash("success","Successfully Updated!");
                res.redirect("/");
            }
        });
    });
  }
});
//delete
router.delete("/:title", isLoggedIn,checkUserPost, function(req, res){
  var cata =  req.post.catagory;
  var post_id = req.post._id;

  console.log("----------------Deleteing------------------------------");
  console.log(post_id);
  console.log(req.post);

  Blog.findOneAndUpdate({catagory:cata}, {$pull: {blogposts:post_id}},function(err,b){
    //console.log(b);
  });

  Post.updateMany(
    {catagory: cata, spot:{$gte:req.post.spot}},
    {$inc: {spot: -1} }).exec(function(err, upDoot){

  });

  Post.deleteOne({_id:post_id},function(err) {
        if(err) {
            req.flash('error', err.message);
            res.redirect('/');
        } else {
            req.flash('success', 'Post Deleted');
            res.redirect("/");
        }
      });
});


module.exports = router;
