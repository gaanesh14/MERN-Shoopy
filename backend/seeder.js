import mongoose from "mongoose";
import dotenv from "dotenv";
import Products from './models/productModels.js'
import Users from './models/userModels.js'
import Cart from './models/cartModels.js'
import products from './data/products.js';

dotenv.config();

if (!process.env.MONGODB_URL) {
  console.error("MONGODB_URL not set in .env");
  process.exit(1);
}

// mongoose.connect(process.env.MONGODB_URL)
// .then(() => console.log("MongoDB Connected"))
//   .catch(err => console.log("Mongo Error:", err));

const seedData = async () => {
    try{
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("MongoDB connected");

        await Products.deleteMany();
        await Users.deleteMany();
        await Cart.deleteMany();

        // create a default admin user
        // const createUser = await Users.create({
        //     name:"Admin User",
        //     email:"admin@example.com",
        //     password:'123456',
        //     role:"admin"
        // });

        const userID = createUser._id;
        
        const sampleProduct = products.map((product) => {
            return {...product, user: userID}
        });
        await Products.insertMany(sampleProduct)
        console.log("product data seeded successfully!");
        process.exit(0)
        } catch(error){
           console.error("Error seeding the data:", error);
           process.exit(1)
    }
}
seedData();