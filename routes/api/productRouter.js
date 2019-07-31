const express = require('express');
const bodyParser = require('body-parser');
const mongoose=require('mongoose');
const productRouter = express.Router();
const authenticate=require('../../authenticate');
const cors = require('../cors');
const Products=require('../../models/products');
var multer = require('multer');

productRouter.use(bodyParser.json());

var storage = multer.diskStorage(
    {
      destination: (req, file, cb) => {
          cb(null, 'client/public/uploads/');
      },
  
      filename: (req, file, cb) => {
          filenameSplit=file.originalname.split(".");
          cb(null, filenameSplit[0]+Date.now()+"."+filenameSplit[filenameSplit.length-1])
      }
    }  
  );

// File filter
const imageFileFilter = (req, file, cb) => {
    if(!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return cb(new Error('You can upload only image files!'), false);
    }
    cb(null, true);
};

const upload = multer({ storage: storage, fileFilter: imageFileFilter});
  
productRouter.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.corsWithOptions,(req,res,next) => {
    Products.find(req.query)
    .populate('owner')
    .sort({views : -1})
    .then((products)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(products);
    },(err)=>(next(err)))
    .catch((err)=>(next(err)))
})

.post(cors.corsWithOptions,authenticate.verifyUser,upload.array('images',4),(req, res, next) => {
    Products.create({...req.body,images: [(req.files[0]?'client/public/uploads/'+req.files[0].filename:''),
    (req.files[1]?'client/public/uploads/'+req.files[1].filename:''),(req.files[2]?'client/public/uploads/'+req.files[2].filename:''),(req.files[3]?'client/public/uploads/'+req.files[3].filename:'')],
    owner: req.user._id})
    .then((product)=>{
        Products.findById(product._id)
        .populate('owner')
        .then((product)=>{
            res.statusCode=200;
            res.setHeader('Content-Type','application/json');
            res.json(product);
        },(err)=>(next(err)))
       
    .catch((err)=>(next(err))) 
},(err)=>(next(err)))       
.catch((err)=>(next(err)))
})
.put(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /products');
})

.delete(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
    res.statusCode = 403;
    res.end('DELETE operation not supported on /products');

/*   Products.remove({})
    .then((resp) => {
        console.log("Removed All Products");
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));*/
});

productRouter.route('/:productId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); 
    res.setHeader('Access-Control-Allow-Credentials', 'true')})
.get(cors.corsWithOptions,(req,res,next) => {
    Products.findById(req.params.productId)
    .populate('owner')
    .then((product)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(product);
    },(err)=>(next(err)))
    .catch((err)=>(next(err)));
})

.post(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /products/'+ req.params.productId);
})

.put(cors.corsWithOptions,authenticate.verifyUser,(req, res, next) => {
 
 Products.findByIdAndUpdate(req.params.productId,{
     $set: req.body
 },{new: true})
 .populate('owner')
 .then((product) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(product);
}, (err) => next(err))
.catch((err) => res.status(400).json({success: false}));
})

.delete(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
    Products.findByIdAndRemove(req.params.productId)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({_id: req.params.productId,success: true});
    }, (err) => next(err))
    .catch((err) =>  res.status(400).json({success: false}));
});

productRouter.route('/approve/:productId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); 
    res.setHeader('Access-Control-Allow-Credentials', 'true')})
.post(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
    Products.findByIdAndUpdate(req.params.productId,{
        $set: {approved: true}
    },{new: true})
    .populate('owner')
    .then((product)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(product);
    },(err)=>(next(err)))
    .catch((err)=>(next(err))) 
})


module.exports = productRouter;