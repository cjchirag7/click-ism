const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authenticate = require('../../authenticate');
const cors = require('../cors');

const Favorites = require('../../models/favorite');

const favoriteRouter = express.Router();

favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')
.options(cors.corsWithOptions, (req, res) => {
    res.sendStatus = 200;
})
.get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({user: req.user._id})
    .populate('user')
    .populate('products')
    .then((favorite) => {
        if (favorite != null) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(favorite);
        } else {
            err = new Error(`You have no favorite`);
            err.status = 404;
            return next(err);
        }
    }, (err) => {
        next(err);
    })
    .catch((err) => {
        next(err);
    });
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({user: req.user._id})
    .then((favorite) => {
        if (favorite != null) {
            for (let i = 0; i < req.body.length; i++) {
                if (favorite.products.indexOf(req.body[i]._id) == -1) {
                    favorite.products.push(req.body[i]._id);
                }
            }
            favorite.save()
             .then((favorite_unpopulated) => {
                 Favorites.findOne({user: req.user._id})
                .populate('user')
                .populate('products')
                .then((favorite)=>{
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorite);    
                },(err) => {
                    next(err);
                })
                .catch((err) => {
                    next(err);
                });    
            }, (err) => {
                next(err);
            })
            .catch((err) => {
                next(err);
            });
        } else {
            Favorites.create({
                user: req.user._id,
                products: []
            })
            .then((favorite) => {
                for (let i = 0; i < req.body.length; i++) {
                    favorite.products.push(req.body[i]._id);
                }
                favorite.save()
                .then((favorite_unpopulated) => {
                    Favorites.findOne({user: req.user._id})
                   .populate('user')
                   .populate('products')
                   .then((favorite)=>{
                       res.statusCode = 200;
                       res.setHeader('Content-Type', 'application/json');
                       res.json(favorite);    
                   },(err) => {
                       next(err);
                   })
                   .catch((err) => {
                       next(err);
                   });    
               }, (err) => {
                   next(err);
               })
               .catch((err) => {
                   next(err);
               });
            }, (err) => {
                next(err);
            })
            .catch((err) => {
                next(err);
            });
        }
    }, (err) => {
        next(err);
    })
    .catch((err) => {
        next(err);
    });
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end(`PUT operation not supported on /favorites!`);
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOneAndRemove({ user: req.user._id })
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => {
        next(err);
    })
    .catch((err) => {
        next(err);
    });
});

favoriteRouter.route('/:productId')
.options(cors.corsWithOptions, (req, res) => {
    res.sendStatus = 200;
})
.get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({user: req.user._id})
    .then((favorites) => {
        if (!favorites) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            return res.json({"exists": false, "favorites": favorites});
        }
        else {
            if (favorites.products.indexOf(req.params.productId) < 0) {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                return res.json({"exists": false, "favorites": favorites});
            }
            else {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                return res.json({"exists": true, "favorites": favorites});
            }
        }

    }, (err) => next(err))
    .catch((err) => next(err))
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({user: req.user._id})
    .then((favorite) => {
        if (favorite != null) {
            if (favorite.products.indexOf(req.params.productId) != -1) {
                err = new Error(`User ${req.user._id} has marked product ${req.params.productId} favorite already`);
                err.status = 400;
                return next(err);
            } else {
                favorite.products.push(req.params.productId);
                favorite.save()
                .then((favorite_unpopulated) => {
                    Favorites.findOne({user: req.user._id})
                   .populate('user')
                   .populate('products')
                   .then((favorite)=>{
                       res.statusCode = 200;
                       res.setHeader('Content-Type', 'application/json');
                       res.json(favorite);    
                   },(err) => {
                       next(err);
                   })
                   .catch((err) => {
                       next(err);
                   });    
               }, (err) => {
                   next(err);
               })
               .catch((err) => {
                   next(err);
               });
            }
        } else {
            Favorites.create({
                user: req.user._id,
                products: [req.params.productId]
            })
            .then((favorite_unpopulated) => {
                Favorites.findOne({user: req.user._id})
                .populate('user')
                .populate('products')
                .then((favorite)=>{
                
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorite);
            },(err) => {
                next(err);
            })
            .catch((err) => {
                next(err);
            });    
            }, (err) => {
                next(err);
            })
            .catch((err) => {
                next(err);
            })
        }
    }, (err) => {
        next(err);
    })
    .catch((err) => {
        next(err);
    });
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end(`PUT operation not supported on /favorites/${req.params.productId}!`);
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({user: req.user._id})
    .then((favorite) => {
        if (favorite != null) {
            const index = favorite.products.indexOf(req.params.productId);
            if (index != -1) {
                favorite.products.splice(index, 1);
                favorite.save()
                .then((favorite_unpopulated) => {
                    Favorites.findOne({user: req.user._id})
                   .populate('user')
                   .populate('products')
                   .then((favorite)=>{
                       res.statusCode = 200;
                       res.setHeader('Content-Type', 'application/json');
                       res.json(favorite);    
                   },(err) => {
                       next(err);
                   })
                   .catch((err) => {
                       next(err);
                   });    
               }, (err) => {
                   next(err);
               })
               .catch((err) => {
                   next(err);
               });
            } else {
                err = new Error(`User ${req.user._id} has not marked product ${req.params.productId} favorite`);
                err.status = 400;
                return next(err);
            }
        } else {
            err = new Error(`User ${req.user._id} does not have any favorite product`);
            err.status = 404;
            return next(err);
        }
    }, (err) => {
        next(err);
    })
    .catch((err) => {
        next(err);
    });
});

module.exports = favoriteRouter;