const express=require('express');
const mongoose=require('mongoose');
const bodyParser=require('body-parser');
const path=require('path');

require('dotenv').config();
var passport = require('passport');
var authenticate = require('./authenticate');


// Loading routers
const productRouter = require('./routes/api/productRouter');
const userRouter = require('./routes/api/userRouter');
const bidRouter = require('./routes/api/bidRouter');
var favoriteRouter = require('./routes/api/favoriteRouter');

const app= express();

app.use(function(req, res, next) {

  res.header("Access-Control-Allow-Origin", "*");

  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

  next();

});

// Bodyparser Middleware
app.use(bodyParser.json());

// DB config
const mongoURI = process.env.mongoURI;

// Connect to mongo
mongoose.connect(mongoURI,{ useNewUrlParser: true, useCreateIndex: true,useFindAndModify:false})
.then(()=> {console.log("MongoDB Connected");})
.catch(err => console.log(err));

app.use(passport.initialize());

// Use routes
app.use('/api/products',productRouter);
app.use('/api/users',userRouter);
app.use('/api/bids',bidRouter);
app.use('/api/favorites',favoriteRouter);

// Serve static assets if in production
if (process.env.NODE_ENV === 'production') {
    // Set static folder
    app.use(express.static('client/build'));

    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
  }

const port = process.env.PORT || 5000;

app.listen(port, ()=> console.log(`Server started running on port ${port}`));