import express from "express";
import { data } from "./data.js";
import { Headers } from "node-fetch";
import fetch from "node-fetch";
import CryptoJS from "crypto-js";
import knex from "knex";
import { products } from "./products-db.js";
import cors from 'cors';


const server = express();

// Constants:
const port = 8080;

// Database Connection Settings:
const db = knex({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    port: 5432,
    user: "postgres",
    password: "admin",
    database: "inspire-academy",
  },
});


server.use(express.json());
server.use(cors());

//LESSONS ENDPOINT START

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

//LESSONS ENDPOINT END;

// SUBSCRIBE ENDPOINT START

server.post("/subscribe", (req, res) => {
  const { name, surname, email, cell, school, grade } = req.body;
  // store subscriber info in the Database:
  console.log(req.body);
  db.insert({
    name,
    surname,
    email,
    cell,
    school,
    grade,
    subscribed: new Date(),
  })
    .into("subscribers")
    .then((response) => {
      res.status(201).send("Done");
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({
        error: "Internal Server Error",
        message: "Error adding user to the database",
      });
    });
});

// SUBSCRIBE ENDPOINT END;

// BUY BOOK ENDPOINT START

const timeStamp = new Date();
let isoTimeStamp = timeStamp.toISOString();

const generateURIString = (data) => {
  // Create parameter string
  let pfOutput = "";
  for (let key in data) {
    if (data.hasOwnProperty(key)) {
      if (data[key] !== "") {
        pfOutput += `${key}=${encodeURIComponent(data[key].trim()).replace(
          /%20/g,
          "+"
        )}&`;
      }
    }
  }

  // Remove last ampersand
  let getString = pfOutput.slice(0, -1);
  return getString;
};

server.get("/buy/:itemId", (req, res) => {
  const { itemId } = req.params;
  const product = products.books[0];
  console.log(products.books[0].id)
  if (!(itemId === products.books[0].id)) {
    res.status(400).send("Error Processing your Request!");
  } else {
    const signature = CryptoJS.MD5(
      generateURIString({
        merchant_id: "14834204",
        merchant_key: "kiwb7uemq84pg",
        amount: product.price,
        item_name: product.name,
      })
    ).toString();
    const myHeaders = new Headers();
    myHeaders.append("merchant-id", "14834204");
    myHeaders.append("timestamp", isoTimeStamp);
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("signature", signature);

    const requestOptions = {
      method: "post",
      headers: myHeaders,
      body: JSON.stringify({
        amount: product.price,
        item_name: product.name,
        merchant_key: "kiwb7uemq84pg",
        merchant_id: 14834204,
      }),
      redirect: "follow",
    };

    fetch("https://www.payfast.co.za/eng/process", requestOptions)
      .then((response) => {
          res.status(200).json(response.url);
      })
      .catch((error) => {
          res.status(500).json({
              error: "Internal Server Error",
              message: "Unable to process payment details"
          })
      });
  }
});

// BUY BOOK ENDPOINT END;

server.listen(port, (err) => {
  if (err) {
    return "something went wrong ", err;
  }
  return "listening to port " + port;
});
