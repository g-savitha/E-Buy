const layout = require("../layout");
const { getError } = require("../../helpers");

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
