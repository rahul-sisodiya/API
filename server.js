const express = require("express");
const app = express();

app.use(express.json());

let data = [
  { id: 1, name: "Rahul" },
  { id: 2, name: "Aman" }
];

app.get("/data", (req, res) => {
  res.json(data);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running");
});