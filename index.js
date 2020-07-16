const express = require("express");
const app = express();
const port = 3000 || process.env;

app.get("/", (req, res) => {
  res.send(`
    <div>
    <form method= "POST">
        <input name = "email" placeholder="email" type="text" />
        <input name = "password" placeholder="password" type="password" />
        <input name = "passwordConfirmation" placeholder="confirm password" type="password" />
        <button type="submit">Sign up</button>
    </form>
    </div>
  `);
});

const bodyparser = (req, res, next) => {
  if (req.method === "POST") {
    req.on("data", (data) => {
      const parsed = data.toString().split("&");
      const formData = {};
      for (let pair of parsed) {
        const [key, value] = pair.split("=");
        formData[key] = value;
      }
      req.body = formData;
      next();
    });
  } else {
    next();
  }
};

app.post("/", bodyparser, (req, res) => {
  console.log(req.body);
  res.send("account created");
});
app.listen(port, () => {
  console.log(`listening on port : ${port}`);
});
