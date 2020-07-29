const { check } = require("express-validator");
const usersRepo = require("../../repositories/users");

module.exports = {
  requireTitle: check("title").trim().isLength({ min: 5, max: 30 }),
  requirePrice: check("price").trim().toInt().isInt({ min: 10 }),
  requireEmail: check("email")
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
  requirePassword: check("password")
    .trim()
    .isLength({ min: 6, max: 20 })
    .withMessage("Must be between 6-20 character length"),
  requirePasswordConfirmation: check("passwordConfirmation")
    .trim()
    .isLength({ min: 6, max: 20 })
    .withMessage("Must be between 6-20 character length")
    .custom((passwordConfirmation, { req }) => {
      if (req.body.password !== passwordConfirmation)
        throw new Error("Passwords must match");
      else return true;
    }),
  requireEmailExists: check("email")
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage("Must be a valid email")
    .custom(async (email) => {
      const existingUser = await usersRepo.getOneBy({ email });
      if (!existingUser) {
        throw new Error("Email not found.");
      }
    }),
  requireValidPasswordForUser: check("password")
    .trim()
    .custom(async (password, { req }) => {
      const existingUser = await usersRepo.getOneBy({
        email: req.body.email,
      });
      if (!existingUser) throw new Error("Incorrect password");
      const validPassword = await usersRepo.comparePasswords(
        existingUser.password,
        password
      );
      if (!validPassword) throw new Error("Incorrect password");
    }),
};
