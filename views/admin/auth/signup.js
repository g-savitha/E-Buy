const layout = require("../layout");
module.exports = ({ req }) => {
  return layout({
    content: `
    <div>
        Your id is : ${req.session.userId}
        <form method= "POST">
            <input name = "email" placeholder="email" type="text" />
            <input name = "password" placeholder="password" type="password" />
            <input name = "passwordConfirmation" placeholder="confirm password" type="password" />
            <button type="submit">Sign up</button>
        </form>
    </div>
    `,
  });
};
