const layout = require("../layout");
module.exports = () => {
  return layout({
    content: `
    <div>
        <form method= "POST">
            <input name = "email" placeholder="email" type="text" />
            <input name = "password" placeholder="password" type="password" />
            <button type="submit">Sign In</button>
        </form>
    </div>
    `,
  });
};