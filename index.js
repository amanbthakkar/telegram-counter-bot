require("dotenv").config();
const express = require("express");
const app = express();
const axios = require("axios");
const fs = require("fs");
const os = require("os");

const bodyParser = require("body-parser");
const port = 80;
const url = "https://api.telegram.org/bot";
const apiToken = process.env.TELEGRAM_TOKEN;
const sendUrl = `${url}${apiToken}`;
let promiselist = [];

var request = require("request");
let Users = [];
let Data = {};
let User_names = {};
var dir = __dirname;
var tmp = os.tmpdir();
var pathUsers = `${tmp}/users.txt`;
var pathData = `${tmp}/data.txt`;
var pathUser_names = `${tmp}/user_names.txt`;

console.log("New version 0.8");

const loadData = () => {
  try {
    Users = JSON.parse(fs.readFileSync(pathUsers, "utf-8"));
    Data = JSON.parse(fs.readFileSync(pathData, "utf-8"));
    User_names = JSON.parse(fs.readFileSync(pathUser_names, "utf-8"));
    console.log("Loaded data");
  } catch (error) {
    console.log(error);
  }
};
const storeData = () => {
  try {
    fs.writeFileSync(pathUsers, JSON.stringify(Users));
    fs.writeFileSync(pathData, JSON.stringify(Data));
    fs.writeFileSync(pathUser_names, JSON.stringify(User_names));
    console.log("Stored data");
  } catch (error) {
    console.log(error);
  }
};
storeData();
const checkNewUser = (id) => {
  //first check if list is empty; if it is then load all variables from file
  if (Users.length == 0) {
    console.log("Attempting to load data");
    loadData();
  }
  if (Users.includes(id)) {
    console.log(`${id} already exists`);
    return false;
  } else {
    console.log(`${id} does not exist!`);
    return true;
  }
};

const sendMessage = (id, text, res) => {
  // console.log("Users: ", Users.length);
  // console.log(Users[0]);
  console.log(__dirname);
  console.log(os.tmpdir());
  for (i = 0; i < Users.length; i++) {
    var thePost = {
      chat_id: Users[i],
      text: text,
    };
    // storeData(thePost);
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
  // console.log(`Added ${Users.length} to promiselist:`);
  // console.log(promiselist);
  Promise.all(promiselist)
    .then(() => {
      console.log("All done");
      res.status(200).send({});
    })
    .catch(() => console.log("Error"));
  // console.log(`Send ${Users.length} from promiselist`);

  promiselist = [];
};

const addUser = (id, name, res) => {
  Users.push(id);
  User_names[id] = name;
  Data[id] = 0;
  //now we store the values of all 3
  storeData();
  console.log("Added new user, now list is\n", Data);
};

const add = (id, count, name, res) => {
  Data[id] += count;
  count > 0
    ? sendMessage(id, `${name} has smoked ${count}`, res)
    : sendMessage(id, `Mistake! ${name} has smoked 1 less`, res);
  console.log(`${name} - added ${count}`);
  storeData();
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

app.use(bodyParser.json());

app.post("/", (req, res) => {
  const msg = req.body.message;
  const id = msg.chat.id;
  const text = msg.text;
  const first_name = msg.chat.first_name;
  console.log(`${first_name}: "${text}"`);

  if (checkNewUser(id) == true) {
    var reply = `${first_name} registered. Messages after this will be counted.`;
    addUser(id, first_name, res);
    sendMessage(id, reply, res);
  } else {
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
      // sendMessage(id, text, res);
    } else if (text.split(" ")[0] == "amanz") {
      newText = text.substring(text.indexOf("amanz") + 6);
      console.log(newText);
      sendMessage(id, newText, res);
    } else if (text === "aman info") {
      console.log("==========================");
      console.log("User names: ", User_names);
      console.log("Data: ", Data);
      console.log("==========================");
      sendMessage(id, "Info printed", res);
    } else {
      console.log("Not a valid command: ", text);
      sendMessage(id, "Not valid command", res);
    }
  }
});

// Listening
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
