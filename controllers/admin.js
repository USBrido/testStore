const mongoDb = require("mongodb");

const Product = require("../models/product");

const ObjectId = mongoDb.ObjectId;

exports.getAddProduct = (req, res) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false
  });
};

exports.postAddProduct = (req, res) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const product = new Product(title, imageUrl, price, description);
  product.save()
    .then(result => {
      console.log('Created Product');
      res.redirect('/admin/products');
    })
    .catch(error => {
      console.log(error);
    });
};

exports.getEditProduct = (req, res) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  Product
    .findById(prodId)
    .then(product => {
      if (!product) {
        return res.redirect('/');
      }
      res.render("admin/edit-product", {
        pageTitle: "Edit Product",
        path: "/admin/edit-product",
        editing: editMode,
        product: product
      });
    })
    .catch(error => console.log(error));
};

exports.postEditProduct = (req, res) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedImageurl = req.body.imageUrl;
  const updatedPrice = req.body.price;
  const updatedDescription = req.body.description;
  
  const product = new Product(
    updatedTitle,
    updatedImageurl,
    updatedPrice,
    updatedDescription,
    new ObjectId(prodId));

  product
    .save()
    .then(result => {
      console.log('Updated Product', result);
      res.redirect('/admin/products');
    })
    .catch(error => console.log(error));
};

exports.getProducts = (req, res) => {
  Product
    .fetchAll()
    .then(products => {
      res.render("admin/products", {
        prods: products,
        pageTitle: "Admin Products",
        path: "/admin/products"
      });
    })
    .catch(error => {
      console.log(error);
    });
};

// exports.postDeleteProduct = (req, res) => {
//   const prodId = req.body.productId;
//   Product.findByPk(prodId)
//     .then(product => {
//       return product.destroy();
//     })
//     .then(result => {
//       console.log(`Product ${prodId} deleted`);
//       res.redirect("/admin/products");
//     })
//     .catch(error => console.log(error));
// };