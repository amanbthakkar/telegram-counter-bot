require("dotenv").config();
const express = require("express");
const app = express();
const axios = require("axios");
const bodyParser = require("body-parser");
const port = 80;
const url = "https://api.telegram.org/bot";
const apiToken = process.env.TELEGRAM_TOKEN;

let Users = [];
let Data = {};
let User_names = {};
console.log("New version");
var request = require("request");
const checkNewUser = (id) => {
  //true if user is new
  if (Users.includes(id)) {
    return false;
  } else {
    console.log("New user - ", id);
    return true;
  }
};

const sendMessage = (id, text, res) => {
  // for (ids in Data) {
  request.post(
    {
      headers: { "content-type": "application/json" },
      url:
        "https://api.telegram.org/bot1348662756:AAEXjvCLEblZMC4i6rULgmtFpZ6Voz1ehQY/sendMessage",
      body: JSON.stringify({
        chat_id: id,
        text: `${text}`,
      }),
    },
    (error, response, body) => { 
      console.log(body);
    }
  );
  // }
  //   res.status(200).send({});
};
const addUser = (id, name, res) => {
  sendMessage(
    id,
    `Hi ${name}, registered you! Messages after this will be counted.`,
    res
  );
  Users.push(id);
  User_names[id] = name;
  Data[id] = 0;
  console.log("Added new user, now list is\n", Data);
};

const add = (id, count, name, res) => {
  Data[id] += count;
  // for (var id in Data) {
  // console.log(key, Data[key]);
  count > 0
    ? sendMessage(id, `${name} has smoked ${count}`, res)
    : sendMessage(id, `Mistake! ${name} has smoked 1 less`, res);
  // }
};
const sendMessageToAll = (msg, res) => {
  // for (var id in Data) {
  sendMessage(id, msg, res);
  // }
};
const replyToUser = (id, res) => {
  var resp = "Summary";
  for (var idx in Data) {
    // console.log(key, Data[key]);
    let count = Data[idx];
    let name = User_names[idx];
    resp = resp + "\n" + name + " - " + count;
  }
  // console.log(msg);
  sendMessage(id, resp, res);
};
// console.log(`${url}${apiToken}/sendMessage`);
// Configurations
app.use(bodyParser.json());
// Endpoints
// let prevMsg = "";
// let count = 0;
app.post("/", (req, res) => {
  res.send({});
  const msg = req.body.message;
  const id = msg.chat.id;
  const text = msg.text;
  const first_name = msg.chat.first_name;
  console.log(`${first_name}: "${text}"`);
  // sendMessage(id, text, prevMsg, count, res);
  // prevMsg = text;
  // count++;
  // let message = checkNewUser(id)
  //   ? "You are a new user!"
  //   : "You are already registered!";
  if (checkNewUser(id) == true) {
    addUser(id, first_name, res);
    let resp = Users.toString();
    // sendMessage(id, `Hi ${first_name}. List is\n${resp}`, res);
  } else {
    let resp = Users.toString();
    // sendMessage(id, `You sent ${text}. List is\n${resp}`, res);
    if (text === "/one") {
      add(id, 1, first_name, res);
    } else if (text === "/two") {
      add(id, 2, first_name, res);
    } else if (text === "/share") {
      add(id, 0.5, first_name, res);
    } else if (text === "/minus") {
      add(id, -1, first_name, res);
    } else if (text === "/count") {
      // console.log(Data);
      replyToUser(id, res);
    } else if (text.split(" ")[0] == "amanz") {
      newText = text.substring(text.indexOf("amanz") + 6);
      console.log(newText);
      sendMessage(id, newText, res);
    } else {
      //   return res.send({});
      // console.log(Data);
      // sendMessage(id, "Follow the instructions, bitch", req, res);
    }
  }
});

// Listening
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
