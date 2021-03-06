const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const Product = require("./models/product");
const product = require("./models/product");
const ExpressError = require('./utils/ExpressError');
const catchAsync = require('./utils/catchAsync');



mongoose.connect("mongodb+srv://andrewaltman1:baseluvi@andrew-store.faqrq.mongodb.net/andrew-store?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const app = express();

// below tells express to use the view engine ejs

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
// adds the ability to view the page from any
// directory via the method "path" - need
// to do once for each app
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.json());

//loads the stylesheet
app.use("/public", express.static("public"));

// ================================= views ===================================== 


app.get("/", (req, res) => {
  res.render("home");
});

app.get("/products", catchAsync(async (req, res) => {
  const products = await Product.find({}).sort({ price: -1 });
  res.render("products/index", { products });
}));

app.get("/vinylmasters", (req, res) => {
  res.render("vinylmasters");
});

app.get("/vinylmasters.html", (req, res) => {
  res.render("vinylmasters");
});

app.get("/player", (req, res) => {
  res.render("player");
});

app.get("/modal", catchAsync(async (req, res) => {
  const products = await Product.find();
  res.send({ products });
}));

app.put("/products", catchAsync(async (req, res) => {
  cartContents = req.body;
  for (cartContent of cartContents){
    let title = cartContent.title;
    let quantity = cartContent.quantity;
    let product = await Product.findOne({ title: title });
    let newStockQTY = `${product.stockQty - quantity}`;
    await Product.findOneAndUpdate(
          { title: title },
          {
            stockQty: newStockQTY
          }
        );
  };
  res.end();
}));

app.get("/products/thanks", (req, res) => {
  res.render("products/thanks");
});
// ================================= errors ===================================== 


app.all('*', (req, res, next) => {
  next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = 'Oh No, Something Went Wrong!'
  res.status(statusCode).render('error', { err })
})

app.listen(3000, () => {
  console.log("butts on port 3000");
});







// app.get("/products/new", (req, res) => {
//   res.render("products/new");
// });

// app.post("/products/checkout", async (req, res) => {
//   console.log(req.body);
//   res.render("products/checkout");
// });

// app.get("/products/:id", async (req, res) => {
//   const product = await Product.findById(req.params.id);
//   res.render("products/show", { product });
// });

// ================================= DB PAGE ===================================== 

// app.post("/products", async (req, res) => {
//   const product = new Product(req.body.product);
//   await product.save();
//   res.redirect(`/products/${product.id}`);
// });

// app.put("/products", async (req, res) => {
//   const { title } = req.body.product;
//   const product = await Product.findOneAndUpdate(
//     { title: title },
//     {
//       ...req.body.product,
//     }
//   );
//   res.redirect("/products");
// });

// app.delete("/products", async (req, res) => {
//   const { title } = req.body.product;
//   await Product.findOneAndDelete({ title: title });
//   res.redirect("/products");
// });
