const fs = require("fs");
const os = require("os");
var users = ["Aman", "Kevin"];
var path = "./save01.txt";
console.log(users);
const storeData = (data) => {
  try {
    fs.writeFileSync(path, JSON.stringify(data));
  } catch (error) {
    console.log(error);
  }
};

storeData(users);
users = [];
console.log(users);
users = JSON.parse(fs.readFileSync(path, "utf-8"));
console.log(users);

console.log(__dirname);
console.log(os.tmpdir());
