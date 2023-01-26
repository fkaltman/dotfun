const express = require('express');
const helmet = require('helmet');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const crypto = require('crypto');
const Product = require('./models/product');
const ExpressError = require('./utils/ExpressError');
const catchAsync = require('./utils/catchAsync');

mongoose.connect(process.env.DB_CONNECT, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Database connected');
});

const app = express();

// below tells express to use the view engine ejs

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
// adds the ability to view the page from any
// directory via the method "path" - need
// to do once for each app
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.json());
// loads the stylesheet
app.use('/public', express.static('public'));

const fontSrcUrls = [
  'https://fonts.gstatic.com',
  'https://fonts.googleapis.com/',
  'https://ka-f.fontawesome.com/',
];

const scriptSrcUrls = [
  'https://kit.fontawesome.com/',
  'https://ka-f.fontawesome.com/',
  'https://cdn.jsdelivr.net/',
  'https://www.paypal.com/',
  'https://www.sandbox.paypal.com/',
];

const connectSrcUrls = [
  'https://kit.fontawesome.com/',
  'https://ka-f.fontawesome.com/',
  'https://www.sandbox.paypal.com/',
  'https://www.paypal.com/',
];

const frameSrcUrls = [
  'https://kit.fontawesome.com/',
  'https://ka-f.fontawesome.com/',
  'https://www.sandbox.paypal.com/',
  'https://www.paypal.com/',
  'https://www.youtube.com/',
  'https://youtu.be/',
];

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      ...helmet.contentSecurityPolicy.getDefaultDirectives(),
      'script-src': ["'self'", "'unsafe-inline'", ...scriptSrcUrls],
      'font-src': ["'self'", ...fontSrcUrls],
      'connect-src': ["'self'", ...connectSrcUrls],
      'frame-src': ["'self'", ...frameSrcUrls],
      'img-src': ["'self'", 'data:', 'https://t.paypal.com/'],
    },
  })
);

// =====================================
// ============= views =================
// =====================================

app.get('/', (req, res) => {
  res.render('home');
});

app.get(
  '/products',
  catchAsync(async (req, res) => {
    const products = await Product.find({}).sort({ price: -1 });
    res.render('products/store', { products });
  })
);

app.get('/vinylmasters', (req, res) => {
  res.render('vinylmasters');
});

app.get('/vinylmasters.html', (req, res) => {
  res.render('vinylmasters');
});

app.get(
  '/modal',
  catchAsync(async (req, res) => {
    const products = await Product.find();
    res.send({ products });
  })
);

app.put(
  '/products',
  catchAsync(async (req, res) => {
    // eslint-disable-next-line
    for (const cartContent of req.body) {
      const { title } = cartContent;
      const { quantity } = cartContent;
      // eslint-disable-next-line
      const product = await Product.findOne({ title });
      const newStockQTY = `${product.stockQty - quantity}`;
      // eslint-disable-next-line
      await Product.findOneAndUpdate(
        { title },
        {
          stockQty: newStockQTY,
        }
      );
    }
    res.end();
  })
);

app.get('/products/thanks', (req, res) => {
  res.render('products/thanks');
});

app.get('/videos', (req, res) => {
  const videos = [
    {
      title: 'The Last Supper (Live)',
      src: 'https://www.youtube.com/embed/kAmVSCMYSjk?list=PL_S3IMjKETpeYY4do7Dff8iySUTW28WIg',
    },
    {
      title: 'Be Prime',
      src: 'https://www.youtube.com/embed/QZEy8VwnOeE?list=PL_S3IMjKETpeYY4do7Dff8iySUTW28WIg',
    },
    {
      title: 'The Moment (Live)',
      src: 'https://www.youtube.com/embed/MsqhXM4PPGk?list=PL_S3IMjKETpeYY4do7Dff8iySUTW28WIg',
    },
    {
      title: 'The Greatest Thing',
      src: 'https://www.youtube.com/embed/7ET6lIz6TkQ?list=PL_S3IMjKETpeYY4do7Dff8iySUTW28WIg',
    },
    {
      title: 'The Moment',
      src: 'https://www.youtube.com/embed/nRofbsT8KoY?list=PL_S3IMjKETpeYY4do7Dff8iySUTW28WIg',
    },
  ];
  res.render('videos', { videos });
});

// =====================================
// ============= errors ================
// =====================================

app.all('*', (req, res, next) => {
  next(new ExpressError('Page Not Found', 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = 'Oh No, Something Went Wrong!';
  res.status(statusCode).render('error', { err });
});

app.listen(3000, () => {
  console.log('listening on port 3000');
});
