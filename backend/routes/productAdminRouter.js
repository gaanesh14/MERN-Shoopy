import express from 'express'
import Product from '../models/productModels.js'
import { protect,admin } from '../Middleware/authMiddleware.js'

const router = express.Router();

// @router GET /api/admin/products

router.get('/',protect,admin, async(req,res) => {
    try {
        const products = await Product.find({})
        res.json(products)
    } catch (error) {
        console.error(error)
        res.status(500).json({message:"Server Error"})
    }
})

export default router;