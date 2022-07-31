import {CustomerDocument} from "../customers/schema/customer.schema";
import {IUserDocument} from "../user/user.interface";

export interface IOtherInfoCustomerDocument extends Omit<CustomerDocument, 'user'> {
    user: IUserDocument;
}
export interface IOtherInfoCustomerCreate {
    cif?: string;
    productsApply?: string;
    dateKHCCAdditional?: Date;
    programsApplied?: string;
    priorityKHRegistered?: string;
    expensesPayed?: string;
    habitsCustomer?: string;
    favouriteCustomer?: string;
}

export type IOtherInfoCustomerUpdate = Pick<IOtherInfoCustomerCreate, 'cif'>;
