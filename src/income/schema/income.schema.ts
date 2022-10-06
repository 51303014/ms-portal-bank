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
        trim: true,
    })
    raisingCapitalAtTheEnd?: number;

    @Prop({
        required: false,
        trim: true,
    })
    raisingCapitalAtTheEndLastYear?: number;

    @Prop({
        required: false,
        trim: true,
    })
    raisingCapitalAtTheEndExchange?: number;

    @Prop({
        required: false,
        trim: true,
    })
    raisingCapitalAtTheEndExchangeLastYear?: number;

    @Prop({
        required: false,
        trim: true,
    })
    raisingCapitalAtTheEndKKH?: number;

    @Prop({
        required: false,
        trim: true,
    })
    raisingCapitalAtTheEndKKHLastYear?: number;

    @Prop({
        required: false,
        trim: true,
    })
    raisingCapitalAtTheEndKKHExchange?: number;
    @Prop({
        required: false,
        trim: true,
    })
    raisingCapitalAtTheEndKKHExchangeLastYear?: number;

    @Prop({
        required: false,
        trim: true,
    })
    raisingCapitalAtTheEndCKH?: number;
    @Prop({
        required: false,
        trim: true,
    })
    raisingCapitalAtTheEndCKHLastYear?: number;

    @Prop({
        required: false,
        trim: true,
    })
    raisingCapitalAtTheEndCKHExchange?: number;
    @Prop({
        required: false,
        trim: true,
    })
    raisingCapitalAtTheEndCKHExchangeLastYear?: number;

    @Prop({
        required: false,
        trim: true,
    })
    raisingCapitalAvg?: number;
    @Prop({
        required: false,
        trim: true,
    })
    raisingCapitalAvgLastYear?: number;

    @Prop({
        required: false,
        trim: true,
    })
    raisingCapitalAvgExchange?: number;
    @Prop({
        required: false,
        trim: true,
    })
    raisingCapitalAvgExchangeLastYear?: number;

    @Prop({
        required: false,
        trim: true,
    })
    raisingCapitalKKHAvg?: number;
    @Prop({
        required: false,
        trim: true,
    })
    raisingCapitalKKHAvgLastYear?: number;

    @Prop({
        required: false,
        trim: true,
    })
    raisingCapitalKKHAvgExchange?: number;
    @Prop({
        required: false,
        trim: true,
    })
    raisingCapitalKKHAvgExchangeLastYear?: number;

    @Prop({
        required: false,
        trim: true,
    })
    raisingCapitalCKHAvg?: number;
    @Prop({
        required: false,
        trim: true,
    })
    raisingCapitalCKHAvgLastYear?: number;

    @Prop({
        required: false,
        trim: true,
    })
    raisingCapitalCKHAvgExchange?: number;
    @Prop({
        required: false,
        trim: true,
    })
    raisingCapitalCKHAvgExchangeLastYear?: number;


    @Prop({
        required: false,
        trim: true,
    })
    amountDebtCreditAtTheEnd?: number;
    @Prop({
        required: false,
        trim: true,
    })
    amountDebtCreditAtTheEndLastYear?: number;

    @Prop({
        required: false,
        trim: true,
    })
    amountDebtCreditAtTheEndExchange?: number;
    @Prop({
        required: false,
        trim: true,
    })
    amountDebtCreditAtTheEndExchangeLastYear?: number;

    @Prop({
        required: false,
        trim: true,
    })
    amountDebtCreditTDHAtTheEnd?: number;
    @Prop({
        required: false,
        trim: true,
    })
    amountDebtCreditTDHAtTheEndLastYear?: number;

    @Prop({
        required: false,
        trim: true,
    })
    amountDebtCreditTDHAtTheEndExchange?: number;
    @Prop({
        required: false,
        trim: true,
    })
    amountDebtCreditTDHAtTheEndExchangeLastYear?: number;

    @Prop({
        required: false,
        trim: true,
    })
    amountDebtCreditAvgAtTheEnd?: number;
    @Prop({
        required: false,
        trim: true,
    })
    amountDebtCreditAvgAtTheEndLastYear?: number;

    @Prop({
        required: false,
        trim: true,
    })
    amountDebtCreditAvgAtTheEndExchange?: number;
    @Prop({
        required: false,
        trim: true,
    })
    amountDebtCreditAvgAtTheEndExchangeLastYear?: number;

    @Prop({
        required: false,
        trim: true,
    })
    amountDebtCreditTDHAvgAtTheEnd?: number;
    @Prop({
        required: false,
        trim: true,
    })
    amountDebtCreditTDHAvgAtTheEndLastYear?: number;

    @Prop({
        required: false,
        trim: true,
    })
    amountDebtCreditTDHAvgAtTheEndExchange?: number;
    @Prop({
        required: false,
        trim: true,
    })
    amountDebtCreditTDHAvgAtTheEndExchangeLastYear?: number;

    @Prop({
        required: false,
        trim: true,
    })
    amountDebtLoanGTCGAndEndCard?: number;
    @Prop({
        required: false,
        trim: true,
    })
    amountDebtLoanGTCGAndEndCardLastYear?: number;

    @Prop({
        required: false,
        trim: true,
    })
    amountDebtLoanGTCGAndAvgCard?: number;
    @Prop({
        required: false,
        trim: true,
    })
    amountDebtLoanGTCGAndAvgCardLastYear?: number;

    @Prop({
        required: false,
        trim: true,
    })
    incomeFTPBaseMore?: number;
    @Prop({
        required: false,
        trim: true,
    })
    incomeFTPBaseMoreLastYear?: number;

    @Prop({
        required: false,
        trim: true,
    })
    incomeFromInterestFTPBaseMore?: number;
    @Prop({
        required: false,
        trim: true,
    })
    incomeFromInterestFTPBaseMoreLastYear?: number;

    @Prop({
        required: false,
        trim: true,
    })
    incomeGuaranteeActivities?: number;
    @Prop({
        required: false,
        trim: true,
    })
    incomeGuaranteeActivitiesLastYear?: number;

    @Prop({
        required: false,
        trim: true,
    })
    incomeHDVFTPBaseMore?: number;
    @Prop({
        required: false,
        trim: true,
    })
    incomeHDVFTPBaseMoreLastYear?: number;

    @Prop({
        required: false,
        trim: true,
    })
    incomeOtherInterest?: number;
    @Prop({
        required: false,
        trim: true,
    })
    incomeOtherInterestLastYear?: number;

    @Prop({
        required: false,
        trim: true,
    })
    incomeExcludeInterest?: number;
    @Prop({
        required: false,
        trim: true,
    })
    incomeExcludeInterestLastYear?: number;

    @Prop({
        required: false,
        trim: true,
    })
    incomeFromService?: number;
    @Prop({
        required: false,
        trim: true,
    })
    incomeFromServiceLastYear?: number;

    @Prop({
        required: false,
        trim: true,
    })
    incomeFromCreditFTPBaseMore?: number;
    @Prop({
        required: false,
        trim: true,
    })
    incomeFromCreditFTPBaseMoreLastYear?: number;

    @Prop({
        required: false,
        trim: true,
    })
    incomeFromToolFinance?: number;
    @Prop({
        required: false,
        trim: true,
    })
    incomeFromToolFinanceLastYear?: number;

    @Prop({
        required: false,
        trim: true,
    })
    incomeBuyStock?: number;
    @Prop({
        required: false,
        trim: true,
    })
    incomeBuyStockLastYear?: number;

    @Prop({
        required: false,
        trim: true,
    })
    incomeBuySharesAndContribution?: number;
    @Prop({
        required: false,
        trim: true,
    })
    incomeBuySharesAndContributionLastYear?: number;

    @Prop({
        required: false,
        trim: true,
    })
    incomeGolden?: number;
    @Prop({
        required: false,
        trim: true,
    })
    incomeGoldenLastYear?: number;

    @Prop({
        required: false,
        trim: true,
    })
    incomeInterestKDNTPS?: number;
    @Prop({
        required: false,
        trim: true,
    })
    incomeInterestKDNTPSLastYear?: number;

    @Prop({
        required: false,
        trim: true,
    })
    incomeExcludeInterestKDNTPS?: number;
    @Prop({
        required: false,
        trim: true,
    })
    incomeExcludeInterestKDNTPSLastYear?: number;

    @Prop({
        required: false,
        trim: true,
    })
    incomeOtherActivity?: number;
    @Prop({
        required: false,
        trim: true,
    })
    incomeOtherActivityLastYear?: number;

    @Prop({
        required: false,
        trim: true,
    })
    incomeFromDebt?: number;
    @Prop({
        required: false,
        trim: true,
    })
    incomeFromDebtLastYear?: number;

    @Prop({
        required: false,
        trim: true,
    })
    incomeFromCardAndInterestService?: number;
    @Prop({
        required: false,
        trim: true,
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
