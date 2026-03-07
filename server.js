const express = require("express");
const app = express();

app.use(express.json());

let data = fs.readFile("data.txt","utf-8");

app.get("/data", (req, res) => {
  res.send(data);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running");
});