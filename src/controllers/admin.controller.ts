import { Request, Response, NextFunction, request } from "express";
import { CreateVendorInput } from "../dto";
import { Vendor } from "../models";
import { GeneratePassword, GenerateSalt } from "../utility";

export const FindVendor = async (id: string | undefined, email?: string) => {
    if (email) {
        return await Vendor.findOne({ email })
    } else {
        return await Vendor.findById(id)
    }
}
export const CreateVendor = async (req: Request, res: Response) => {
    const { name, address, pinCode, foodType, email, password, ownerName, phone } = <CreateVendorInput>req.body;

    const vendorExist = await FindVendor('', email);

    if (vendorExist) {
        return res.status(400).json({
            message: 'Email address already exists'
        })
    }

    const salt = await GenerateSalt();
    const hashpassword = await GeneratePassword(password, salt);
    const newVendor = await Vendor.create(
        {
            name,
            address,
            pinCode,
            foodType,
            email,
            password: hashpassword,
            ownerName,
            phone,
            salt,
            rating: 0,
            serviceAvailability: false,
            coverImages: [],
            foods: []
        }
    )

    return res.json(newVendor);
}
export const GetVendors = async (req: Request, res: Response) => {

    const vendors = await Vendor.find();

    if (vendors != null) {
        res.json(vendors);
    }

    return res.status(404).json({
        message: "No vendors found"
    })

}
export const GetVendorByID = async (req: Request, res: Response) => {
    const id = req.params.id;

    const vendor = await FindVendor(id);

    console.log(vendor);


    if (vendor) {
        return res.json(vendor);
    }


    return res.status(404).json({
        message: 'Vendor not found'
    })
}