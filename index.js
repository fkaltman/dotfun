const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const Product = require("./models/product");

mongoose.connect("mongodb://localhost:27017/andrew-store", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
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

//loads the stylesheet
app.use("/public", express.static("public"));

// ================================= views ===================================== 


app.get("/", (req, res) => {
  res.render("home");
});

app.get("/products", async (req, res) => {
  const products = await Product.find({});
  res.render("products/index", { products });
});

app.get("/products/new", (req, res) => {
  res.render("products/new");
});

app.get("/products/:id", async (req, res) => {
  const product = await Product.findById(req.params.id);
  res.render("products/show", { product });
});

// ================================= DB GUI PAGE ===================================== 

app.post("/products", async (req, res) => {
  const product = new Product(req.body.product);
  await product.save();
  res.redirect(`/products/${product.id}`);
});

app.put("/products", async (req, res) => {
  const { title } = req.body.product;
  const product = await Product.findOneAndUpdate(
    { title: title },
    {
      ...req.body.product,
    }
  );
  res.redirect("/products");
});

app.delete("/products", async (req, res) => {
  const { title } = req.body.product;
  await Product.findOneAndDelete({ title: title });
  res.redirect("/products");
});

app.listen(3000, () => {
  console.log("butts on port 3000");
});
