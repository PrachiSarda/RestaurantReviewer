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
        const price = Math.floor(Math.random() * 1000) + 50;
        const rest = new Restaurant({
            author: '5f9feba9bb168c1f70329484',
            location: `${cities[random20].city}, ${cities[random20].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!',
            price,
            images: [ 
                { 
                    url: 'https://res.cloudinary.com/daaq0pagg/image/upload/v1604690846/RestaurantReviewer/cy3nwsuon4gumjk6rsmw.jpg',
                    filename: 'RestaurantReviewer/cy3nwsuon4gumjk6rsmw' 
                },
                { 
                    url: 'https://res.cloudinary.com/daaq0pagg/image/upload/v1604690846/RestaurantReviewer/ql0qpjzj41eo78hia27n.jpg',
                    filename: 'RestaurantReviewer/ql0qpjzj41eo78hia27n' 
                } 
            ]
        })
        await rest.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})