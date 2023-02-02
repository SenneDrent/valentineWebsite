//- boilerplate zone ----
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const port = process.env.PORT || 3000;

const app = express();

const connectionParams = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}

mongoose.connect(process.env.DATABASE_URL, connectionParams).then(() => {
    console.log("database connected");
});

const responseSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    anwser: {
        type: String,
    }
});

const responseCollection = mongoose.model("responses", responseSchema);


app.use(express.urlencoded({extended: true}));
app.set('view engine', 'ejs');
// ---------------------
let anwser = "not yet"
let anwsered = false;

app.use(express.static('public'));

app.use(function (req, res, next) {
    responseCollection.findOne({name: "website"}, (err, data)=> {
        if (err) {
            res.status(404).send("couldnt connect to db");
            next()
        }
        else {  
            anwser = data.anwser;
            next()
        }
    });
    
})

app.use("/admin", (req, res) => {
    if(req.query.password != "LoveBecauseItsUnbreakable") {
        res.redirect("/");
    }
    else {
        res.render('admin/admin', {anwsered: anwser});
    }
});

app.get("/admin", (req, res) => {
    if(req.query.password != "LoveBecauseItsUnbreakable") {
        res.redirect("/");
    }
});

//callback checking if she anwsered, redirects to the right page
app.use(function (req, res, next) {
    let PostGivenAnwser = req.body.anwser
    //if post with anwser came through, write to file
    if (PostGivenAnwser === "yes" || PostGivenAnwser === "no") {
        responseCollection.updateOne({name: "website"}, {anwser: PostGivenAnwser}, (err, data)=> {});
    }
    anwsered = (anwser === "yes" || anwser === "no");

    //route to correct page
    if (anwsered && req.originalUrl != "/anwser") {
        res.redirect("/anwser");
    }
    else if (!anwsered && req.originalUrl != "/asking") {
        res.redirect("/asking");
    }
    else next();
});

app.get("/asking", (req, res) => {
    res.render("user/askingMonika");
})

//--- For when she has anwsered ---

const yesmsg = "alright! meet me at [location] at 8pm ;)";
const nomsg = "aww too bad! Anyways, thank you for anwsering :)";

app.post("/anwser", (req, res) => {
    let msgToSend;
    if (anwser === "yes") msgToSend = yesmsg;
    else msgToSend = nomsg;
    res.render("user/anwsered", {anwser: anwser, msg: msgToSend}); 
})

app.get("/anwser", (req, res) => {
    let msgToSend;
    if (anwser === "yes") msgToSend = yesmsg;
    else msgToSend = nomsg;
    res.render("user/anwsered", {anwser: anwser, msg: msgToSend});
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));