import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { APP_SECRET } from '../config';
import { Request } from 'express';
import { AuthPayload } from '../dto/auth.dto';


export const GenerateSalt = async () => {
    return await bcrypt.genSalt(10);
}


export const GeneratePassword = async (password: string, salt: string) => {
    return await bcrypt.hash(password, salt)
}


export const ValidatePassword = async (password: string, savedPassword: string, salt: string) => {
    return await GeneratePassword(password, salt) === savedPassword;
}

export const GenerateSignature = (payload: AuthPayload) => {
    return jwt.sign(payload, APP_SECRET, {
        expiresIn: '1d'
    })
}

export const ValidateSignature = async (req: Request) => {
    const signature = req.get('Authorization');

    if (signature) {
        const payload = jwt.verify(signature.split(' ')[1], APP_SECRET) as AuthPayload;

        req.user = payload;

        return true;
    }

    return false;
}