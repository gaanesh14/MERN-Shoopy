import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from './config/db.js'
import userRoutes from './routes/userRoutes.js'
import productRouter from './routes/productRoutes.js';
import cartRouter from './routes/cartRoutes.js';
import checkRouter from './routes/checkRouter.js';
import orderRouter from './routes/orderRoutes.js'
import uploadRouter from './routes/uploadRouter.js'
import subscribeRouter from './routes/subscriber.js'
import adminRoutes from './routes/adminRoutes.js'
import productAdmin from './routes/productAdminRouter.js'
import orderAdmin from './routes/adminOrderRouter.js'
dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

await connectDB()

// app.use('/', (req,res) => {
//     res.send("hello noede.js")
// })

// api routes

app.use('/api/users', userRoutes)
app.use('/api/products', productRouter) 
app.use('/api/cart', cartRouter)
app.use('/api/checkout',checkRouter)
app.use('/api/orders',orderRouter)
app.use('/api/upload',uploadRouter)
app.use('/api',subscribeRouter)

//admin
app.use('/api/admin/users',adminRoutes)
app.use('/api/admin/products',productAdmin)
app.use('/api/admin/orders',orderAdmin)
let port = process.env.PORT || 3000
app.listen(port,() =>  {
      console.log(`port is running on: ${port}`);
      
})