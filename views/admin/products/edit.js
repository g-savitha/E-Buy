const layout = require("../layout");
const { getError } = require("../../helpers");

module.exports = ({ product, errors }) => {
  return layout({
    content: `<div class="columns is-centered">
    <div class="column is-half">
      <h1 class="subtitle">Update a Product</h1>

      <form method="POST" enctype="multipart/form-data">
        <div class="field">
          <label class="label">Title</label>
          <input class="input" placeholder="Title" name="title" value = "${
            product.title
          }" required>
          <p class="help is-danger">${getError(errors, "title")}</p>
        </div>
        
        <div class="field">
          <label class="label">Price</label>
          <input class="input" placeholder="Price" name="price" value="${
            product.price
          }" required>
          <p class="help is-danger">${getError(errors, "price")}</p>
        </div>
        <br />
        <button class="button is-primary">Create</button>
      </form>
    </div>
  </div>
    `,
  });
};
