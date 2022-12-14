import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {Document} from 'mongoose';

@Schema({timestamps: true, versionKey: false})
export class HistoryCustomerEntity {
    @Prop({
        required: false,
        trim: true,
        index: true
    })
    cif: string;

    @Prop({
        required: false,
        trim: true,
    })
    incomeInterestKDNTPS?: number;

    @Prop({
        required: false,
        trim: true,
    })
    incomeExcludeInterestKDNTPS?: number;

    @Prop({
        required: false,
        trim: true,
    })
    incomeOtherActivity?: number;

    @Prop({
        required: false,
        trim: true,
    })
    incomeFromDebt?: string;

    @Prop({
        required: false,
        trim: true,
    })
    incomeFromCardAndInterestService?: number;

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
    balanceDebtEndDay?: string;

    @Prop({
        required: false,
        trim: true,
    })
    balanceCreditEndDay?: string;

    @Prop({
        required: false,
        trim: true,
    })
    overdraftBalanceEndDay?: string;


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
    paymentBalanceDepositEndDay?: string;


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
        default: 0,
        required: false,
        trim: true,
    })
    coreDebt?: number;

    @Prop({
        required: false,
    })
    totalValueTSDB?: number;

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
    })
    raisingCapitalAtTheEnd?: number;


    @Prop({
        required: false,
    })
    raisingCapitalAtTheEndExchange?: number;


    @Prop({
        required: false,
    })
    raisingCapitalAtTheEndKKH?: number;

    @Prop({
        required: false,
    })
    raisingCapitalAtTheEndKKHExchange?: number;


    @Prop({
        required: false,
    })
    raisingCapitalAtTheEndCKH?: number;


    @Prop({
        required: false,
    })
    raisingCapitalAtTheEndCKHExchange?: number;


    @Prop({
        required: false,
    })

    @Prop({
        required: false,
        trim: true,
    })
    raisingCapitalAvgExchange?: number;

    @Prop({
        required: false,
        trim: true,
    })
    raisingCapitalAvg?: number;

    @Prop({
        required: false,
    })
    raisingCapitalKKHAvg?: number;
    @Prop({
        required: false,
    })
    raisingCapitalKKHAvgExchange?: number;


    @Prop({
        required: false,
    })
    raisingCapitalCKHAvg?: number;

    @Prop({
        required: false,
    })
    raisingCapitalCKHAvgExchange?: number;


    @Prop({
        required: false,
    })
    amountDebtCreditAtTheEnd?: number;

    @Prop({
        required: false,
    })
    amountDebtCreditAtTheEndExchange?: number;


    @Prop({
        required: false,
    })
    amountDebtCreditTDHAtTheEnd?: number;

    @Prop({
        required: false,
    })
    amountDebtCreditTDHAtTheEndExchange?: number;

    @Prop({
        required: false,
    })
    amountDebtCreditAvgAtTheEnd?: number;

    @Prop({
        required: false,
    })
    amountDebtCreditAvgAtTheEndExchange?: number;

    @Prop({
        required: false,
    })
    amountDebtCreditTDHAvgAtTheEnd?: number;

    @Prop({
        required: false,
    })
    amountDebtCreditTDHAvgAtTheEndExchange?: number;

    @Prop({
        required: false,
    })
    amountDebtLoanGTCGAndEndCard?: number;

    @Prop({
        required: false,
    })
    amountDebtLoanGTCGAndAvgCard?: number;
    @Prop({
        required: false,
    })
    incomeFTPBaseMore?: number;

    @Prop({
        required: false,
    })
    incomeFromInterestFTPBaseMore?: number;

    @Prop({
        required: false,
    })
    incomeGuaranteeActivities?: number;

    @Prop({
        required: false,
    })
    incomeHDVFTPBaseMore?: number;

    @Prop({
        required: false,
    })
    incomeOtherInterest?: number;

    @Prop({
        required: false,
    })
    incomeExcludeInterest?: number;

    @Prop({
        required: false,
    })
    incomeFromService?: number;

    @Prop({
        required: false,
    })
    incomeFromCreditFTPBaseMore?: number;

    @Prop({
        required: false,
    })
    incomeFromToolFinance?: number;

    @Prop({
        required: false,
    })
    incomeBuyStock?: number;

    @Prop({
        required: false,
    })
    incomeBuySharesAndContribution?: number;

    @Prop({
        required: false,
    })
    incomeGolden?: number;

    @Prop({
        required: false,
    })
    incomeFromDebtCurrency?: number;

    @Prop({
        required: false,
    })
    incomeFromCardService?: number;

    @Prop({
        required: false,
    })
    incomeFromCardInterest?: number;


    @Prop({
        type: Date,
        required: false
    })
    incomeCreateDated?: Date;

}

export const HistoryCustomerDatabaseName = 'histories';
export const HistoryCustomerSchema = SchemaFactory.createForClass(HistoryCustomerEntity);

export type HistoryCustomerDocument = HistoryCustomerEntity & Document;

// Hooks
HistoryCustomerSchema.pre<HistoryCustomerDocument>('save', function (next) {
    next();
});
