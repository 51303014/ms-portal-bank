import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {Types, Document} from 'mongoose';
import {UserEntity} from "../../user/schema/user.schema";

@Schema({timestamps: true, versionKey: false})
export class CustomerEntity {
    @Prop({
        required: false,
        trim: true,
        index: true
    })
    cif: string;

    @Prop({
        required: false,
        trim: true,
        index: true
    })
    codeAM?: string;

    @Prop({
        required: false,
        trim: true,
        index: true
    })
    codeDepartmentLevelSix?: string;

    @Prop({
        required: false,
        trim: true,
    })
    kindOfMoney?: string;

    @Prop({
        required: false,
        trim: true,
    })
    raisingCapitalAtTheEnd?: string;

    @Prop({
        required: false,
        trim: true,
    })
    raisingCapitalAtTheEndExchange?: string;

    @Prop({
        required: false,
        trim: true,
    })
    raisingCapitalAtTheEndKKH?: string;

    @Prop({
        required: false,
        trim: true,
    })
    raisingCapitalAtTheEndKKHExchange?: string;

    @Prop({
        required: false,
        trim: true,
    })
    raisingCapitalAtTheEndCKH?: string;

    @Prop({
        required: false,
        trim: true,
    })
    raisingCapitalAtTheEndCKHExchange?: string;

    @Prop({
        required: false,
        trim: true,
    })
    raisingCapitalAvg?: string;

    @Prop({
        required: false,
        trim: true,
    })
    raisingCapitalAvgExchange?: string;

    @Prop({
        required: false,
        trim: true,
    })
    raisingCapitalKKHAvg?: string;

    @Prop({
        required: false,
        trim: true,
    })
    raisingCapitalKKHAvgExchange?: string;

    @Prop({
        required: false,
        trim: true,
    })
    raisingCapitalCKHAvg?: string;

    @Prop({
        required: false,
        trim: true,
    })
    raisingCapitalCKHAvgExchange?: string;


    @Prop({
        required: false,
        trim: true,
    })
    amountDebtCreditAtTheEnd?: string;

    @Prop({
        required: false,
        trim: true,
    })
    amountDebtCreditAtTheEndExchange?: string;

    @Prop({
        required: false,
        trim: true,
    })
    amountDebtCreditTDHAtTheEnd?: string;

    @Prop({
        required: false,
        trim: true,
    })
    amountDebtCreditTDHAtTheEndExchange?: string;

    @Prop({
        required: false,
        trim: true,
    })
    amountDebtCreditAvgAtTheEnd?: string;

    @Prop({
        required: false,
        trim: true,
    })
    amountDebtCreditAvgAtTheEndExchange?: string;

    @Prop({
        required: false,
        trim: true,
    })
    amountDebtCreditTDHAvgAtTheEnd?: string;

    @Prop({
        required: false,
        trim: true,
    })
    amountDebtCreditTDHAvgAtTheEndExchange?: string;

    @Prop({
        required: false,
        trim: true,
    })
    amountDebtLoanGTCGAndEndCard?: string;

    @Prop({
        required: false,
        trim: true,
    })
    amountDebtLoanGTCGAndAvgCard?: string;

    @Prop({
        required: false,
        trim: true,
    })
    incomeFTPBaseMore?: string;

    @Prop({
        required: false,
        trim: true,
    })
    incomeFromInterestFTPBaseMore?: string;

    @Prop({
        required: false,
        trim: true,
    })
    incomeGuaranteeActivities?: string;

    @Prop({
        required: false,
        trim: true,
    })
    incomeHDVFTPBaseMore?: string;

    @Prop({
        required: false,
        trim: true,
    })
    incomeOtherInterest?: string;

    @Prop({
        required: false,
        trim: true,
    })
    incomeExcludeInterest?: string;

    @Prop({
        required: false,
        trim: true,
    })
    incomeFromService?: string;

    @Prop({
        required: false,
        trim: true,
    })
    incomeFromCreditFTPBaseMore?: string;

    @Prop({
        required: false,
        trim: true,
    })
    incomeFromToolFinance?: string;

    @Prop({
        required: false,
        trim: true,
    })
    incomeBuyStock?: string;

    @Prop({
        required: false,
        trim: true,
    })
    incomeBuySharesAndContribution?: string;

    @Prop({
        required: false,
        trim: true,
    })
    incomeGolden?: string;

    @Prop({
        required: false,
        trim: true,
    })
    incomeInterestKDNTPS?: string;

    @Prop({
        required: false,
        trim: true,
    })
    incomeExcludeInterestKDNTPS?: string;

    @Prop({
        required: false,
        trim: true,
    })
    incomeOtherActivity?: string;

    @Prop({
        required: false,
        trim: true,
    })
    incomeFromDebt?: string;

    @Prop({
        required: false,
        trim: true,
    })
    incomeFromCardAndInterestService?: string;

    @Prop({
        required: false,
        trim: true,
    })
    fullName?: string;

    @Prop({
        required: false,
        trim: true,
    })
    totalDebtTSDB?: string;

    @Prop({
        required: false,
        trim: true,
    })
    debtShortTSDB?: string;

    @Prop({
        required: false,
        trim: true,
    })
    debtMediumTSDB?: string;

    @Prop({
        required: false,
        trim: true,
    })
    debtLongTSDB?: string;

    @Prop({
        required: false
    })
    valueTSDB?: number;

    @Prop({
        required: false,
        trim: true,
    })
    property?: string;

    @Prop({
        required: false,
        trim: true,
    })
    saveMoney?: string;

    @Prop({
        required: false,
        trim: true,
    })
    otherAsset?: string;

    @Prop({
        required: false,
        trim: true,
    })
    productServiceBrandTGCKH?: string;

    @Prop({
        required: false,
        trim: true,
    })
    productServiceBrandTGTT?: string;

    @Prop({
        required: false,
        trim: true,
    })
    productServiceBrandLOAN?: string;

    @Prop({
        required: false,
        trim: true,
    })
    productServiceBrandOverdraft?: string;

    @Prop({
        required: false,
        trim: true,
    })
    productServiceBrandTTTM?: string;

    @Prop({
        required: false,
        trim: true,
    })
    productServiceBrandVisaCard?: string;

    @Prop({
        required: false,
        trim: true,
    })
    productServiceBrandMasterCard?: string;

    @Prop({
        required: false,
        trim: true,
    })
    productServiceBrandATMCard?: string;

    @Prop({
        required: false,
        trim: true,
    })
    productServiceBrandRegisterSalary?: string;

    @Prop({
        required: false,
        trim: true,
    })
    productServiceBrandStock?: string;

    @Prop({
        required: false,
        trim: true,
    })
    productServiceBrandSmartBanking?: string;

    @Prop({
        required: false,
        trim: true,
    })
    productServiceBrandBSMS?: string;

    @Prop({
        required: false,
        trim: true,
    })
    productServiceBrandBANKPlus?: string;

    @Prop({
        required: false,
        trim: true,
    })
    productServiceBrandVNTopup?: string;

    @Prop({
        required: false,
        trim: true,
    })
    productServiceBrandCollectAndPay?: string;

    @Prop({
        required: false,
        trim: true,
    })
    productServiceBrandTCC?: string;

    @Prop({
        required: false,
        trim: true,
    })
    productServiceBrandIBank?: string;

    @Prop({
        required: false,
        trim: true,
    })
    productServiceBrandBillElectricUNCAuto?: string;

    @Prop({
        required: false,
        trim: true,
    })
    productServiceBrandExcludeBillElectricUNCAuto?: string;

    @Prop({
        required: false,
        trim: true,
    })
    productServiceBrandTotalProductUse?: string;


    @Prop({
        required: false,
        trim: true,
    })
    productServiceSystemTGCKH?: string;

    @Prop({
        required: false,
        trim: true,
    })
    productServiceSystemTGTT?: string;

    @Prop({
        required: false,
        trim: true,
    })
    productServiceSystemLOAN?: string;

    @Prop({
        required: false,
        trim: true,
    })
    productServiceSystemOverdraft?: string;

    @Prop({
        required: false,
        trim: true,
    })
    productServiceSystemTTTM?: string;

    @Prop({
        required: false,
        trim: true,
    })
    productServiceSystemVisaCard?: string;

    @Prop({
        required: false,
        trim: true,
    })
    productServiceSystemMasterCard?: string;

    @Prop({
        required: false,
        trim: true,
    })
    productServiceSystemATMCard?: string;

    @Prop({
        required: false,
        trim: true,
    })
    productServiceSystemRegisterSalary?: string;

    @Prop({
        required: false,
        trim: true,
    })
    productServiceSystemStock?: string;

    @Prop({
        required: false,
        trim: true,
    })
    productServiceSystemSmartBanking?: string;

    @Prop({
        required: false,
        trim: true,
    })
    productServiceSystemBSMS?: string;

    @Prop({
        required: false,
        trim: true,
    })
    productServiceSystemBANKPlus?: string;

    @Prop({
        required: false,
        trim: true,
    })
    productServiceSystemVNTopup?: string;

    @Prop({
        required: false,
        trim: true,
    })
    productServiceSystemCollectAndPay?: string;

    @Prop({
        required: false,
        trim: true,
    })
    productServiceSystemTCC?: string;

    @Prop({
        required: false,
        trim: true,
    })
    productServiceSystemIBank?: string;

    @Prop({
        required: false,
        trim: true,
    })
    productServiceSystemBillElectricUNCAuto?: string;

    @Prop({
        required: false,
        trim: true,
    })
    productServiceSystemExcludeBillElectricUNCAuto?: string;

    @Prop({
        required: false,
        trim: true,
    })
    productServiceSystemTotalProductUse?: string;

    @Prop({
        required: false,
        trim: true,
    })
    accountNumberDebitDomestic?: string;


    @Prop({
        required: false,
        trim: true,
    })
    accountNumberDefaultLinkedCard?: string;

    @Prop({
        required: false,
        trim: true,
    })
    amountFeeAnnually?: string;

    @Prop({
        required: false,
        trim: true,
    })
    statusCardDebitInternational?: string;

    @Prop({
        type: Date,
        required: false,
        trim: true,
    })
    expiredDateCardDebitInternational?: Date;

    @Prop({
        type: Date,
        required: false,
        trim: true,
    })
    activeDateCardDebitInternational?: Date;

    @Prop({
        required: false,
        trim: true,
    })
    typeCardDebitInternational?: string;

    @Prop({
        required: false,
        trim: true,
    })
    codeCardDebitInternational?: string;

    @Prop({
        required: false,
        trim: true,
    })
    cardNumberDebitDomestic?: string;
    @Prop({
        required: false,
        trim: true,
    })
    cardNumberDebitInternational?: string;

    @Prop({
        required: false,
        trim: true,
    })
    typeProductDebitDomestic?: string;

    @Prop({
        required: false,
        trim: true,
    })
    typeChipDebitDomestic?: string;

    @Prop({
        required: false,
        trim: true,
    })
    codeDebitDomestic?: string;

    @Prop({
        required: false,
        trim: true,
    })
    statusDebitDomestic?: string;

    @Prop({
        required: false,
        trim: true,
    })
    formPHTDebitDomestic?: string;

    @Prop({
        required: false,
        trim: true,
    })
    department?: string;

    @Prop({
        required: false,
        trim: true,
    })
    typeCreditCard?: string;

    @Prop({
        required: false,
        trim: true,
    })
    accountNumberCreditCard?: string;

    @Prop({
        required: false,
        trim: true,
    })
    accountIdCreditCard?: string;
    @Prop({
        required: false,
        trim: true,
    })
    accountCreditCardLink?: string;

    @Prop({
        required: false,
        trim: true,
    })
    limitAmountCreditCard?: string;

    @Prop({
        required: false,
        trim: true,
    })
    statusCreditCard?: string;

    @Prop({
        required: false,
        trim: true,
    })
    rateDebtAutoCreditCard?: string;

    @Prop({
        type: Date,
        required: false,
        trim: true,
    })
    activeDateCreditCard?: Date;

    @Prop({
        type: Date,
        required: false,
        trim: true,
    })
    activeDateAgainCreditCard?: Date;

    @Prop({
        type: Date,
        required: false,
        trim: true,
    })
    expiredDateCreditCard?: Date;

    @Prop({
        type: Date,
        required: false,
        trim: true,
    })
    closedDateCreditCard?: Date;

    @Prop({
        type: Date,
        required: false,
        trim: true,
    })
    activeDateFirstTimeCreditCard?: Date;

    @Prop({
        type: Date,
        required: false,
        trim: true,
    })
    statusChangeDateCreditCard?: Date;

    @Prop({
        required: false,
        trim: true,
    })
    formIssueCreditCard?: string;

    @Prop({
        required: false,
        trim: true,
    })
    transactionAmountCreditCard?: string;

    @Prop({
        required: false,
        trim: true,
    })
    transactionAmountWriteCreditCard?: string;

    @Prop({
        required: false,
        trim: true,
    })
    amountFeeCreditCard?: string;

    @Prop({
        required: false,
        trim: true,
    })
    amountFeeServiceCreditCard?: string;

    @Prop({
        required: false,
        trim: true,
    })
    feeServiceCreditCard?: string;

    @Prop({
        required: false,
        trim: true,
    })
    numberOfTransactionsCreditCard?: string;

    @Prop({
        required: false,
        trim: true,
    })
    numberOfTransactionsWriteCreditCard?: string;

    @Prop({
        required: false,
        trim: true,
    })
    numberOfTransactionsDebtCreditCard?: string;

    @Prop({
        required: false,
        trim: true,
    })
    transactionAmountDebtCreditCard?: string;

    @Prop({
        required: false
    })
    brandCifOpen: number;

    @Prop({
        required: false
    })
    age: number;

    @Prop({
        type: Date,
        required: false
    })
    dateCifOpen: Date;

    @Prop({
        required: false,
        default: 'VIETNAM',
        trim: true,
    })
    nationality: string;

    @Prop({
        required: false,
        trim: true,
    })
    email: string;

    @Prop({
        required: false,
        trim: true,
    })
    mobile: string;

    @Prop({
        required: false,
        trim: true,
    })
    gender: string;

    @Prop({
        default: 'UNKNOWN',
        required: false,
        trim: true,
    })
    maritalStatus: string;

    @Prop({
        required: false,
        trim: true,
    })
    job: string;

    @Prop({
        required: false,
        trim: true,
    })
    relationshipBank: string;

    @Prop({
        required: false,
        trim: true,
    })
    address: string;

    @Prop({
        required: false,
        trim: true,
    })
    residence: string;

    @Prop({
        type: Date,
        required: false,
        trim: true,
    })
    birthday: Date;

    @Prop({
        required: false,
        trim: true,
    })
    birthPlace: string;

    @Prop({
        required: false,
        trim: true,
    })
    customerId: string;

    @Prop({
        required: false,
        trim: true,
    })
    numberIdentity: string;

    @Prop({
        required: false,
        trim: true,
    })
    customerType: string;

    @Prop({
        required: false,
        trim: true,
    })
    customerSegment: string;

    @Prop({
        required: false,
        trim: true,
    })
    creditBalanceSegment: string;

    @Prop({
        required: false,
        trim: true,
    })
    depositBalanceSegment: string;

    @Prop({
        required: false,
        trim: true,
    })
    debtGroup: string;

    @Prop({
        required: false,
        trim: true,
    })
    incomeBrandYearly: number;

    @Prop({
        required: false,
        trim: true,
    })
    incomeBrandLastYear: number;

    @Prop({
        required: false,
        trim: true,
    })
    incomeTotalYearly: number;

    @Prop({
        required: false,
        trim: true,
    })
    incomeTotalLastYear: number;

    @Prop({
        type: Date,
        required: false,
        trim: true,
    })
    effectiveDate: Date;

    @Prop({
        required: false,
        trim: true,
    })
    statusChangeDate: string;

    @Prop({
        required: true,
        type: Types.ObjectId,
        ref: UserEntity.name,
    })
    user: Types.ObjectId;

    @Prop({
        required: false,
        trim: true,
    })
    currentStatus: string;

    @Prop({
        required: false,
        trim: true,
    })
    previousStatus: string;

    @Prop({
        required: false,
        trim: true,
    })
    creditLimitCustomer?: string;

    @Prop({
        required: false,
        trim: true,
    })
    totalCreditBalanceLastYear?: string;

    @Prop({
        required: false,
        trim: true,
    })
    totalCreditBalanceEndDay?: string;

    @Prop({
        required: false,
        trim: true,
    })
    totalCreditBalanceAvgBeginYear?: number;


    @Prop({
        required: false,
        trim: true,
    })
    totalCreditBalanceAvgLastYear?: number;

    @Prop({
        required: false,
        trim: true,
    })
    balanceDebtLastYear?: string;

    @Prop({
        required: false,
        trim: true,
    })
    balanceDebtEndDay?: string;

    @Prop({
        required: false,
        trim: true,
    })
    balanceCreditLastYear?: string;

    @Prop({
        required: false,
        trim: true,
    })
    balanceCreditEndDay?: string;

    @Prop({
        required: false,
        trim: true,
    })
    overdraftBalanceLastYear?: string;

    @Prop({
        required: false,
        trim: true,
    })
    overdraftBalanceEndDay?: string;

    @Prop({
        required: false,
        trim: true,
    })
    totalDepositBalanceLastYear?: string;

    @Prop({
        required: false,
        trim: true,
    })
    totalDepositBalanceEndDay?: string;

    @Prop({
        required: false,
        trim: true,
    })
    totalDepositBalanceAvgBeginYear?: string;

    @Prop({
        required: false,
        trim: true,
    })
    totalDepositBalanceAvgLastYear?: number;

    @Prop({
        required: false,
        trim: true,
    })
    paymentBalanceDepositLastYear?: string;

    @Prop({
        required: false,
        trim: true,
    })
    paymentBalanceDepositEndDay?: string;

    @Prop({
        required: false,
        trim: true,
    })
    termDepositBalanceLastYear?: string;

    @Prop({
        required: false,
        trim: true,
    })
    termDepositBalanceEndDay?: string;

    @Prop({
        required: false,
        trim: true,
    })
    fileTypeCustomer?: string;
    @Prop({
        required: false,
        trim: true,
    })
    coreDebt?: number;
    @Prop({
        required: false,
        trim: true,
    })
    coreDebtLastYear?: number;

    @Prop({
        required: false,
    })
    totalValueTSDB?: number;
}

export const CustomerDatabaseName = 'customers';
export const CustomerSchema = SchemaFactory.createForClass(CustomerEntity);

export type CustomerDocument = CustomerEntity & Document;

// Hooks
CustomerSchema.pre<CustomerDocument>('save', function (next) {
    if (this.address) {
        this.address = this.address.toLowerCase();
    }
    next();
});
