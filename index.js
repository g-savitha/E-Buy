const express = require("express");
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const authRouter = require("./routes/admin/auth");
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
app.use(authRouter);

app.listen(port, () => {
  console.log(`listening on port : ${port}`);
});
