import {IUserDocument} from "../user/user.interface";
import {IncomeDocument} from "./schema/income.schema";

export interface IIncomeDocument extends Omit<IncomeDocument, 'user'> {
    user: IUserDocument;
}

export interface IIncomeCreate {
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
    raisingCapitalAtTheEndLastYear?: number;
    raisingCapitalAtTheEndExchangeLastYear?: number;
    raisingCapitalAtTheEndKKHLastYear?: number;
    raisingCapitalAtTheEndKKHExchangeLastYear?: number;
    raisingCapitalAtTheEndCKHLastYear?: number;
    raisingCapitalAtTheEndCKHExchangeLastYear?: number;
    raisingCapitalAvgLastYear?: number;
    raisingCapitalAvgExchangeLastYear?: number;
    raisingCapitalKKHAvgLastYear?: number;
    raisingCapitalKKHAvgExchangeLastYear?: number;
    raisingCapitalCKHAvgLastYear?: number;
    raisingCapitalCKHAvgExchangeLastYear?: number;
    amountDebtCreditAtTheEndLastYear?: number;
    amountDebtCreditAtTheEndExchangeLastYear?: number;
    amountDebtCreditTDHAtTheEndLastYear?: number;
    amountDebtCreditTDHAtTheEndExchangeLastYear?: number;
    amountDebtCreditAvgAtTheEndLastYear?: number;
    amountDebtCreditAvgAtTheEndExchangeLastYear?: number;
    amountDebtCreditTDHAvgAtTheEndLastYear?: number;
    amountDebtCreditTDHAvgAtTheEndExchangeLastYear?: number;
    amountDebtLoanGTCGAndEndCardLastYear?: number;
    amountDebtLoanGTCGAndAvgCardLastYear?: number;
    incomeFTPBaseMoreLastYear?: number;
    incomeFromInterestFTPBaseMoreLastYear?: number;
    incomeGuaranteeActivitiesLastYear?: number;
    incomeHDVFTPBaseMoreLastYear?: number;
    incomeOtherInterestLastYear?: number;
    incomeExcludeInterestLastYear?: number;
    incomeFromServiceLastYear?: number;
    incomeFromCreditFTPBaseMoreLastYear?: number;
    incomeFromToolFinanceLastYear?: number;
    incomeBuyStockLastYear?: number;
    incomeBuySharesAndContributionLastYear?: number;
    incomeGoldenLastYear?: number;
    incomeInterestKDNTPSLastYear?: number;
    incomeExcludeInterestKDNTPSLastYear?: number;
    incomeOtherActivityLastYear?: number;
    incomeFromDebtLastYear?: number;
    incomeFromCardAndInterestServiceLastYear?: number;
    incomeFromCardServiceLastYear?: number,
    incomeFromCardInterestLastYear?: number,
    incomeFromDebtCurrencyLastYear?: number,
    totalCreditBalanceAvgLastYear?: number;
    totalDepositBalanceAvgLastYear?: number;
    user: string;
}

export type IIncomeUpdate = Pick<IIncomeCreate, 'cif'>;


export type FileName = 'InfoCustomerMis' | 'InfoCustomerMisLastYear' | 'InfoCustomer' | 'InfoCustomerIncomeScale' |
    'InfoCustomerIncomeScaleLastYear' | 'InfoCustomerCoreDebtLastYear' | 'InfoCustomerCoreDebt' | 'InfoDebitDomesticCard' |
    'InfoDebitInternationalCard' | 'InfoCreditInternationalCard' | 'InfoDetailTSDB' | 'InfoProductServiceBrand' | 'InfoProductServiceSystem'

export enum SheetName {
    InfoCustomerMis = 'InfoCustomerMis',
    InfoCustomerMisLastYear = 'InfoCustomerMisLastYear',
    InfoCustomerIncomeScaleLastYear = 'InfoCustomerIncomeScaleLastYear',
    InfoCustomerIncomeScale = 'InfoCustomerIncomeScale',
    InfoCustomerCoreDebtLastYear = 'InfoCustomerCoreDebtLastYear',
    InfoCustomerCoreDebt = 'InfoCustomerCoreDebt',
    InfoCustomer = 'InfoCustomer',
    InfoDebitDomesticCard = 'InfoDebitDomesticCard',
    InfoDebitInternationalCard = 'InfoDebitInternationalCard',
    InfoCreditInternationalCard = 'InfoCreditInternationalCard',
    InfoDetailTSDB = 'InfoDetailTSDB',
    InfoProductServiceBrand = 'InfoProductServiceBrand',
    InfoProductServiceSystem = 'InfoProductServiceSystem',
}

export interface CustomerFile {
    fileType: FileName
}
