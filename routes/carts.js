const express = require("express");
const cartsRepo = require("../repositories/carts");
const productsRepo = require("../repositories/products");
const cartShowTemplate = require("../views/carts/show");
const router = express.Router();

//recieve a post req to add an iem to cart
router.post("/cart/products", async (req, res) => {
  //figure out the cart
  let cart;
  if (!req.session.cartId) {
    //create a new cart and store the cartid on req.session.cartId property
    cart = await cartsRepo.create({ items: [] });
    req.session.cartId = cart.id;
  } else {
    //we have a cart, get it from repo
    cart = await cartsRepo.getOne(req.session.cartId);
  }
  //either add new product to items array or increment quantity of existing product
  const existingItem = cart.items.find(
    (item) => item.id === req.body.productId
  );
  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.items.push({ id: req.body.productId, quantity: 1 });
  }
  await cartsRepo.update(cart.id, { items: cart.items });
  res.redirect("/cart");
});

//receive a get req to show all items in cart
router.get("/cart", async (req, res) => {
  //when user visits cart route, before it exists
  if (!req.session.cartId) {
    return res.redirect("/");
  }

  const cart = await cartsRepo.getOne(req.session.cartId);
  for (let item of cart.items) {
    const product = await productsRepo.getOne(item.id);
    item.product = product;
  }
  res.send(cartShowTemplate({ items: cart.items }));
});

//receive a post to delete an item in cart
router.post("/cart/products/delete", async (req, res) => {
  const { itemId } = req.body;
  const cart = await cartsRepo.getOne(req.session.cartId);
  const items = cart.items.filter((item) => {
    item.id !== itemId;
  });

  await cartsRepo.update(req.session.cartId, { items });
  res.redirect("/cart");
});
module.exports = router;
