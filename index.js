const express = require("express");
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const usersRepo = require("./repositories/users");

const port = 3000 || process.env;

const app = express();
//globally applies bodyparser middleware to all parts of route handlers.
//we dont need to pass this as an argument to our route
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cookieSession({
    //this is used to encrypt all the info stored inside a cookie
    //user wont be able to decipher the cookie or let alone make changes to info inside cookie
    keys: ["dsgjhsdg23764897bfjgjtfe877rbjds"],
  })
);

app.get("/", (req, res) => {
  res.send(`
    <div>
    Your id is : ${req.session.userId}
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
  //create a user
  const user = await usersRepo.create({ email: email, password: password });
  //store id of user inside a user cookie
  req.session.userId = user.id; //req.session is created by cookie session. its an object initially.

  res.send("Account created.");
});
app.listen(port, () => {
  console.log(`listening on port : ${port}`);
});
