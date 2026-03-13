const http = require("http");
const data = JSON.stringify({ message: "Explain recursion" });
const req = http.request(
{hostname: "localhost", port: 3000, path: "/ask", method: "POST",
  headers: { "Content-Type": "application/json", "Content-Length": data.length } },
  res => res.on("data", d => console.log(d.toString()))
);
req.write(data);
req.end();