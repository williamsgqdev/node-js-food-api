import express from 'express';
import {
    AddToCart,
    CreateOrder,
    DeleteCart,
    EditUserProfile,
    GetCart,
    GetOrderById,
    GetOrders,
    GetUserProfile,
    RequestOtp,
    UserLogin,
    UserSignUp,
    UserVerify
} from '../controllers';
import { AUthenticate } from '../middleware';


const router = express.Router();

router.post('/signup', UserSignUp)
router.post('/login', UserLogin)
//Auth routes
router.use(AUthenticate);
router.patch('/verify', UserVerify)
router.get('/otp', RequestOtp)
router.get('/profile', GetUserProfile)
router.patch('/profile', EditUserProfile)

//Order Routes
router.post('/orders', CreateOrder);
router.get('/orders', GetOrders);
router.get('/orders/:id', GetOrderById);

//Cart
router.post('/cart', AddToCart);
router.get('/cart', GetCart);
router.delete('/cart', DeleteCart);



export { router as UserRoutes }