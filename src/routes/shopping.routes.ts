import express from 'express';
import { GetFoodAvailability, GetFoodsIn30min, GetTopResturants, ResturantById, SearchFoods } from '../controllers/';

const router = express.Router();

router.get('/:pincode', GetFoodAvailability);
router.get('/top-resturant/:pincode', GetTopResturants);
router.get('/foods-in-30-mins/:pincode', GetFoodsIn30min);
router.get('/search/:pincode', SearchFoods);
router.get('/resturant/:id', ResturantById);

export { router as ShoppingRoutes };