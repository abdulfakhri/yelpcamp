// Require Model
const Campground = require("../models/Campground");

// Connect Mongoose
const mongoose = require('mongoose');
main().catch(err => console.log(err));

async function main()
{
    await mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');

    // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/yelp-camp');` if your database has auth enabled
}

// Import data from seeds
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');

// A function returning random array
const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () =>
{
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++)
    {
        const randomThousand = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground(
            {
               author: '69974a49239d6dfd10676082',
               location: `${cities[randomThousand].city}, ${cities[randomThousand].state}`,
               title: `${sample(descriptors)} ${sample(places)}`,
               image: `https://picsum.photos/400?random=${Math.random()}`,
               description:  'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusamus ad asperiores aspernatur, atque, beatae commodi ducimus ea ex id iure iusto maiores minima numquam odit provident quisquam suscipit tempore vel!',
                price,
                geometry:
                    {
                        type: 'Point',
                        coordinates:
                            [
                                cities[randomThousand].longitude,
                                cities[randomThousand].latitude,
                            ]
                    },
                images:
                [
                    {
                        url: 'https://res.cloudinary.com/douqbebwk/image/upload/v1600060601/YelpCamp/ahfnenvca4tha00h2ubt.png',
                        filename: 'YelpCamp/ahfnenvca4tha00h2ubt'
                    },
                    {
                        url: 'https://res.cloudinary.com/douqbebwk/image/upload/v1600060601/YelpCamp/ruyoaxgf72nzpi4y6cdi.png',
                        filename: 'YelpCamp/ruyoaxgf72nzpi4y6cdi'
                    }
                ]
            });
        await camp.save();
    }
}

//Returns promise
seedDB().then(() =>
{
    mongoose.connection.close();
});