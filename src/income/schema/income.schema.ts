import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {Types, Document} from 'mongoose';
import {UserEntity} from "../../user/schema/user.schema";

@Schema({timestamps: true, versionKey: false})
export class IncomeEntity {
    @Prop({
        required: false,
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
        required: true,
        type: Types.ObjectId,
        ref: UserEntity.name,
    })
    user: Types.ObjectId;

    @Prop({
        required: false,
        trim: true,
    })
    kindOfMoney?: string;

    @Prop({
        required: false,
    })
    raisingCapitalAtTheEnd?: number;

    @Prop({
        required: false,
        trim: true,
    })
    raisingCapitalAtTheEndLastYear?: number;

    @Prop({
        required: false,
    })
    raisingCapitalAtTheEndExchange?: number;

    @Prop({
        required: false,
    })
    raisingCapitalAtTheEndExchangeLastYear?: number;

    @Prop({
        required: false,
    })
    raisingCapitalAtTheEndKKH?: number;

    @Prop({
        required: false,
    })
    raisingCapitalAtTheEndKKHLastYear?: number;

    @Prop({
        required: false,
    })
    raisingCapitalAtTheEndKKHExchange?: number;
    @Prop({
        required: false,
    })
    raisingCapitalAtTheEndKKHExchangeLastYear?: number;

    @Prop({
        required: false,
    })
    raisingCapitalAtTheEndCKH?: number;
    @Prop({
        required: false,
    })
    raisingCapitalAtTheEndCKHLastYear?: number;

    @Prop({
        required: false,
    })
    raisingCapitalAtTheEndCKHExchange?: number;
    @Prop({
        required: false,
    })
    raisingCapitalAtTheEndCKHExchangeLastYear?: number;

    @Prop({
        required: false,
    })
    raisingCapitalAvg?: number;
    @Prop({
        required: false,
    })
    raisingCapitalAvgLastYear?: number;

    @Prop({
        required: false,
        trim: true,
    })
    raisingCapitalAvgExchange?: number;
    @Prop({
        required: false,
    })
    raisingCapitalAvgExchangeLastYear?: number;

    @Prop({
        required: false,
    })
    raisingCapitalKKHAvg?: number;
    @Prop({
        required: false,
    })
    raisingCapitalKKHAvgLastYear?: number;

    @Prop({
        required: false,
    })
    raisingCapitalKKHAvgExchange?: number;
    @Prop({
        required: false,
    })
    raisingCapitalKKHAvgExchangeLastYear?: number;

    @Prop({
        required: false,
    })
    raisingCapitalCKHAvg?: number;
    @Prop({
        required: false,
    })
    raisingCapitalCKHAvgLastYear?: number;

    @Prop({
        required: false,
    })
    raisingCapitalCKHAvgExchange?: number;
    @Prop({
        required: false,
    })
    raisingCapitalCKHAvgExchangeLastYear?: number;

    @Prop({
        required: false,
    })
    amountDebtCreditAtTheEnd?: number;
    @Prop({
        required: false,
    })
    amountDebtCreditAtTheEndLastYear?: number;

    @Prop({
        required: false,
    })
    amountDebtCreditAtTheEndExchange?: number;
    @Prop({
        required: false,
    })
    amountDebtCreditAtTheEndExchangeLastYear?: number;

    @Prop({
        required: false,
    })
    amountDebtCreditTDHAtTheEnd?: number;
    @Prop({
        required: false,
    })
    amountDebtCreditTDHAtTheEndLastYear?: number;

    @Prop({
        required: false,
    })
    amountDebtCreditTDHAtTheEndExchange?: number;
    @Prop({
        required: false,
    })
    amountDebtCreditTDHAtTheEndExchangeLastYear?: number;

    @Prop({
        required: false,
    })
    amountDebtCreditAvgAtTheEnd?: number;
    @Prop({
        required: false,
    })
    amountDebtCreditAvgAtTheEndLastYear?: number;

    @Prop({
        required: false,
    })
    amountDebtCreditAvgAtTheEndExchange?: number;
    @Prop({
        required: false,
    })
    amountDebtCreditAvgAtTheEndExchangeLastYear?: number;

    @Prop({
        required: false,
    })
    amountDebtCreditTDHAvgAtTheEnd?: number;
    @Prop({
        required: false,
    })
    amountDebtCreditTDHAvgAtTheEndLastYear?: number;

    @Prop({
        required: false,
    })
    amountDebtCreditTDHAvgAtTheEndExchange?: number;
    @Prop({
        required: false,
    })
    amountDebtCreditTDHAvgAtTheEndExchangeLastYear?: number;

    @Prop({
        required: false,
    })
    amountDebtLoanGTCGAndEndCard?: number;
    @Prop({
        required: false,
    })
    amountDebtLoanGTCGAndEndCardLastYear?: number;

    @Prop({
        required: false,
    })
    amountDebtLoanGTCGAndAvgCard?: number;
    @Prop({
        required: false,
    })
    amountDebtLoanGTCGAndAvgCardLastYear?: number;

    @Prop({
        required: false,
    })
    incomeFTPBaseMore?: number;
    @Prop({
        required: false,
    })
    incomeFTPBaseMoreLastYear?: number;

    @Prop({
        required: false,
    })
    incomeFromInterestFTPBaseMore?: number;
    @Prop({
        required: false,
    })
    incomeFromInterestFTPBaseMoreLastYear?: number;

    @Prop({
        required: false,
    })
    incomeGuaranteeActivities?: number;
    @Prop({
        required: false,
    })
    incomeGuaranteeActivitiesLastYear?: number;

    @Prop({
        required: false,
    })
    incomeHDVFTPBaseMore?: number;
    @Prop({
        required: false,
    })
    incomeHDVFTPBaseMoreLastYear?: number;

    @Prop({
        required: false,
    })
    incomeOtherInterest?: number;
    @Prop({
        required: false,
    })
    incomeOtherInterestLastYear?: number;

    @Prop({
        required: false,
    })
    incomeExcludeInterest?: number;
    @Prop({
        required: false,
    })
    incomeExcludeInterestLastYear?: number;

    @Prop({
        required: false,
    })
    incomeFromService?: number;
    @Prop({
        required: false,
    })
    incomeFromServiceLastYear?: number;

    @Prop({
        required: false,
    })
    incomeFromCreditFTPBaseMore?: number;
    @Prop({
        required: false,
    })
    incomeFromCreditFTPBaseMoreLastYear?: number;

    @Prop({
        required: false,
    })
    incomeFromToolFinance?: number;
    @Prop({
        required: false,
    })
    incomeFromToolFinanceLastYear?: number;

    @Prop({
        required: false,
    })
    incomeBuyStock?: number;
    @Prop({
        required: false,
    })
    incomeBuyStockLastYear?: number;

    @Prop({
        required: false,
    })
    incomeBuySharesAndContribution?: number;
    @Prop({
        required: false,
    })
    incomeBuySharesAndContributionLastYear?: number;

    @Prop({
        required: false,
    })
    incomeGolden?: number;
    @Prop({
        required: false,
    })
    incomeGoldenLastYear?: number;

    @Prop({
        required: false,
    })
    incomeInterestKDNTPS?: number;
    @Prop({
        required: false,
    })
    incomeInterestKDNTPSLastYear?: number;

    @Prop({
        required: false,
    })
    incomeExcludeInterestKDNTPS?: number;
    @Prop({
        required: false,
    })
    incomeExcludeInterestKDNTPSLastYear?: number;

    @Prop({
        required: false,
    })
    incomeOtherActivity?: number;
    @Prop({
        required: false,
    })
    incomeOtherActivityLastYear?: number;

    @Prop({
        required: false,
    })
    incomeFromDebtCurrency?: number;
    @Prop({
        required: false,
    })
    incomeFromDebtLastYear?: number;

    @Prop({
        required: false,
    })
    incomeFromCardInterestLastYear?: number;

    @Prop({
        required: false,
    })
    incomeFromCardServiceLastYear?: number;

    @Prop({
        required: false,
    })
    incomeFromDebtCurrencyLastYear?: number;

    @Prop({
        required: false,
    })
    incomeFromCardService?: number;

    @Prop({
        required: false,
    })
    incomeFromCardInterest?: number;

    @Prop({
        required: false,
    })
    incomeFromCardAndInterestService?: number;
    @Prop({
        required: false,
    })
    incomeFromCardAndInterestServiceLastYear?: number;

    @Prop({
        required: false,
        trim: true,
    })
    fullName?: string;
}

export const IncomeDatabaseName = 'incomes';
export const IncomeSchema = SchemaFactory.createForClass(IncomeEntity);

export type IncomeDocument = IncomeEntity & Document;

// Hooks
IncomeSchema.pre<IncomeDocument>('save', function (next) {
    next();
});
