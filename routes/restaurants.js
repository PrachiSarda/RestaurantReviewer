const express = require('express');
const router = express.Router();
const multer = require('multer');

const restaurants = require('../controllors/restaurants')
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, validateRestaurant} = require('../middleware');

const { storage } = require('../cloudinary');
const upload = multer({ storage });

router.route('/')
    .get(catchAsync(restaurants.index))
    // .post(isLoggedIn, upload.array('image'), validateRestaurant, catchAsync(restaurants.createRestaurant))
    .post(upload.array('image'), (req, res) => {
        console.log(req.body, req.files)
        res.send("IT WORKED");
    })

router.get('/new', isLoggedIn, restaurants.renderNewForm)

router.route('/:id')
    .get(catchAsync(restaurants.showRestaurant))
    .put(isLoggedIn, isAuthor, validateRestaurant, catchAsync(restaurants.updateRestaurant))
    .delete(isLoggedIn, isAuthor, catchAsync(restaurants.deleteRestaurant));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(restaurants.renderEditForm))

module.exports = router;