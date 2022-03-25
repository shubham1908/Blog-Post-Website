require('dotenv').config();
const express = require("express");
const mongoose = require('mongoose');
const ejs = require("ejs");
const _ = require("lodash");

const URI = 'mongodb+srv://admin-' + process.env.MONGO_ADMIN + ':' + process.env.MONGO_PASSWORD + '@cluster0.hkzz7.mongodb.net/blogDB'
mongoose.connect(URI);

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    }
});

const Post = mongoose.model('post', postSchema);

const homeStartingContent =
    `A blog (a truncation of "weblog") is a discussion or informational website published on the World Wide Web consisting of discrete, often informal diary-style text entries (posts). Posts are typically displayed in reverse chronological order, so that the most recent post appears first, at the top of the web page. Until 2009, blogs were usually the work of a single individual,[citation needed] occasionally of a small group, and often covered a single subject or topic. In the 2010s, "multi-author blogs" (MABs) emerged, featuring the writing of multiple authors and sometimes professionally edited. MABs from newspapers, other media outlets, universities, think tanks, advocacy groups, and similar institutions account for an increasing quantity of blog traffic. The rise of Twitter and other "microblogging" systems helps integrate MABs and single-author blogs into the news media. Blog can also be used as a verb, meaning to maintain or add content to a blog.`;
const aboutContent =
    `Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui`;
const contactContent =
    `Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.`;

const app = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded({
    extended: true
}));
app.use(express.static("public"));

app.get("/", function(req, res) {
    Post.find((err, posts) => {
        if (err) {
            console.log(err);
        } else {
            res.render("home", { startingContent: homeStartingContent, posts: posts });
        }
    });
});

app.get("/about", function(req, res) {
    res.render("about", { aboutContent: aboutContent });
});

app.get("/contact", function(req, res) {
    res.render("contact", { contactContent: contactContent });
});

app.get("/compose", function(req, res) {
    res.render("compose");
});

app.post("/compose", function(req, res) {

    const newPost = new Post({
        title: _.capitalize(req.body.postTitle),
        content: req.body.postBody
    });
    newPost.save((err) => {
        if (!err) {
            res.redirect("/");
        }
    });
});

app.get("/posts/:postName", function(req, res) {
    const postTitle = req.params.postName;

    Post.findOne({ title: postTitle }, (err, post) => {
        if (err) {
            console.log(err);
        } else {
            res.render("post", {
                title: post.title,
                content: post.content
            });
        }
    })

});

app.listen(process.env.PORT || 3000, function() {
    console.log("Server started on port 3000");
});