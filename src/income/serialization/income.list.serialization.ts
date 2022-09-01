import { Exclude, Type } from 'class-transformer';
import { Types } from 'mongoose';
import { IAwsS3Response } from 'src/aws/aws.interface';

export class IncomeListSerialization {
    @Type(() => String)
    readonly _id: string;

    @Type(() => String)
    readonly cif: string;
    readonly codeAM: string;
    readonly fullName: string;
    readonly kindOfMoney: string;
    readonly incomeFTPBaseMore: string;
    readonly incomeFromInterestFTPBaseMore: string;
    readonly incomeFromCreditFTPBaseMore: string;
    readonly incomeGuaranteeActivities: string;
    readonly incomeHDVFTPBaseMore: string;
    readonly incomeOtherInterest: string;
    readonly incomeExcludeInterest: string;
    readonly incomeFromService: string;
    readonly incomeFromToolFinance: string;
    readonly incomeBuyStock: string;
    readonly incomeBuySharesAndContribution: string;
    readonly incomeGolden: string;
    readonly incomeInterestKDNTPS: string;
    readonly incomeExcludeInterestKDNTPS: string;
    readonly incomeFromCardAndInterestService: string;
    readonly incomeFromDebt: string;
    readonly incomeOtherActivity: string;


    @Exclude()

    readonly createdAt: Date;

    @Exclude()
    readonly updatedAt: Date;
}
