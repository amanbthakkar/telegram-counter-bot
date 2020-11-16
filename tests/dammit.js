require("dotenv").config();
const express = require("express");
const app = express();
const axios = require("axios");
const bodyParser = require("body-parser");
const port = 80;
const url = "https://api.telegram.org/bot";
const apiToken = process.env.TELEGRAM_TOKEN;
const sendUrl = `${url}${apiToken}`;
const fs = require("fs");
const path = "./store.txt";
var request = require("request");
var i = 0;
let promiselist = [];

const storeData = (data) => {
  try {
    fs.writeFileSync(path, JSON.stringify(data));
  } catch (error) {
    console.log(error);
  }
};

for (i = 0; i < 4; i++) {
  var thePost = {
    chat_id: 256949175,
    text: `Message ${i}`,
  };
  storeData(thePost);
  promiselist.push(
    axios
      .post(`${url}${apiToken}/sendMessage`, thePost)
      .then((response) => {
        //   console.log(response);
      })
      .catch((error) => {
        //   console.log(error);
      })
  );
}
console.log(promiselist);
Promise.all(promiselist)
  .then(() => console.log("All done"))
  .catch(() => console.log("Error"));
console.log(promiselist);
