import express from 'express';
import Subscribe from '../models/subscriberModel.js';

const router = express.Router()

// @route POST /api/scbscribe
// @desc handle newsletter subscription
// @access public

router.post('/subscribe',async(req,res) => {
    const {email} = req.body

    if(!email){
        return res.status(400).json({message:"email is required"})
    }
    try {
        let subscriber = await Subscribe.findOne({email});

        if(subscriber){
            return res.status(400).json({message:"email is already subscribed"})
        }
        // create subscriber
        subscriber = new Subscribe({email});
        await subscriber.save()
        res.status(201).json({message:"Successfully scbscribed to the newsletter"})
    } catch (error) {
        console.error(error);
        res.status(500).json({message:"server Error"})
    }
})

export default router;