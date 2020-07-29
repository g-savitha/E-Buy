const { check } = require("express-validator");
const usersRepo = require("../../repositories/users");

module.exports = {
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
        throw new Error("passwords must match");
    }),
};
