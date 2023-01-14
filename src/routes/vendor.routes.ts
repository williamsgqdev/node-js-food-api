import express from 'express';
import { AddFood, GetCurrentOrders, GetFoods, GetOrderDetails, GetVendorProfile, LoginVendor, ProcessOrder, UpdateVendorCoverImage, UpdateVendorProfile, UpdateVendorService } from '../controllers';
import { AUthenticate } from '../middleware';
import multer from 'multer';



const router = express.Router();

const imageStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'images')
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString() + "_" + file.originalname)
    },    
})


const images = multer({ storage: imageStorage }).array('images', 10);




router.post('/login', LoginVendor)

router.use(AUthenticate);
router.get('/profile', GetVendorProfile)
router.patch('/profile', UpdateVendorProfile)
router.patch('/service', UpdateVendorService)

router.post('/foods', images, AddFood)
router.get('/foods', GetFoods)
router.patch('/coverImages' ,images , UpdateVendorCoverImage )

router.get('/orders' , GetCurrentOrders);
router.get('/orders/:id/process' , ProcessOrder);
router.get('/orders/:id' , GetOrderDetails);



export { router as VendorRoutes }