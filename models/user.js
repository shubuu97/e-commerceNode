const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const _get = require("lodash").get;
const _filter = require("lodash").filter;

const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  userType: {
    type: Number,
    required: true
  },
  resetToken: String,
  resetTokenExpiry: String,
  cart: {
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true
        },
        quantity: { type: Number, required: true }
      }
    ]
  }
});

userSchema.methods.addToCart = function(productId) {
  let newQuantity = 1;
  let updatedCartItems = [..._get(this.cart, "items", [])];
  let productIndex = _get(this.cart, "items", []).findIndex(item => {
    return item.productId.toString() === productId.toString();
  });
  if (productIndex >= 0) {
    newQuantity = _get(this.cart, "items", [])[productIndex].quantity + 1;
    updatedCartItems[productIndex].quantity = newQuantity;
  } else {
    updatedCartItems.push({
      productId: productId,
      quantity: 1
    });
  }

  let updatedCart = {
    items: updatedCartItems
  };
  this.cart = { ...updatedCart };
  return this.save();
};

userSchema.methods.removeItemFromCart = function(productId) {
  const updatedCartItems = _filter(_get(this.cart, "items", []), item => {
    return item.productId.toString() != productId.toString();
  });
  const updatedCart = {
    items: [...updatedCartItems]
  };
  this.cart = { ...updatedCart };
  return this.save();
};

userSchema.methods.clearCart = function() {
  this.cart = { items: [] };
  return this.save();
};

module.exports = mongoose.model("User", userSchema);
