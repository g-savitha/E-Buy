const express = require("express");
const { check, validationResult } = require("express-validator");

const usersRepo = require("../../repositories/users");
const signupTemplate = require("../../views/admin/auth/signup");
const signInTemplate = require("../../views/admin/auth/signin");

const router = express.Router();

router.get("/signup", (req, res) => {
  res.send(signupTemplate({ req }));
});

router.post(
  "/signup",
  [
    check("email")
      .trim()
      .normalizeEmail()
      .isEmail()
      .withMessage("Must be a valid email")
      .custom(async (email) => {
        const existingUser = await usersRepo.getOneBy({ email: email });
        if (existingUser) {
          throw new Error("Email in Use");
        }
      }),
    check("password")
      .trim()
      .isLength({ min: 6, max: 20 })
      .withMessage("Must be between 6-20 character length"),
    check("passwordConfirmation")
      .trim()
      .isLength({ min: 6, max: 20 })
      .withMessage("Must be between 6-20 character length")
      .custom((passwordConfirmation, { req }) => {
        if (req.body.password !== passwordConfirmation)
          throw new Error("passwords must match");
      }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    console.log(errors);
    const { email, password, passwordConfirmation } = req.body;

    //create a user
    const user = await usersRepo.create({ email: email, password: password });
    //store id of user inside a user cookie
    req.session.userId = user.id; //req.session is created by cookie session. its an object initially.

    res.send("Account created.");
  }
);

router.get("/signout", (req, res) => {
  //reset the cookie session
  req.session = null;
  res.send("You are logged out!");
});

router.get("/signin", (req, res) => {
  res.send(signInTemplate());
});

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  const existingUser = await usersRepo.getOneBy({ email });

  if (!existingUser) {
    return res.send("Email not found. Would you like to signup?");
  }
  const validPassword = await usersRepo.comparePasswords(
    existingUser.password,
    password
  );
  if (!validPassword) return res.send("Incorrect password");

  req.session.userId = existingUser.id;

  res.send(`Hi!, ${existingUser.email}!`);
});

module.exports = router;
