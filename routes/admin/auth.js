const express = require("express");

const { handleErrors } = require("./middlewares");
const usersRepo = require("../../repositories/users");
const signupTemplate = require("../../views/admin/auth/signup");
const signInTemplate = require("../../views/admin/auth/signin");
const {
  requireEmail,
  requirePassword,
  requirePasswordConfirmation,
  requireEmailExists,
  requireValidPasswordForUser,
} = require("./validators");

const router = express.Router();

router.get("/signup", (req, res) => {
  res.send(signupTemplate({ req }));
});

router.post(
  "/signup",
  [requireEmail, requirePassword, requirePasswordConfirmation],
  handleErrors(signupTemplate),
  async (req, res) => {
    const { email, password } = req.body;

    //create a user
    const user = await usersRepo.create({ email: email, password: password });
    //store id of user inside a user cookie
    req.session.userId = user.id; //req.session is created by cookie session. its an object initially.

    res.redirect("/admin/products");
  }
);

router.get("/signout", (req, res) => {
  //reset the cookie session
  req.session = null;
  res.send("You are logged out!");
});

router.get("/signin", (req, res) => {
  res.send(signInTemplate({}));
});

router.post(
  "/signin",
  [requireEmailExists, requireValidPasswordForUser],
  handleErrors(signInTemplate),
  async (req, res) => {
    const { email } = req.body;
    const existingUser = await usersRepo.getOneBy({ email });
    if (existingUser) {
      req.session.userId = existingUser.id;

      res.redirect("/admin/products");
    }
  }
);

module.exports = router;
