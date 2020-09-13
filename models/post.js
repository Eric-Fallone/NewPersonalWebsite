var mongoose = require("mongoose");

var PostSchema = new mongoose.Schema({
    spot: Number,
    catagory: String,
    title: { type: String, unique:true, require:true},
    imgsource: String,
    link: String,
    text: String,
    createdDate: { type: Date, default: Date.now },
    author: {
       id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User"
       },
       username: String
    }
});

module.exports = mongoose.model("Post", PostSchema);
