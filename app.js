const express = require("express");
const mongoose = require("mongoose")
const shortURL = require("./models/URL");
const validURL = require("valid-url");

require("dotenv").config();

const app = express();

app.set("view engine", "ejs");

mongoose.connect(process.env.MONGO_DB_URL).then(() => console.log("server started"))

app.use(express.json());
app.use(express.urlencoded({extended: false}));

// routes
app.get("/", async (req, res) => {
    const shortURLs = await shortURL.find();
    res.render("index", {shortURLs});
})

app.post("/shortURLs", async (req, res) => {
    // check url
    if (validURL.isUri(req.body.fullURL)) {
        try {
            const shortURLs = [];
            const url = await shortURL.findOne({full: req.body.fullURL});
            if (url) {
                shortURLs.push(url);
                // this url already exists message
                res.render("index", { shortURLs });
            }
            await shortURL.create({full: req.body.fullURL});
            
            res.redirect("/");
        } catch (err) {
            console.error(err);
            res.status(500).json("server error");
        }
    }
    res.status(401).json("please enter valid url");
})

app.get("/:shortURL", async (req, res) => {
    const shortUrl = await shortURL.findOne({short: req.params.shortURL});
    if (!shortUrl) return res.status(404).json("the url doesn't exist");

    shortUrl.clicks++;
    shortUrl.save(); // wrong
    res.redirect(shortUrl.full); 
})

app.listen(process.env.PORT || 3030, () => console.log('servr started'));
