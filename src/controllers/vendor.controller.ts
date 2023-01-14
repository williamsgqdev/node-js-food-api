import { Request, Response } from "express";
import { CreateFoodInput, EditVendorInput, VendorLogin } from "../dto";
import { Food, Order } from "../models";
import { GenerateSignature, ValidatePassword } from "../utility";
import { FindVendor } from "./admin.controller";



export const LoginVendor = async (req: Request, res: Response) => {
    const { email, password } = <VendorLogin>req.body;


    const vendorExist = await FindVendor('', email);

    if (vendorExist) {
        const validatepassword = await ValidatePassword(password, vendorExist.password, vendorExist.salt);
        if (validatepassword) {

            const signature = GenerateSignature({
                _id: vendorExist._id,
                email: vendorExist.email,
                name: vendorExist.name,
                foodType: vendorExist.foodType,
            })

            return res.json(signature);
        }
    }

    return res.status(400).json({
        message: 'Invalid Login Credentials'
    })
}

export const GetVendorProfile = async (req: Request, res: Response) => {
    const user = req.user;

    if (user) {
        const vendorExist = await FindVendor(user._id);

        return res.json(vendorExist);
    }


    return res.status(404).json({
        message: 'Invalid Vendor Profile'
    });
}
export const UpdateVendorProfile = async (req: Request, res: Response) => {

    const { name, address, phone, foodType } = <EditVendorInput>req.body;

    const user = req.user;

    if (user) {
        const vendorExist = await FindVendor(user._id);


        if (vendorExist) {

            vendorExist.name = name;
            vendorExist.address = address;
            vendorExist.phone = phone;
            vendorExist.foodType = foodType;
            const savedResult = await vendorExist.save();
            return res.json(savedResult);
        }

        return res.status(500).json({
            message: "some error occurred"
        })

    }


    return res.status(404).json({
        message: 'Invalid Vendor Profile'
    });

}
export const UpdateVendorService = async (req: Request, res: Response) => {

    const user = req.user;

    if (user) {
        const vendorExist = await FindVendor(user._id);


        if (vendorExist) {

            vendorExist.serviceAvailability = !vendorExist.serviceAvailability;
            const savedResult = await vendorExist.save();
            return res.json(savedResult);
        }

        return res.status(500).json({
            message: "some error occurred"
        })

    }


    return res.status(404).json({
        message: 'Invalid Vendor'
    });

}

export const UpdateVendorCoverImage = async (req: Request, res: Response) => {

    const vendor = await FindVendor(req.user?._id);

    if (vendor !== null) {

        const files = req.files as [Express.Multer.File];

        const images = files.map((file: Express.Multer.File) => file.filename);

        vendor.coverImages.push(...images);
        const result = await vendor.save();

        return res.json(result);
    }


    res.status(404).json({
        message: "Vendor not found"
    })

}
export const AddFood = async (req: Request, res: Response) => {

    const { name, description, category, foodType, readyTime, price } = <CreateFoodInput>req.body;

    const vendor = await FindVendor(req.user?._id);

    if (vendor !== null) {

        const files = req.files as [Express.Multer.File];

        const images = files.map((file: Express.Multer.File) => file.filename);

        const food = await Food.create({
            vendorId: vendor._id,
            name,
            description,
            category,
            foodType,
            images: images,
            readyTime,
            price,
            rating: 0
        })


        vendor.foods.push(food);
        const result = await vendor.save();

        return res.json(result);
    }


    res.status(404).json({
        message: "Vendor not found"
    })



}
export const GetFoods = async (req: Request, res: Response) => {

    const user = req.user;

    if (user) {
        const foods = await Food.find({ vendorId: user._id })

        if (foods !== null) {
            return res.json(foods);
        }


    }
    return res.status(404).json({ message: "No Food found for this vendor" });
}


export const GetCurrentOrders = async (req: Request, res: Response) => {
    const orderId = req.params.id;

    if (orderId) {
        const order = await Order.findById(orderId).populate('items.food');
        if (!order) {
            return res.status(200).json(order);
        }
    }
    return res.status(404).json({ message: "No Order found" });
}
export const GetOrderDetails = async (req: Request, res: Response) => {
    const user = req.user;

    if (user) {
        const orders = await Order.find({ venndorId: req.user._id }).populate('items.food');

        if (!orders) {
            return res.status(200).json(orders);
        }
    }
    return res.status(404).json({ message: "No Orders found" });
}

export const ProcessOrder = async (req: Request, res: Response) => {

}