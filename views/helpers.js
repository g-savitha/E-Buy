module.exports = {
  getError(errors, prop) {
    //prop === email|| password|| passwordconfirmation
    try {
      ///errors.mapped() => returns error object with email, password and passwordConfirmation
      //as properties [keys]. And each of these keys are objects inside and they have different properties
      //one among them is msg
      return errors.mapped()[prop].msg;
    } catch (err) {
      return "";
    }
  },
};
