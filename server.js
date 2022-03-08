const zip = require('express-zip');
const express = require("express");
const { data } = require("./data");
const { users } = require("./database");
const { authUser } = require("./basicAuth")
const server = express();
const port = 8080;

server.use(express.json());
server.use(setUser);

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

server.get("/download", authUser, (req, res) =>{
    //downloads the book.
    res.zip([
        {
            path:'1.pdf', 
            name:'1.pdf',
        }
    ])
});

// setuser and check userId middleware
function setUser(req, res, next){
    const userId = req.body.userId;
    if(userId){
        req.user = users.find(user => user.id === userId)
    }
    next();
}
 

server.listen(port, err => {
    if(err){
         return "something went wrong ", err;
         
    }
        return "listening to port " +port;
});