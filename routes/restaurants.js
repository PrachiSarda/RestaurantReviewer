const express = require('express');
const router = express.Router();

const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const { restaurantSchema } = require('../schemas.js');
const Restaurant = require('../models/restaurant');
const { isLoggedIn } = require('../middleware');

const validateRestaurant = (req, res, next) => {
    const { error } = restaurantSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}


router.get('/', catchAsync(async (req, res) => {
    const restaurants = await Restaurant.find({});
    res.render('restaurants/index', { restaurants })
}));

router.get('/new', isLoggedIn, (req, res) => {
    res.render('restaurants/new');
})

router.post('/', isLoggedIn, validateRestaurant, catchAsync(async (req, res, next) => {
    const restaurant = new Restaurant(req.body.restaurant);
    await restaurant.save();
    req.flash('success', 'Successfully made a new restaurant!');
    res.redirect(`/restaurants/${restaurant._id}`)
}))

router.get('/:id/edit', isLoggedIn, catchAsync(async (req, res) => {
    const restaurant = await Restaurant.findById(req.params.id)
    if(!restaurant) {
        req.flash('error', 'Cannot find that restaurant!');
        return res.redirect('/restaurants');
    }
    res.render('restaurants/edit', { restaurant });
}))

router.put('/:id', isLoggedIn, validateRestaurant, catchAsync(async (req, res) => {
    const { id } = req.params;
    const restaurant = await Restaurant.findByIdAndUpdate(id, { ...req.body.restaurant });
    req.flash('success', 'Successfully updated campground!');
    res.redirect(`/restaurants/${restaurant._id}`)
}));

router.get('/:id', isLoggedIn, catchAsync(async (req, res,) => {
    const restaurant = await Restaurant.findById(req.params.id).populate('reviews');
    if(!restaurant) {
        req.flash('error', 'Cannot find that restaurant!');
        return res.redirect('/restaurants');
    }
    res.render('restaurants/show', { restaurant });
}));

router.delete('/:id', isLoggedIn, catchAsync(async (req, res) => {
    const { id } = req.params;
    await Restaurant.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted campground')
    res.redirect('/restaurants');
}))

module.exports = router;