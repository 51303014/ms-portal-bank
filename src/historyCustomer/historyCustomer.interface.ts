import {IUserDocument} from "../user/user.interface";
import { HistoryCustomerDocument } from './schema/historyCustomer.schema';

export interface IHistoryCustomerDocument extends Omit<HistoryCustomerDocument, 'user'> {
    user: IUserDocument;
}

export interface IHistoryCustomerCreate {
    incomeCreateDated?: Date;
    incomeCreateDatedLastYear?: Date;
    cif?: string;
    customerId?: string;
    fullName?: string;
    codeAM?: string;
    department?: string;
    codeDepartmentLevelSix?: string;
    kindOfMoney?: string;
    incomeBrandLastYear?: number;
    incomeTotalLastYear?: number;
    raisingCapitalAtTheEnd?: number;
    raisingCapitalAtTheEndExchange?: number;
    raisingCapitalAtTheEndKKH?: number;
    raisingCapitalAtTheEndKKHExchange?: number;
    raisingCapitalAtTheEndCKH?: number;
    raisingCapitalAtTheEndCKHExchange?: number;
    raisingCapitalAvg?: number;
    raisingCapitalAvgExchange?: number;
    raisingCapitalKKHAvg?: number;
    raisingCapitalKKHAvgExchange?: number;
    raisingCapitalCKHAvg?: number;
    raisingCapitalCKHAvgExchange?: number;
    amountDebtCreditAtTheEnd?: number;
    amountDebtCreditAtTheEndExchange?: number;
    amountDebtCreditTDHAtTheEnd?: number;
    amountDebtCreditTDHAtTheEndExchange?: number;
    amountDebtCreditAvgAtTheEnd?: number;
    amountDebtCreditAvgAtTheEndExchange?: number;
    amountDebtCreditTDHAvgAtTheEnd?: number;
    amountDebtCreditTDHAvgAtTheEndExchange?: number;
    amountDebtLoanGTCGAndEndCard?: number;
    amountDebtLoanGTCGAndAvgCard?: number;
    incomeFTPBaseMore?: number;
    incomeFromInterestFTPBaseMore?: number;
    incomeGuaranteeActivities?: number;
    incomeHDVFTPBaseMore?: number;
    incomeOtherInterest?: number;
    incomeExcludeInterest?: number;
    incomeFromService?: number;
    incomeFromCreditFTPBaseMore?: number;
    incomeFromToolFinance?: number;
    incomeBuyStock?: number;
    incomeBuySharesAndContribution?: number;
    incomeGolden?: number;
    incomeExcludeInterestKDNTPS?: number;
    incomeFromCardService?: number,
    incomeFromCardInterest?: number,
    incomeOtherActivity?: number;
    incomeInterestKDNTPS?: number;
    incomeFromDebtCurrency?: number;
    incomeFromCardAndInterestService?: number;
}

export type ICustomerUpdate = Pick<IHistoryCustomerCreate, 'cif' | 'customerId'>;

export interface ICustomerCheckExist {
    file: boolean;
    user: boolean;
}

