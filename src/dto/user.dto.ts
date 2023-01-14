import { IsEmail, Length } from "class-validator";

export class CreateUserInput {
    @IsEmail()
    email: string;
    @Length(7, 12)
    phone: string;
    @Length(6, 12)
    password: string;
}
export class LoginInputs {
    @IsEmail()
    email: string;
    @Length(6, 12)
    password: string;
}


export class EditUserProfileInput {

    @Length(3, 16)
    firstName: string;
    @Length(3, 16)
    lastName: string;
    @Length(6, 16)
    address: string;
}

export interface UserPayload {
    _id: string;
    email: string;
    verified: boolean;
}

export class OrderInput {
    _id: string;
    unit: number;
}