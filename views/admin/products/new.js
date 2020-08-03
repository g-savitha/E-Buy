const layout = require("../layout");
const { getError } = require("../../helpers");

module.exports = ({ errors }) => {
  return layout({
    content: `
    <form method="POST"enctype='multipart/form-data'>
        <input name="title" placeholder="Title" />
        ${getError(errors, "title")}
        <input name="price" placeholder="Price" />
        ${getError(errors, "price")}
        <input type="file" name="image" />
        ${getError(errors, "image")}
        <button type="submit">Submit</button>
    </form>
    `,
  });
};
