const mongoose = require("mongoose");
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

const seedDB = async () => {
  await Product.deleteMany({});
  const theMomentVinyl = new Product({ title: "The Moment Vinyl" });
  theMomentVinyl.save(function (err, theMomentVinyl) {
    if (err) return console.error(err);
  });
  const theMomentCD = new Product({ title: "The Moment CD" });
  theMomentCD.save(function (err, theMomentCD) {
    if (err) return console.error(err);
  });
  const selfTitledEP = new Product({ title: "Self-Titled EP" });
  selfTitledEP.save(function (err, selfTitledEP) {
    if (err) return console.error(err);
  });
  const theMomentSticker = new Product({ title: "The Moment Sticker" });
  theMomentSticker.save(function (err, theMomentSticker) {
    if (err) return console.error(err);
  });
  const theMomentPrint = new Product({ title: "The Moment Print" });
  theMomentPrint.save(function (err, theMomentPrint) {
    if (err) return console.error(err);
  });
};

seedDB();
