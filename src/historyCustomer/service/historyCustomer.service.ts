import {Injectable} from '@nestjs/common';
import {Model, Types} from 'mongoose';
import {plainToInstance} from 'class-transformer';
import {DatabaseEntity} from 'src/database/database.decorator';
import {PermissionEntity} from 'src/permission/schema/permission.schema';
import {IDatabaseFindAllOptions, IDatabaseFindOneOptions,} from 'src/database/database.interface';
import {UserEntity} from "../../user/schema/user.schema";
import {
    HistoryCustomerEntity,
    HistoryCustomerDocument,
} from '../schema/historyCustomer.schema';
import { IHistoryCustomerCreate } from '../historyCustomer.interface';
import { HistoryCustomerListSerialization } from '../serialization/historyCustomer.list.serialization';
import { HistoryCustomerGetSerialization } from '../serialization/historyCustomer.get.serialization';
import { IIncomeCreate } from '../../income/income.interface';

@Injectable()
export class HistoryCustomerService {

    constructor(
        @DatabaseEntity(HistoryCustomerEntity.name)
        private readonly historyModel: Model<HistoryCustomerDocument>,
    ) {
    }

    async findAll<T>(
        find?: Record<string, any>,
        options?: IDatabaseFindAllOptions
    ): Promise<T[]> {
        const files = this.historyModel.find(find);

        if (
            options &&
            options.limit !== undefined &&
            options.skip !== undefined
        ) {
            files.limit(options.limit).skip(options.skip);
        }

        if (options && options.sort) {
            files.sort(options.sort);
        }

        return files.lean();
    }

    async getTotal(find?: Record<string, any>): Promise<number> {
        return this.historyModel.countDocuments(find);
    }


    async serializationList(
        data: HistoryCustomerDocument[]
    ): Promise<HistoryCustomerListSerialization[]> {
        return plainToInstance(HistoryCustomerListSerialization, data);
    }

    async serializationGet(data: HistoryCustomerDocument): Promise<HistoryCustomerGetSerialization> {
        return plainToInstance(HistoryCustomerGetSerialization, data);
    }

    async findOneById<T>(
        _id: string,
        options?: IDatabaseFindOneOptions
    ): Promise<T> {
        const file = this.historyModel.findById(_id);

        if (options && options.populate && options.populate.user) {
            file.populate({
                path: 'user',
                model: UserEntity.name,
            });

            if (options.populate.permission) {
                file.populate({
                    path: 'user',
                    model: UserEntity.name,
                    populate: {
                        path: 'permissions',
                        model: PermissionEntity.name,
                    },
                });
            }
        }

        return file.lean();
    }

    async findOne<T>(
        find?: Record<string, any>,
        options?: IDatabaseFindOneOptions
    ): Promise<T> {
        const file = this.historyModel.findOne(find);

        if (options && options.populate && options.populate.user) {
            file.populate({
                path: 'user',
                model: UserEntity.name,
            });

            if (options.populate.permission) {
                file.populate({
                    path: 'user',
                    model: UserEntity.name,
                    populate: {
                        path: 'permissions',
                        model: PermissionEntity.name,
                    },
                });
            }
        }

        return file.lean();
    }

    async create({
                     incomeCreateDated,
                     cif,
                     codeAM,
                     fullName,
                     codeDepartmentLevelSix,
                     raisingCapitalAtTheEnd,
                     raisingCapitalAtTheEndExchange,
                     raisingCapitalAtTheEndKKH,
                     raisingCapitalAtTheEndKKHExchange,
                     raisingCapitalAtTheEndCKH,
                     raisingCapitalAtTheEndCKHExchange,
                     raisingCapitalAvg,
                     raisingCapitalAvgExchange,
                     raisingCapitalKKHAvg,
                     raisingCapitalKKHAvgExchange,
                     raisingCapitalCKHAvg,
                     raisingCapitalCKHAvgExchange,
                     amountDebtCreditAtTheEnd,
                     amountDebtCreditAtTheEndExchange,
                     amountDebtCreditTDHAtTheEnd,
                     amountDebtCreditTDHAtTheEndExchange,
                     amountDebtCreditAvgAtTheEnd,
                     amountDebtCreditAvgAtTheEndExchange,
                     amountDebtCreditTDHAvgAtTheEnd,
                     amountDebtCreditTDHAvgAtTheEndExchange,
                     amountDebtLoanGTCGAndEndCard,
                     amountDebtLoanGTCGAndAvgCard,
                     incomeFTPBaseMore,
                     incomeFromInterestFTPBaseMore,
                     incomeGuaranteeActivities,
                     incomeHDVFTPBaseMore,
                     incomeOtherInterest,
                     incomeExcludeInterest,
                     incomeFromService,
                     incomeFromCreditFTPBaseMore,
                     incomeFromToolFinance,
                     incomeBuyStock,
                     incomeBuySharesAndContribution,
                     incomeGolden,
                     incomeExcludeInterestKDNTPS,
                     incomeOtherActivity,
                     incomeInterestKDNTPS,
                     incomeFromDebtCurrency,
                     incomeFromCardService,
                     incomeFromCardInterest,
                     incomeFromCardAndInterestService
                 }: IHistoryCustomerCreate
    ): Promise<HistoryCustomerDocument> {
        const historyEntity: HistoryCustomerEntity = {
            incomeCreateDated,
            cif,
            fullName,
            codeAM,
            codeDepartmentLevelSix,
            incomeFromCardAndInterestService,
            incomeFromDebtCurrency,
            incomeInterestKDNTPS,
            incomeOtherActivity,
            incomeExcludeInterestKDNTPS,
            incomeGolden,
            incomeBuySharesAndContribution,
            incomeBuyStock,
            incomeFromToolFinance,
            incomeFromCreditFTPBaseMore,
            incomeFromService,
            incomeExcludeInterest,
            incomeOtherInterest,
            incomeHDVFTPBaseMore,
            incomeGuaranteeActivities,
            incomeFromInterestFTPBaseMore,
            incomeFromCardService,
            incomeFromCardInterest,
            incomeFTPBaseMore,
            raisingCapitalAtTheEnd,
            raisingCapitalAtTheEndExchange,
            raisingCapitalAtTheEndKKH,
            raisingCapitalAtTheEndKKHExchange,
            raisingCapitalAtTheEndCKH,
            raisingCapitalAtTheEndCKHExchange,
            raisingCapitalAvg,
            raisingCapitalAvgExchange,
            raisingCapitalKKHAvg,
            raisingCapitalKKHAvgExchange,
            raisingCapitalCKHAvg,
            raisingCapitalCKHAvgExchange,
            amountDebtCreditAtTheEnd,
            amountDebtCreditAtTheEndExchange,
            amountDebtCreditTDHAtTheEnd,
            amountDebtCreditTDHAtTheEndExchange,
            amountDebtCreditAvgAtTheEnd,
            amountDebtCreditAvgAtTheEndExchange,
            amountDebtCreditTDHAvgAtTheEnd,
            amountDebtCreditTDHAvgAtTheEndExchange,
            amountDebtLoanGTCGAndEndCard,
            amountDebtLoanGTCGAndAvgCard
        };

        const create: HistoryCustomerDocument = new this.historyModel(historyEntity);
        return create.save();
    }
    
    

    async deleteOneById(_id: string): Promise<HistoryCustomerDocument> {
        return this.historyModel.findByIdAndDelete(_id);
    }

    async deleteOne(find: Record<string, any>): Promise<HistoryCustomerDocument> {
        return this.historyModel.findOneAndDelete(find);
    }

}
