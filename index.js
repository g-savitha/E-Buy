const express = require("express");
const bodyParser = require("body-parser");
const usersRepo = require("./repositories/users");

const port = 3000 || process.env;

const app = express();
//globally applies bodyparser middleware to all parts of route handlers.
//we dont need to pass this as an argument to our route
app.use(bodyParser.urlencoded({ extended: true }));

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

app.post("/", async (req, res) => {
  const { email, password, passwordConfirmation } = req.body;
  const existingUser = await usersRepo.getOneBy({ email: email });
  if (existingUser) {
    return res.send("Email in use");
  }
  if (password !== passwordConfirmation)
    return res.send("passwords must match");
  res.send("account created");
});
app.listen(port, () => {
  console.log(`listening on port : ${port}`);
});
