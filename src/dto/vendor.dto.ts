export interface CreateVendorInput {
    name: string;
    ownerName: string;
    foodType: [string];
    pinCode: string;
    address: string;
    phone: string;
    email: string;
    password: string;
}

export interface EditVendorInput {
    name: string;
    address: string;
    phone: string;
    foodType: [string]
}

export interface VendorLogin {
    email: string;
    password: string;
}


export interface VendorPayload {
    _id: string;
    email: string;
    name: string;
    foodType: [string]
}