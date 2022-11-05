import {CustomerDocument} from "../customers/schema/customer.schema";
import {IUserDocument} from "../user/user.interface";
import {Types} from "mongoose";

export interface IOtherInfoCustomerDocument extends Omit<CustomerDocument, 'user'> {
    user: IUserDocument;
}
export interface IOtherInfoCustomerCreate {
    _id?: Types.ObjectId;
    cif?: string;
    productsApply?: string;
    dateKHCCAdditional?: Date;
    programsApplied?: string;
    priorityKHRegistered?: string;
    expensesPayed?: string;
    habitsCustomer?: string;
    favouriteCustomer?: string;
    user?: string;
}

export type IOtherInfoCustomerUpdate = Pick<IOtherInfoCustomerCreate, 'cif'>;
