import { UserPayload } from "./user.dto";
import { VendorPayload } from "./vendor.dto";

export type AuthPayload = VendorPayload | UserPayload;