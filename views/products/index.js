module.exports = ({ products }) => {
  const renderProducts = products
    .map((product) => {
      return `
    <li>${product.title} - ${product.price}</li>
    `;
    })
    .join("");

  return `<ul>${renderProducts}</ul>`;
};
