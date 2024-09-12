const mongoose = require("mongoose");
const shortId = require("shortid");

const shortURLSchema = new mongoose.Schema({
    full: {
        type: String,
        required: true,
    },
    short: {
        type: String,
        required: true,
        default: function() {
            return `localhost:3030/${shortId.generate}`;
        },
    },
    clicks: {
        type: Number,
        required: true,
        default: 0,
    },
    date: {
        type: String,
        default: function() {
            return new Date().toISOString().slice(0, 10); // yyyy-mm-dd format
        },
    },
    website: {
        type: String,
        required: true,
        default: function() {
            const fullUrl = this.full;
            const strippedUrl = fullUrl.replace('https://', '').replace('http://', '');
            return strippedUrl.split('.')[0]; 
        }
    }
})

module.exports = mongoose.model("shortURL", shortURLSchema);