const express = require("express");
const app = express();

const port = 5000;

app.get("/", (req, res) => {
  res.send("Home page");
});

app.get("/users", (req, res) => {
  res.send("Users page");
});

// Listen on port 5000
app.listen(port, () => {
  console.log(`Server is booming on port 5000
Visit http://localhost:5000`);
});
