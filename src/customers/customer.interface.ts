import {IUserDocument} from "../user/user.interface";
import {CustomerDocument} from "./schema/customer.schema";

export interface ICustomerDocument extends Omit<CustomerDocument, 'user'> {
    user: IUserDocument;
}

export interface ICustomerCreate {
    cif?: string;
    typeCard?: string;
    customerId?: string;
    fullName?: string;
    brandCifOpen?: number;
    age?: number;
    dateCifOpen?: Date;
    createdDate?: Date;
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
    totalCreditBalanceAvgBeginYear?: number;
    totalCreditBalanceAvgLastYear?: number;
    totalDepositBalanceAvgLastYear?: number;
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
    coreDebt?: number;
    coreDebtLastYear?: number;
    accountNumberDebitDomestic?: string;
    cardNumberDebitDomestic?: string;
    typeProductDebitDomestic?: string;
    typeChipDebitDomestic?: string;
    codeDebitDomestic?: string;
    statusDebitDomestic?: string;
    formPHTDebitDomestic?: string;
    codeAM?: string;
    cardNumberDebitInternational?: string;
    accountNumberDefaultLinkedCard?: string;
    amountFeeAnnually?: string;
    statusCardDebitInternational?: string;
    expiredDateCardDebitInternational?: Date;
    activeDateCardDebitInternational?: Date;
    typeCardDebitInternational?: string;
    codeCardDebitInternational?: string;
    department?: string;
    typeCreditCard?: string;
    accountNumberCreditCard?: string;
    accountIdCreditCard?: string;
    accountCreditCardLink?: string;
    limitAmountCreditCard?: string;
    statusCreditCard?: string;
    rateDebtAutoCreditCard?: string;
    activeDateCreditCard?: Date;
    activeDateAgainCreditCard?: Date;
    expiredDateCreditCard?: Date;
    closedDateCreditCard?: Date;
    activeDateFirstTimeCreditCard?: Date;
    statusChangeDateCreditCard?: Date;
    formIssueCreditCard?: string;
    transactionAmountCreditCard?: string;
    transactionAmountWriteCreditCard?: string;
    transactionAmountDebtCreditCard?: string;
    amountFeeCreditCard?: string;
    amountFeeServiceCreditCard?: string;
    feeServiceCreditCard?: string;
    numberOfTransactionsCreditCard?: string;
    numberOfTransactionsWriteCreditCard?: string;
    numberOfTransactionsDebtCreditCard?: string;
    totalDebtTSDB?: string;
    debtShortTSDB?: string;
    debtMediumTSDB?: string;
    debtLongTSDB?: string;
    valueTSDB?: number;
    property?: string;
    saveMoney?: string;
    otherAsset?: string;
    productServiceBrandTGCKH?: string;
    productServiceBrandTGTT?: string;
    productServiceBrandLOAN?: string;
    productServiceBrandOverdraft?: string;
    productServiceBrandTTTM?: string;
    productServiceBrandVisaCard?: string;
    productServiceBrandMasterCard?: string;
    productServiceBrandATMCard?: string;
    productServiceBrandRegisterSalary?: string;
    productServiceBrandStock?: string;
    productServiceBrandSmartBanking?: string;
    productServiceBrandBSMS?: string;
    productServiceBrandBANKPlus?: string;
    productServiceBrandVNTopup?: string;
    productServiceBrandCollectAndPay?: string;
    productServiceBrandTCC?: string;
    productServiceBrandIBank?: string;
    productServiceBrandBillElectricUNCAuto?: string;
    productServiceBrandExcludeBillElectricUNCAuto?: string;
    productServiceBrandTotalProductUse?: string;
    productServiceSystemTGCKH?: string;
    productServiceSystemTGTT?: string;
    productServiceSystemLOAN?: string;
    productServiceSystemOverdraft?: string;
    productServiceSystemTTTM?: string;
    productServiceSystemVisaCard?: string;
    productServiceSystemMasterCard?: string;
    productServiceSystemATMCard?: string;
    productServiceSystemRegisterSalary?: string;
    productServiceSystemStock?: string;
    productServiceSystemSmartBanking?: string;
    productServiceSystemBSMS?: string;
    productServiceSystemBANKPlus?: string;
    productServiceSystemVNTopup?: string;
    productServiceSystemCollectAndPay?: string;
    productServiceSystemTCC?: string;
    productServiceSystemIBank?: string;
    productServiceSystemBillElectricUNCAuto?: string;
    productServiceSystemExcludeBillElectricUNCAuto?: string;
    productServiceSystemTotalProductUse?: string;
    codeDepartmentLevelSix?: string;
    kindOfMoney?: string;
    raisingCapitalAtTheEnd?: string;
    raisingCapitalAtTheEndExchange?: string;
    raisingCapitalAtTheEndKKH?: string;
    raisingCapitalAtTheEndKKHExchange?: string;
    raisingCapitalAtTheEndCKH?: string;
    raisingCapitalAtTheEndCKHExchange?: string;
    raisingCapitalAvg?: string;
    raisingCapitalAvgExchange?: string;
    raisingCapitalKKHAvg?: string;
    raisingCapitalKKHAvgExchange?: string;
    raisingCapitalCKHAvg?: string;
    raisingCapitalCKHAvgExchange?: string;
    amountDebtCreditAtTheEnd?: string;
    amountDebtCreditAtTheEndExchange?: string;
    amountDebtCreditTDHAtTheEnd?: string;
    amountDebtCreditTDHAtTheEndExchange?: string;
    amountDebtCreditAvgAtTheEnd?: string;
    amountDebtCreditAvgAtTheEndExchange?: string;
    amountDebtCreditTDHAvgAtTheEnd?: string;
    amountDebtCreditTDHAvgAtTheEndExchange?: string;
    amountDebtLoanGTCGAndEndCard?: string;
    amountDebtLoanGTCGAndAvgCard?: string;
    incomeFTPBaseMore?: string;
    incomeFromInterestFTPBaseMore?: string;
    incomeGuaranteeActivities?: string;
    incomeHDVFTPBaseMore?: string;
    incomeOtherInterest?: string;
    incomeExcludeInterest?: string;
    incomeFromService?: string;
    incomeFromCreditFTPBaseMore?: string;
    incomeFromToolFinance?: string;
    incomeBuyStock?: string;
    incomeBuySharesAndContribution?: string;
    incomeGolden?: string;
    incomeExcludeInterestKDNTPS?: string;
    incomeOtherActivity?: string;
    incomeInterestKDNTPS?: string;
    incomeFromDebt?: string;
    incomeFromCardAndInterestService?: string;
    totalValueTSDB?: number;
    user?: string;
}

export type ICustomerUpdate = Pick<ICustomerCreate, 'cif' | 'customerId'>;

export interface ICustomerCheckExist {
    file: boolean;
    user: boolean;
}

export type FileName = 'InfoCustomerMis' | 'InfoCustomerMisLastYear' | 'InfoCustomer' | 'InfoCustomerIncomeScale' |
    'InfoCustomerIncomeScaleLastYear' | 'InfoCustomerCoreDebtLastYear' | 'InfoCustomerCoreDebt' | 'InfoDebitDomesticCard' |
    'InfoDebitInternationalCard' | 'InfoCreditInternationalCard' | 'InfoDetailTSDB' | 'InfoProductServiceBrand' | 'InfoProductServiceSystem' |
    'InfoRelevantCustomer' | 'InfoRelevantCompany' | 'InfoWorkWithCustomer' | 'InfoOtherCustomer'

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
    InfoRelevantCustomer = 'InfoRelevantCustomer',
    InfoRelevantCompany = 'InfoRelevantCompany',
    InfoWorkWithCustomer = 'InfoWorkWithCustomer',
    InfoOtherCustomer = 'InfoOtherCustomer',
}

export interface CustomerFile {
    fileType: FileName
}
