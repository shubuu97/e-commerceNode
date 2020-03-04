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
  cart: {
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          required: true,
          ref: "Product"
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
  this.cart = {};
  return this.save();
};

module.exports = mongoose.model("User", userSchema);

// const mongodb = require("mongodb");
// const getDb = require("../util/database").getDb;
// const _findIndex = require("lodash").findIndex;
// const _find = require("lodash").find;
// const _get = require("lodash").get;
// const _filter = require("lodash").filter;

// module.exports = class User {
//   constructor(name, email, cart, id) {
//     this.name = name;
//     this.email = email;
//     this.cart = cart;
//     this.id = id;
//   }

//   createUser() {
//     const db = getDb();
//     return db.collection("users").insertOne(this);
//   }

//   static getById(id) {
//     const db = getDb();
//     return db
//       .collection("users")
//       .find({ _id: new mongodb.ObjectId(id) })
//       .next();
//   }

//   static deleteUserById(id) {
//     const db = getDb();
//     return db.collection("users").deleteOne({ _id: new mongodb.ObjectId(id) });
//   }

//   addToCart(productId) {
//     let newQuantity = 1;
//     let updatedCartItems = [..._get(this.cart, "items", [])];
//     let productIndex = _findIndex(_get(this.cart, "items", []), [
//       "productId",
//       new mongodb.ObjectId(productId)
//     ]);
//     if (productIndex >= 0) {
//       newQuantity = _get(this.cart, "items", [])[productIndex].quantity + 1;
//       updatedCartItems[productIndex] = {
//         ...updatedCartItems[productIndex],
//         quantity: newQuantity
//       };
//     } else {
//       updatedCartItems.push({
//         productId: new mongodb.ObjectId(productId),
//         quantity: 1
//       });
//     }

//     let updatedCart = {
//       items: [...updatedCartItems]
//     };
//     const db = getDb();
//     return db
//       .collection("users")
//       .updateOne(
//         { _id: new mongodb.ObjectId(this.id) },
//         { $set: { cart: updatedCart } }
//       );
//   }

//   getCartDetails() {
//     const db = getDb();
//     const productIds = _get(this.cart, "items", []).map(item => {
//       return item.productId;
//     });
//     return db
//       .collection("products")
//       .find({ _id: { $in: productIds } })
//       .toArray()
//       .then(products => {
//         if (products.length > 0) {
//           return products.map(product => {
//             const foundProduct = _find(_get(this.cart, "items", []), [
//               "productId",
//               product._id
//             ]);
//             if (foundProduct) {
//               return {
//                 ...product,
//                 quantity: foundProduct.quantity
//               };
//             } else {
//               return {};
//             }
//           });
//         } else {
//           this.cart = {};
//         }
//       });
//   }

//   deleteCartItems(productId) {
//     const db = getDb();
//     const updatedCartItems = _filter(_get(this.cart, "items", []), item => {
//       return item.productId != productId;
//     });
//     const updatedCart = {
//       items: [...updatedCartItems]
//     };
//     return db
//       .collection("users")
//       .updateOne(
//         { _id: new mongodb.ObjectId(this.id) },
//         { $set: { cart: updatedCart } }
//       );
//   }

//   createOrder() {
//     const db = getDb();
//     return this.getCartDetails()
//       .then(products => {
//         const order = {
//           items: products,
//           user: {
//             _id: new mongodb.ObjectId(this.id),
//             name: this.name
//           }
//         };
//         return db.collection("orders").insertOne(order);
//       })
//       .then(result => {
//         this.cart = {};
//         return db
//           .collection("users")
//           .updateOne(
//             { _id: new mongodb.ObjectId(this.id) },
//             { $set: { cart: { items: [] } } }
//           );
//       });
//   }

//   getOrders() {
//     const db = getDb();
//     return db
//       .collection("orders")
//       .find({ "user._id": new mongodb.ObjectId(this.id) })
//       .toArray();
//   }

//   getOrder(orderId) {
//     const db = getDb();
//     return db
//       .collection("orders")
//       .find({ _id: new mongodb.ObjectId(orderId) })
//       .next();
//   }
// };
