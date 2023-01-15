import { plainToClass } from "class-transformer";
import { validate } from "class-validator";
import { NextFunction, Request, Response } from "express";
import { CreateUserInput, EditUserProfileInput, LoginInputs, OrderInput } from "../dto";
import { Food, User, Order } from "../models";
import { GenerateOtp, GeneratePassword, GenerateSalt, GenerateSignature, SendOtp, ValidatePassword } from "../utility";

export const UserSignUp = async (req: Request, res: Response, next: NextFunction) => {
    const userInput = plainToClass(CreateUserInput, req.body);

    const inputErrors = await validate(userInput, { validationError: { target: true } });


    if (inputErrors.length > 0) {
        return res.status(400).json(inputErrors);
    }

    const { email, phone, password } = userInput;


    const existingUser = await User.findOne({ email: email });

    if (existingUser) {
        return res.status(409).json({
            message: "Account found , Kindly login"
        })
    }

    const salt = await GenerateSalt();
    const userPassword = await GeneratePassword(password, salt);
    const { otp, expiry } = GenerateOtp();

    const result = await User.create({
        email,
        password: userPassword,
        salt,
        otp,
        otp_expiry: expiry,
        phone,
        firstName: '',
        lastName: '',
        address: '',
        verified: false,
        lat: 0,
        lng: 0,
        orders: []
    })

    if (result) {
        //Send Otp
        await SendOtp(otp, phone);

        //GenerateSignature
        const signature = GenerateSignature({
            _id: result._id,
            email: result.email,
            verified: result.verified
        })

        return res.status(201).json({
            signature,
            verified: result.verified,
            email: result.email,

        })


    }

    return res.status(400).json({ message: 'Error with SignUp' })
}
export const UserLogin = async (req: Request, res: Response, next: NextFunction) => {


    const userInput = plainToClass(LoginInputs, req.body);

    const inputErrors = await validate(userInput, { validationError: { target: true } });


    if (inputErrors.length > 0) {
        return res.status(400).json(inputErrors);
    }

    const { email, password } = userInput;

    const user = await User.findOne({ email });

    if (user) {
        const validation = await ValidatePassword(password, user.password, user.salt);

        if (validation) {
            const signature = GenerateSignature({
                _id: user._id,
                email: user.email,
                verified: user.verified
            })

            return res.status(201).json({
                signature,
                verified: user.verified,
                email: user.email,

            })
        }
    }

    return res.status(404).json({ message: 'Invalid Login Credentials' })


}

export const UserVerify = async (req: Request, res: Response, next: NextFunction) => {
    const { otp } = req.body;

    const user_credentials = req.user;

    if (user_credentials) {
        const user = await User.findById(user_credentials._id)

        if (user) {
            if (user.otp === parseInt(otp) && user.otp_expiry >= new Date()) {
                user.verified = true;

                const updatedUser = await user.save();

                const signature = GenerateSignature({
                    _id: updatedUser._id,
                    email: updatedUser.email,
                    verified: updatedUser.verified
                })

                return res.status(201).json({
                    signature,
                    verified: updatedUser.verified,
                    email: updatedUser.email,

                })
            }
        }

    }

    return res.status(400).json({ message: 'Error with Otp Verification' })


}
export const RequestOtp = async (req: Request, res: Response, next: NextFunction) => {



    const user_credentials = req.user;

    if (user_credentials) {
        const user = await User.findById(user_credentials._id)

        if (user) {
            const { otp, expiry } = GenerateOtp();

            user.otp = otp;
            user.otp_expiry = expiry;

            await user.save();
            await SendOtp(otp, user.phone);

            return res.status(200).json({
                message: "OTP sent to registered Phone number"
            })



        }
    }

    return res.status(400).json({ message: 'Can Not Request Otp' });

}


export const GetUserProfile = async (req: Request, res: Response, next: NextFunction) => {
    const userExist = req.user;

    if (userExist) {
        const user = await User.findById(userExist._id);

        if (user) {
            return res.status(200).json(user);
        }
    }

    return res.status(400).json({ message: 'Error finding user' });

}
export const EditUserProfile = async (req: Request, res: Response, next: NextFunction) => {
    const userExist = req.user;

    const userInput = plainToClass(EditUserProfileInput, req.body);

    const inputErrors = await validate(userInput, { validationError: { target: true } });

    const { firstName, lastName, address } = userInput;

    if (inputErrors.length > 0) {
        return res.status(400).json(inputErrors);
    }




    if (userExist) {
        const user = await User.findById(userExist._id);

        if (user) {

            user.firstName = firstName;
            user.lastName = lastName;
            user.address = address;

            const result = await user.save();


            return res.status(200).json(result);

        }
    }

    return res.status(400).json({ message: 'Error Updating Profile' });

}


export const AddToCart = async (req: Request, res: Response) => {
    const user = req.user;

    if (user) {
        const profile = await User.findById(user._id).populate('cart.food');

        if (profile) {

            let cartItems = Array();

            const { _id, unit } = <OrderInput>req.body;

            const food = await Food.findById(_id);


            if (food) {
                cartItems = profile.cart;

                if (cartItems.length > 0) {
                    const existingFood = cartItems.filter(item => item.food._id.toString() === _id);

                    if (existingFood.length > 0) {
                        const index = cartItems.indexOf(existingFood[0]);

                        if (unit > 0) {
                            cartItems[index] = { food, unit };
                        } else {
                            cartItems.splice(index, 1);
                        }
                    } else {
                        cartItems.push({ food, unit })
                    }

                } else {
                    cartItems.push({ food, unit })
                    console.log(cartItems);

                }
            }




            if (cartItems) {
                profile.cart = cartItems as any
                const cartResult = await profile.save();
                return res.status(200).json(cartResult.cart);
            }


        }

        return res.status(400).json({ message: 'Something went wrong' })
    }
}
export const GetCart = async (req: Request, res: Response) => {
    const user = req.user;

    if (user) {
        const profile = await User.findById(user._id).populate('cart.food');

        return res.status(200).json(profile.cart);
    }

    return res.status(404).json({ message: 'Cart not found' })
}
export const DeleteCart = async (req: Request, res: Response) => {
    const user = req.user;

    if (user) {
        const profile = await User.findById(user._id);
        profile.cart = [] as any;
        const result = await profile.save();
        return res.status(200).json(result.cart);
    }

    return res.status(404).json({ message: 'Cart is already empty' })
}


export const CreateOrder = async (req: Request, res: Response) => {
    const user = req.user

    if (user) {
        const orderId = `${Math.floor(Math.random() * 8999) + 100}`;

        const profile = await User.findById(user._id);


        const cart = <[OrderInput]>req.body;

        let cartItems = Array();

        let netAmount = 0;
        let vendorId;

        //Calculate net amount
        const foods = await Food.find().where('_id').in(cart.map(item => item._id)).exec();

        console.log(foods);

        if (foods.length === 0) {
            return res.status(400).json({ message: 'Not Found' });
        }




        foods.map((food) => {
            cart.map(({ _id, unit }) => {


                if (food._id == _id) {
                    vendorId = food.vendorId;
                    netAmount += (food.price * unit);
                    cartItems.push({ food, unit });
                }
            });
        })

        // console.log(cartItems);


        if (cartItems) {
            const order = await Order.create({
                orderId,
                vendorId,
                items: cartItems,
                totalAmount: netAmount,
                OrderDate: new Date(),
                paidThrough: 'COD',
                paymentResponse: '',
                orderStatus: 'PENDING',
                appliedOffers: false,
                offerId: null,
                readyTime: 45
            })

            if (order) {
                profile.cart = [] as any;
                profile.orders.push(order);
                await profile.save();

                return res.status(200).json(order);
            }
        }

        return res.status(400).json({ message: "Could not create Order" })
    }
}
export const GetOrders = async (req: Request, res: Response) => {

    const user = req.user

    if (user) {

        const profile = await User.findById(user._id).populate('orders');

        if (profile) {
            return res.status(200).json(profile.orders);
        }

    }
    return res.status(400).json({ message: "Could not fetch Order" })

}

export const GetOrderById = async (req: Request, res: Response) => {

    const { id } = req.params;

    if (id) {
        const order = await Order.findById(id).populate('items.food');

        return res.status(200).json(order);
    }
    return res.status(400).json({ message: "Could not fetch Order" })
}