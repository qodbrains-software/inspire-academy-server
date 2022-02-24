"use strict";
const express = require("express");
const server = express();
const port = 8080;

server.listen(port, err => {
    if(err){
        console.log("something went wrong ", err);
        return;
    }
    console.log("listening to port " +port);
});