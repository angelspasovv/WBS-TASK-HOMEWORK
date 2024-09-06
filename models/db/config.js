const mongoose = require("mongoose");

const uri =
    "mongodb+srv://angelspasovv:test1234555@cluster0.ebkja6l.mongodb.net/Domasno?retryWrites=true&w=majority&appName=Cluster0";

async function connect() {
    try {
        await mongoose.connect(uri);
        console.log("MongoDB connected!");
    } catch (err) {
        console.error(err);
    }
}

module.exports = connect;