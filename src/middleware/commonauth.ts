import { NextFunction, Request, Response } from "express"
import { AuthPayload } from "../dto/auth.dto"
import { ValidateSignature } from "../utility"

declare global {
    namespace Express {
        interface Request {
            user?: AuthPayload
        }
    }
}


export const AUthenticate = async (req: Request, res: Response, next: NextFunction) => {
    const validate = await ValidateSignature(req);

    if (validate) {
        next();
    } else {
        return res.status(400).json({
            message: "User not Authorized"
        })
    }
}