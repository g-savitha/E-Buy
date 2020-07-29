const layout = require("../layout");

const getError = (errors, prop) => {
  //prop === email|| password|| passwordconfirmation
  try {
    return errors.mapped()[prop].msg;
    //errors.mapped() => returns error object with email, password and passwordConfirmation
    //as properties [keys]. And each of these keys are objects inside and they have different properties
    //one among them is msg
  } catch (err) {
    return "";
  }
};

module.exports = ({ req, errors }) => {
  return layout({
    content: `
    <div>
        Your id is : ${req.session.userId}
        <form method= "POST">
            <input name = "email" placeholder="email" type="text" />
            ${getError(errors, "email")}
            <input name = "password" placeholder="password" type="password" />
            ${getError(errors, "password")}
            <input name = "passwordConfirmation" placeholder="confirm password" type="password" />
            ${getError(errors, "passwordConfirmation")}
            <button type="submit">Sign up</button>
        </form>
    </div>
    `,
  });
};
