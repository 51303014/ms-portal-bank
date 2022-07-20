import {IUserDocument} from "../user/user.interface";
import {CustomerDocument} from "./schema/customer.schema";

export interface ICustomerDocument extends Omit<CustomerDocument, 'user'> {
    user: IUserDocument;
}

export interface ICustomerCreate {
    cif?: string;
    customerId?: string;
    fullName?: string;
    brandCifOpen?: number;
    age?: number;
    dateCifOpen?: Date;
    birthday?: Date;
    effectiveDate?: Date;
    statusChangeDate?: string;
    nationality?: string;
    birthPlace?: string;
    email?: string;
    mobile?: string;
    gender?: string;
    maritalStatus?: string;
    job?: string;
    relationshipBank?: string;
    address?: string;
    residence?: string;
    numberIdentity?: string;
    customerType?: string;
    customerSegment?: string;
    creditBalanceSegment?: string;
    depositBalanceSegment?: string;
    debtGroup?: string;
    incomeBrandYearly?: string;
    incomeBrandLastYear?: string;
    incomeTotalYearly?: string;
    incomeTotalLastYear?: string;
    currentStatus?: string;
    previousStatus?: string;
    creditLimitCustomer?: string;
    totalCreditBalanceLastYear?: string;
    totalCreditBalanceEndDay?: string;
    totalCreditBalanceAvgBeginYear?: string;
    balanceDebtLastYear?: string;
    balanceDebtEndDay?: string;
    balanceCreditLastYear?: string;
    balanceCreditEndDay?: string;
    overdraftBalanceLastYear?: string;
    overdraftBalanceEndDay?: string;
    totalDepositBalanceLastYear?: string;
    totalDepositBalanceEndDay?: string;
    totalDepositBalanceAvgBeginYear?: string;
    paymentBalanceDepositLastYear?: string;
    paymentBalanceDepositEndDay?: string;
    termDepositBalanceLastYear?: string;
    termDepositBalanceEndDay?: string;
    fileTypeCustomer?: string;
    user: string;
}

export type ICustomerUpdate = Pick<ICustomerCreate, 'cif' | 'customerId'>;

export interface ICustomerCheckExist {
    file: boolean;
    user: boolean;
}

export type FileName = 'InfoCustomerMis' | 'InfoCustomerMisLastYear' | 'InfoCustomer'
export enum SheetName {
    InfoCustomerMis = 'InfoCustomerMis',
    InfoCustomerMisLastYear = 'InfoCustomerMisLastYear',
    InfoCustomer = 'InfoCustomer'
}
export interface CustomerFile {
    fileType: FileName
}
