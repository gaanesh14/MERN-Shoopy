import express from 'express'
import User from '../models/userModels.js'
import {protect,admin} from '../Middleware/authMiddleware.js'

const router = express.Router()

router.get('/',protect,admin,async(req,res) => {
    try {
        const users = await User.find({})
        res.json(users);
    } catch (error) {
        console.error(error)
        res.status(500).json({message:"server error"})
    }
})

// @route POST /api/admin/users
// @desc Add a new User (admin only)
// @access private admin

router.post('/',protect,admin,async(req,res) => {
    const {name, email, password, role} = req.body;
    try {
        let user = await User.findOne({email});
        if(user){
            return res.status(400).json({message:"user already exists"})
        }
        user = new User({
            name,
            email,
            password,
            role:role||"customer",
        });
        await user.save();
        res.status(201).json({message:"User created successfully",user})
    } catch (error) {
        console.error(error)
        res.status(500).json({message:"server error"})
    }
})

//@route PUT /api/admin/users/:id
// @desc Update user Info (admin only) - name,email and role
// @access private/admin

router.put("/:id",protect,admin, async(req,res) => {
    try {
        const user = await User.findById(req.params.id)
        if(user){
            user.name = req.body.name || user.name
            user.email = req.body.email || user.email
            user.role = req.body.role || user.role
        }
        const updateUser = await user.save();
        res.json({message:"user updated successfully:",user:updateUser});
    } catch (error) {
        console.error(error)
        res.status(500).json({message:"server error"})
    }
})

// @route DELETE /api/admin/users/:id
// @desc Delete a user
// @access Private/Admin
router.delete("/:id",protect,admin,async(req,res) => {
    try {
        const user = await User.findById(req.params.id);
        if(user){
            await user.deleteOne()
            res.json({message:"User deleted successfully"})
        }else{
            res.status(404).json({message:"user not found"})
        }
    } catch (error) {
        console.error(error)
        res.status(500).json({message:"server error"})
    }
}) 
export default router;