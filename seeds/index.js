const mongoose = require('mongoose');

const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Restaurant = require('../models/restaurant');

mongoose.connect('mongodb://localhost:27017/restaurant-reviewer', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Restaurant.deleteMany({});
    for (let i = 0; i < 50; i++) 
    {
        const random20 = Math.floor(Math.random() * 20);
        const rest = new Restaurant({
            location: `${cities[random20].city}, ${cities[random20].state}`,
            title: `${sample(descriptors)} ${sample(places)}`
        })
        await rest.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})