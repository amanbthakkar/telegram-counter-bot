process.env.NTBA_FIX_319 = 1;
require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");

const token = process.env.TOKEN;
const bot = new TelegramBot(token, {
  polling: true,
});

let Users = [];
let Data = {};
let User_names = {};
const checkNewUser = (id) => {
  //true if user is new
  if (Users.includes(id)) {
    return false;
  } else return true;
};

const addUser = (id, name) => {
  bot.sendMessage(
    id,
    `Hi ${name}, this is your first message! Registering you as user...`
  );
  Users.push(id);
  User_names[id] = name;
  Data[id] = 0;
  console.log(Data);
};

const add = (id, count, name) => {
  Data[id] += count;
  for (var id in Data) {
    // console.log(key, Data[key]);
    count > 0
      ? bot.sendMessage(id, `${name} has smoked ${count}`)
      : bot.sendMessage(id, `Mistake! ${name} has smoked 1 less`);
  }
};
const sendMessageToAll = (msg) => {
  for (var id in Data) {
    bot.sendMessage(id, msg);
  }
};
const replyToUser = () => {
  var msg = "Summary";
  for (var id in Data) {
    // console.log(key, Data[key]);
    let count = Data[id];
    let name = User_names[id];
    msg = msg + "\n" + name + " - " + count;
  }
  console.log(msg);
  sendMessageToAll(msg);
};
bot.on("text", (msg) => {
  const text = msg.text;
  const id = msg.chat.id;
  const first_name = msg.chat.first_name;
  console.log(`${first_name}: "${text}"`);
  if (checkNewUser(id)) {
    addUser(id, first_name);
  }
  if (text === "/one") {
    add(id, 1, first_name);
  } else if (text === "/two") {
    add(id, 2, first_name);
  } else if (text === "/share") {
    add(id, 0.5, first_name);
  } else if (text === "/minus") {
    add(id, -1, first_name);
  } else if (text === "/count") {
    // console.log(Data);
    replyToUser();
  }
});

bot.on("polling_error", (err) => console.log(err));
