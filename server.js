"use strict";
const {data} = require("./data");
const express = require("express");
const server = express();
const port = 8080;

server.use(express.json());
server.get("/lessons/maths", (req, res) => {
   //return the list of maths lessons
   //respond with a 200
  res.json(data[0].maths);    
});

server.get("/lessons/accounting", (req, res) => {
    //return the list of accounting lessons
    //respond with a 200
   res.json(data[1].accounting);
 });

server.listen(port, err => {
    if(err){
        return "something went wrong ", err;
    }
        return "listening to port " +port;
});