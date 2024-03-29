import {Injectable} from '@nestjs/common';
import {Model, Types} from 'mongoose';
import {plainToInstance} from 'class-transformer';
import {DatabaseEntity} from 'src/database/database.decorator';
import {HelperStringService} from 'src/utils/helper/service/helper.string.service';
import {PermissionEntity} from 'src/permission/schema/permission.schema';
import {IDatabaseFindAllOptions, IDatabaseFindOneOptions,} from 'src/database/database.interface';
import {UserEntity} from "../../user/schema/user.schema";
import {IncomeDocument, IncomeEntity} from "../schema/income.schema";
import {IncomeUploadSerialization} from "../serialization/income.upload.serialization";
import {IncomeListSerialization} from "../serialization/income.list.serialization";
import {IncomeGetSerialization} from "../serialization/income.get.serialization";
import {IIncomeCreate, IIncomeDocument} from "../income.interface";
import {IUserDocument} from "../../user/user.interface";

@Injectable()
export class IncomeService {
    private readonly uploadPath: string;

    constructor(
        @DatabaseEntity(IncomeEntity.name)
        private readonly incomeModel: Model<IncomeDocument>,
    ) {
        this.uploadPath = 'report';
    }

    async findAll<T>(
        find?: Record<string, any>,
        options?: IDatabaseFindAllOptions
    ): Promise<T[]> {
        const files = this.incomeModel.find(find)

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
        return this.incomeModel.countDocuments(find);
    }

    async serializationProfile(
        data: IUserDocument
    ): Promise<IncomeUploadSerialization> {
        return plainToInstance(IncomeUploadSerialization, data);
    }

    async serializationList(
        data: IncomeDocument[]
    ): Promise<IncomeListSerialization[]> {
        return plainToInstance(IncomeListSerialization, data);
    }

    async serializationGet(data: IIncomeDocument): Promise<IncomeGetSerialization> {
        return plainToInstance(IncomeGetSerialization, data);
    }


    async findAllIncome<T>(
        codeAM: string,
    ): Promise<T[]> {
        return this.incomeModel.aggregate([
            {
                $match: {"codeAM": codeAM}
            },
            {
                $group: {
                    _id: "$codeAM",
                    totalIncomeFTP: {
                        $sum: "$incomeFTPBaseMore"
                    },
                    totalIncomeService: {
                        $sum: "$incomeFromService"
                    },
                    totalIncomeInterestKDNTPS: {
                        $sum: {
                            $add: ['$incomeInterestKDNTPS', '$incomeExcludeInterestKDNTPS']
                        }
                    },
                    totalIncomeCardService: {
                        $sum: "$incomeFromCardAndInterestService"
                    },
                    totalRaisingCapitalAtTheEndExchange: {
                        $sum: "$raisingCapitalAtTheEndExchange"
                    },
                    totalAmountDebtCreditAtTheEndExchange: {
                        $sum: "$amountDebtCreditAtTheEndExchange"
                    },
                }
            }
        ]);
    }

    async findAllIncomeByCodeLevelSix<T>(
        codeDepartmentLevelSix: string,
    ): Promise<T[]> {
        return this.incomeModel.aggregate([
            {
                $match: {"codeDepartmentLevelSix": codeDepartmentLevelSix}
            },
            {
                $group: {
                    _id: "$codeDepartmentLevelSix",
                    totalIncomeFTP: {
                        $sum: "$incomeFTPBaseMore"
                    },
                    totalIncomeService: {
                        $sum: "$incomeFromService"
                    },
                    totalIncomeInterestKDNTPS: {
                        $sum: {
                            $add: ['$incomeInterestKDNTPS', '$incomeExcludeInterestKDNTPS']
                        }
                    },
                    totalIncomeCardService: {
                        $sum: "$incomeFromCardAndInterestService"
                    },
                    totalRaisingCapitalAtTheEndExchange: {
                        $sum: "$raisingCapitalAtTheEndExchange"
                    },
                    totalAmountDebtCreditAtTheEndExchange: {
                        $sum: "$amountDebtCreditAtTheEndExchange"
                    },
                }
            }
        ]);
    }

    async findAllIncomeBaseUser<T>(
        codeAM: string,
    ): Promise<T[]> {
        return this.incomeModel.aggregate([
            {
                $match: {"codeAM": codeAM}
            },
            {
                $group: {
                    _id: {
                        codeAM: "$codeAM",
                        kindOfMoney: "$kindOfMoney"
                    },
                    totalIncomeFTP: {
                        $sum: "$incomeFTPBaseMore"
                    },
                    totalIncomeInterestFTP: {
                        $sum: "$incomeFromInterestFTPBaseMore"
                    },
                    totalIncomeCreditFTP: {
                        $sum: "$incomeFromCreditFTPBaseMore"
                    },
                    totalIncomeGuaranteeActivities: {
                        $sum: "$incomeGuaranteeActivities"
                    },
                    totalIncomeHDV: {
                        $sum: "$incomeHDVFTPBaseMore"
                    },
                    totalIncomeOtherInterest: {
                        $sum: "$incomeOtherInterest"
                    },
                    totalIncomeExcludeInterest: {
                        $sum: "$incomeExcludeInterest"
                    },
                    totalIncomeService: {
                        $sum: "$incomeFromService"
                    },
                    totalIncomeToolFinance: {
                        $sum: "$incomeFromToolFinance"
                    },
                    totalIncomeBuyStock: {
                        $sum: "$incomeBuyStock"
                    },
                    totalIncomeBuyAndContributionShares: {
                        $sum: "$incomeBuySharesAndContribution"
                    },
                    totalIncomeGolden: {
                        $sum: "$incomeGolden"
                    },
                    totalIncomeInterestKDNTPS: {
                        $sum: "$incomeInterestKDNTPS"
                    },
                    totalIncomeExcludeInterestKDNTPS: {
                        $sum: "$incomeExcludeInterestKDNTPS"
                    },
                    totalIncomeCardAndInterestService: {
                        $sum: "$incomeFromCardAndInterestService"
                    },
                    totalIncomeFromDebt: {
                        $sum: "$incomeFromDebt"
                    },
                    totalIncomeOtherActivity: {
                        $sum: "$incomeOtherActivity"
                    }
                }
            },
        ]);
    }

    async findAllIncomeBaseDepartment<T>(
        codeDepartment: string,
    ): Promise<T[]> {
        return this.incomeModel.aggregate([
            {
                $match: {"codeDepartmentLevelSix": codeDepartment}
            },
            {
                $group: {
                    _id: {
                        codeDepartmentLevelSix: "$codeDepartmentLevelSix",
                        kindOfMoney: "$kindOfMoney"
                    },
                    totalIncomeFTP: {
                        $sum: "$incomeFTPBaseMore"
                    },
                    totalIncomeInterestFTP: {
                        $sum: "$incomeFromInterestFTPBaseMore"
                    },
                    totalIncomeCreditFTP: {
                        $sum: "$incomeFromCreditFTPBaseMore"
                    },
                    totalIncomeGuaranteeActivities: {
                        $sum: "$incomeGuaranteeActivities"
                    },
                    totalIncomeHDV: {
                        $sum: "$incomeHDVFTPBaseMore"
                    },
                    totalIncomeOtherInterest: {
                        $sum: "$incomeOtherInterest"
                    },
                    totalIncomeExcludeInterest: {
                        $sum: "$incomeExcludeInterest"
                    },
                    totalIncomeService: {
                        $sum: "$incomeFromService"
                    },
                    totalIncomeToolFinance: {
                        $sum: "$incomeFromToolFinance"
                    },
                    totalIncomeBuyStock: {
                        $sum: "$incomeBuyStock"
                    },
                    totalIncomeBuyAndContributionShares: {
                        $sum: "$incomeBuySharesAndContribution"
                    },
                    totalIncomeGolden: {
                        $sum: "$incomeGolden"
                    },
                    totalIncomeInterestKDNTPS: {
                        $sum: "$incomeInterestKDNTPS"
                    },
                    totalIncomeExcludeInterestKDNTPS: {
                        $sum: "$incomeExcludeInterestKDNTPS"
                    },
                    totalIncomeCardAndInterestService: {
                        $sum: "$incomeFromCardAndInterestService"
                    },
                    totalIncomeFromDebt: {
                        $sum: "$incomeFromDebt"
                    },
                    totalIncomeOtherActivity: {
                        $sum: "$incomeOtherActivity"
                    }
                }
            },
        ]);
    }

    async findAllIncomeByCodeDepartmentLeader<T>(
        codeDepartment: string,
        codeAM?: string
    ): Promise<T[]> {
        if (codeAM) {
            return this.incomeModel.aggregate([
                {
                    $match: {
                        $and: [
                            {codeDepartmentLevelSix: codeDepartment},
                            {codeAM}
                        ]
                    }
                },
                {
                    $group: {
                        _id: {
                            codeAM: "$codeAM",
                            kindOfMoney: "$kindOfMoney"
                        },
                        totalIncomeFTP: {
                            $sum: "$incomeFTPBaseMore"
                        },
                        totalIncomeInterestFTP: {
                            $sum: "$incomeFromInterestFTPBaseMore"
                        },
                        totalIncomeCreditFTP: {
                            $sum: "$incomeFromCreditFTPBaseMore"
                        },
                        totalIncomeGuaranteeActivities: {
                            $sum: "$incomeGuaranteeActivities"
                        },
                        totalIncomeHDV: {
                            $sum: "$incomeHDVFTPBaseMore"
                        },
                        totalIncomeOtherInterest: {
                            $sum: "$incomeOtherInterest"
                        },
                        totalIncomeExcludeInterest: {
                            $sum: "$incomeExcludeInterest"
                        },
                        totalIncomeService: {
                            $sum: "$incomeFromService"
                        },
                        totalIncomeToolFinance: {
                            $sum: "$incomeFromToolFinance"
                        },
                        totalIncomeBuyStock: {
                            $sum: "$incomeBuyStock"
                        },
                        totalIncomeBuyAndContributionShares: {
                            $sum: "$incomeBuySharesAndContribution"
                        },
                        totalIncomeGolden: {
                            $sum: "$incomeGolden"
                        },
                        totalIncomeInterestKDNTPS: {
                            $sum: "$incomeInterestKDNTPS"
                        },
                        totalIncomeExcludeInterestKDNTPS: {
                            $sum: "$incomeExcludeInterestKDNTPS"
                        },
                        totalIncomeCardAndInterestService: {
                            $sum: "$incomeFromCardAndInterestService"
                        },
                        totalIncomeFromDebt: {
                            $sum: "$incomeFromDebt"
                        },
                        totalIncomeOtherActivity: {
                            $sum: "$incomeOtherActivity"
                        }
                    }
                },
            ]);

        }
        return this.incomeModel.aggregate([
            {
                $match: {
                    codeDepartmentLevelSix: codeDepartment,
                }
            },
            {
                $group: {
                    _id: {
                        codeAM: "$codeAM",
                        kindOfMoney: "$kindOfMoney"
                    },
                    totalIncomeFTP: {
                        $sum: "$incomeFTPBaseMore"
                    },
                    totalIncomeInterestFTP: {
                        $sum: "$incomeFromInterestFTPBaseMore"
                    },
                    totalIncomeCreditFTP: {
                        $sum: "$incomeFromCreditFTPBaseMore"
                    },
                    totalIncomeGuaranteeActivities: {
                        $sum: "$incomeGuaranteeActivities"
                    },
                    totalIncomeHDV: {
                        $sum: "$incomeHDVFTPBaseMore"
                    },
                    totalIncomeOtherInterest: {
                        $sum: "$incomeOtherInterest"
                    },
                    totalIncomeExcludeInterest: {
                        $sum: "$incomeExcludeInterest"
                    },
                    totalIncomeService: {
                        $sum: "$incomeFromService"
                    },
                    totalIncomeToolFinance: {
                        $sum: "$incomeFromToolFinance"
                    },
                    totalIncomeBuyStock: {
                        $sum: "$incomeBuyStock"
                    },
                    totalIncomeBuyAndContributionShares: {
                        $sum: "$incomeBuySharesAndContribution"
                    },
                    totalIncomeGolden: {
                        $sum: "$incomeGolden"
                    },
                    totalIncomeInterestKDNTPS: {
                        $sum: "$incomeInterestKDNTPS"
                    },
                    totalIncomeExcludeInterestKDNTPS: {
                        $sum: "$incomeExcludeInterestKDNTPS"
                    },
                    totalIncomeCardAndInterestService: {
                        $sum: "$incomeFromCardAndInterestService"
                    },
                    totalIncomeFromDebt: {
                        $sum: "$incomeFromDebt"
                    },
                    totalIncomeOtherActivity: {
                        $sum: "$incomeOtherActivity"
                    }
                }
            },
        ]);
    }


    async findAllIncomeGroupByDepartment<T>(
        codeDepartmentLevelSix?: string,
        options?: IDatabaseFindAllOptions,
    ): Promise<T[]> {
        return this.incomeModel.aggregate([
            {
                $group: {
                    _id: {
                        codeDepartmentLevelSix: codeDepartmentLevelSix ? codeDepartmentLevelSix : "$codeDepartmentLevelSix",
                        kindOfMoney: "$kindOfMoney"
                    },
                    totalIncomeFTP: {
                        $sum: "$incomeFTPBaseMore"
                    },
                    totalIncomeInterestFTP: {
                        $sum: "$incomeFromInterestFTPBaseMore"
                    },
                    totalIncomeCreditFTP: {
                        $sum: "$incomeFromCreditFTPBaseMore"
                    },
                    totalIncomeGuaranteeActivities: {
                        $sum: "$incomeGuaranteeActivities"
                    },
                    totalIncomeHDV: {
                        $sum: "$incomeHDVFTPBaseMore"
                    },
                    totalIncomeOtherInterest: {
                        $sum: "$incomeOtherInterest"
                    },
                    totalIncomeExcludeInterest: {
                        $sum: "$incomeExcludeInterest"
                    },
                    totalIncomeService: {
                        $sum: "$incomeFromService"
                    },
                    totalIncomeToolFinance: {
                        $sum: "$incomeFromToolFinance"
                    },
                    totalIncomeBuyStock: {
                        $sum: "$incomeBuyStock"
                    },
                    totalIncomeBuyAndContributionShares: {
                        $sum: "$incomeBuySharesAndContribution"
                    },
                    totalIncomeGolden: {
                        $sum: "$incomeGolden"
                    },
                    totalIncomeInterestKDNTPS: {
                        $sum: "$incomeInterestKDNTPS"
                    },
                    totalIncomeExcludeInterestKDNTPS: {
                        $sum: "$incomeExcludeInterestKDNTPS"
                    },
                    totalIncomeCardAndInterestService: {
                        $sum: "$incomeFromCardAndInterestService"
                    },
                    totalIncomeFromDebt: {
                        $sum: "$incomeFromDebt"
                    },
                    totalIncomeOtherActivity: {
                        $sum: "$incomeOtherActivity"
                    },
                }
            },
            {$sort: {_id: 1}}
        ]);
    }

    async findAllIncomeGroupByUser<T>(
        codeAM?: string,
        options?: IDatabaseFindAllOptions
    ): Promise<T[]> {
        return this.incomeModel.aggregate([
            {
                $group: {
                    _id: {
                        codeAM: codeAM ? codeAM : "$codeAM",
                        kindOfMoney: "$kindOfMoney"
                    },
                    totalIncomeFTP: {
                        $sum: "$incomeFTPBaseMore"
                    },
                    totalIncomeInterestFTP: {
                        $sum: "$incomeFromInterestFTPBaseMore"
                    },
                    totalIncomeCreditFTP: {
                        $sum: "$incomeFromCreditFTPBaseMore"
                    },
                    totalIncomeGuaranteeActivities: {
                        $sum: "$incomeGuaranteeActivities"
                    },
                    totalIncomeHDV: {
                        $sum: "$incomeHDVFTPBaseMore"
                    },
                    totalIncomeOtherInterest: {
                        $sum: "$incomeOtherInterest"
                    },
                    totalIncomeExcludeInterest: {
                        $sum: "$incomeExcludeInterest"
                    },
                    totalIncomeService: {
                        $sum: "$incomeFromService"
                    },
                    totalIncomeToolFinance: {
                        $sum: "$incomeFromToolFinance"
                    },
                    totalIncomeBuyStock: {
                        $sum: "$incomeBuyStock"
                    },
                    totalIncomeBuyAndContributionShares: {
                        $sum: "$incomeBuySharesAndContribution"
                    },
                    totalIncomeGolden: {
                        $sum: "$incomeGolden"
                    },
                    totalIncomeInterestKDNTPS: {
                        $sum: "$incomeInterestKDNTPS"
                    },
                    totalIncomeExcludeInterestKDNTPS: {
                        $sum: "$incomeExcludeInterestKDNTPS"
                    },
                    totalIncomeCardAndInterestService: {
                        $sum: "$incomeFromCardAndInterestService"
                    },
                    totalIncomeFromDebt: {
                        $sum: "$incomeFromDebt"
                    },
                    totalIncomeOtherActivity: {
                        $sum: "$incomeOtherActivity"
                    },
                }
            },
            {$sort: {_id: 1}}
        ]);
    }

    async findAllScaleBaseUser<T>(
        codeAM: string,
    ): Promise<T[]> {
        return this.incomeModel.aggregate([
            {
                $match: {"codeAM": codeAM}
            },
            {
                $group: {
                    _id: {
                        codeAM: "$codeAM",
                        kindOfMoney: "$kindOfMoney"
                    },
                    totalRaisingCapitalAtTheEnd: {
                        $sum: "$raisingCapitalAtTheEnd"
                    },
                    totalRaisingCapitalAtTheEndExchange: {
                        $sum: "$raisingCapitalAtTheEndExchange"
                    },
                    totalRaisingCapitalAtTheEndKKH: {
                        $sum: "$raisingCapitalAtTheEndKKH"
                    },
                    totalRaisingCapitalAtTheEndKKHExchange: {
                        $sum: "$raisingCapitalAtTheEndKKHExchange"
                    },
                    totalRaisingCapitalAtTheEndCKH: {
                        $sum: "$raisingCapitalAtTheEndCKH"
                    },
                    totalRaisingCapitalAtTheEndCKHExchange: {
                        $sum: "$raisingCapitalAtTheEndCKHExchange"
                    },
                    totalRaisingCapitalAvg: {
                        $sum: "$raisingCapitalAvg"
                    },
                    totalRaisingCapitalAvgExchange: {
                        $sum: "$raisingCapitalAvgExchange"
                    },
                    totalRaisingCapitalKKHAvg: {
                        $sum: "$raisingCapitalKKHAvg"
                    },
                    totalRaisingCapitalKKHAvgExchange: {
                        $sum: "$raisingCapitalKKHAvgExchange"
                    },
                    totalRaisingCapitalCKHAvg: {
                        $sum: "$raisingCapitalCKHAvg"
                    },
                    totalRaisingCapitalCKHAvgExchange: {
                        $sum: "$raisingCapitalCKHAvgExchange"
                    },
                    totalAmountDebtCreditAtTheEnd: {
                        $sum: "$amountDebtCreditAtTheEnd"
                    },
                    totalAmountDebtCreditAtTheEndExchange: {
                        $sum: "$amountDebtCreditAtTheEndExchange"
                    },
                    totalAmountDebtCreditTDHAtTheEnd: {
                        $sum: "$amountDebtCreditTDHAtTheEnd"
                    },
                    totalAmountDebtCreditTDHAtTheEndExchange: {
                        $sum: "$amountDebtCreditTDHAtTheEndExchange"
                    },
                    totalAmountDebtCreditAvgAtTheEnd: {
                        $sum: "$amountDebtCreditAvgAtTheEnd"
                    },
                    totalAmountDebtCreditAvgAtTheEndExchange: {
                        $sum: "$amountDebtCreditAvgAtTheEndExchange"
                    },
                    totalAmountDebtCreditTDHAvgAtTheEnd: {
                        $sum: "$amountDebtCreditTDHAvgAtTheEnd"
                    },
                    totalAmountDebtCreditTDHAvgAtTheEndExchange: {
                        $sum: "$amountDebtCreditTDHAvgAtTheEndExchange"
                    },
                    totalAmountDebtLoanGTCGAndEndCard: {
                        $sum: "$amountDebtLoanGTCGAndEndCard"
                    },
                    totalAmountDebtLoanGTCGAndAvgCard: {
                        $sum: "$amountDebtLoanGTCGAndAvgCard"
                    },
                }
            },
        ]);
    }

    async findAllScaleBaseDepartment<T>(
        codeDepartment: string,
    ): Promise<T[]> {
        return this.incomeModel.aggregate([
            {
                $match: {"codeDepartmentLevelSix": codeDepartment}
            },
            {
                $group: {
                    _id: {
                        codeDepartmentLevelSix: "$codeDepartmentLevelSix",
                        kindOfMoney: "$kindOfMoney"
                    },
                    totalRaisingCapitalAtTheEnd: {
                        $sum: "$raisingCapitalAtTheEnd"
                    },
                    totalRaisingCapitalAtTheEndExchange: {
                        $sum: "$raisingCapitalAtTheEndExchange"
                    },
                    totalRaisingCapitalAtTheEndKKH: {
                        $sum: "$raisingCapitalAtTheEndKKH"
                    },
                    totalRaisingCapitalAtTheEndKKHExchange: {
                        $sum: "$raisingCapitalAtTheEndKKHExchange"
                    },
                    totalRaisingCapitalAtTheEndCKH: {
                        $sum: "$raisingCapitalAtTheEndCKH"
                    },
                    totalRaisingCapitalAtTheEndCKHExchange: {
                        $sum: "$raisingCapitalAtTheEndCKHExchange"
                    },
                    totalRaisingCapitalAvg: {
                        $sum: "$raisingCapitalAvg"
                    },
                    totalRaisingCapitalAvgExchange: {
                        $sum: "$raisingCapitalAvgExchange"
                    },
                    totalRaisingCapitalKKHAvg: {
                        $sum: "$raisingCapitalKKHAvg"
                    },
                    totalRaisingCapitalKKHAvgExchange: {
                        $sum: "$raisingCapitalKKHAvgExchange"
                    },
                    totalRaisingCapitalCKHAvg: {
                        $sum: "$raisingCapitalCKHAvg"
                    },
                    totalRaisingCapitalCKHAvgExchange: {
                        $sum: "$raisingCapitalCKHAvgExchange"
                    },
                    totalAmountDebtCreditAtTheEnd: {
                        $sum: "$amountDebtCreditAtTheEnd"
                    },
                    totalAmountDebtCreditAtTheEndExchange: {
                        $sum: "$amountDebtCreditAtTheEndExchange"
                    },
                    totalAmountDebtCreditTDHAtTheEnd: {
                        $sum: "$amountDebtCreditTDHAtTheEnd"
                    },
                    totalAmountDebtCreditTDHAtTheEndExchange: {
                        $sum: "$amountDebtCreditTDHAtTheEndExchange"
                    },
                    totalAmountDebtCreditAvgAtTheEnd: {
                        $sum: "$amountDebtCreditAvgAtTheEnd"
                    },
                    totalAmountDebtCreditAvgAtTheEndExchange: {
                        $sum: "$amountDebtCreditAvgAtTheEndExchange"
                    },
                    totalAmountDebtCreditTDHAvgAtTheEnd: {
                        $sum: "$amountDebtCreditTDHAvgAtTheEnd"
                    },
                    totalAmountDebtCreditTDHAvgAtTheEndExchange: {
                        $sum: "$amountDebtCreditTDHAvgAtTheEndExchange"
                    },
                    totalAmountDebtLoanGTCGAndEndCard: {
                        $sum: "$amountDebtLoanGTCGAndEndCard"
                    },
                    totalAmountDebtLoanGTCGAndAvgCard: {
                        $sum: "$amountDebtLoanGTCGAndAvgCard"
                    },
                }
            },
        ]);
    }

    async findAllScaleByCodeDepartmentLeader<T>(
        codeDepartment: string,
        codeAM?: string
    ): Promise<T[]> {
        if (codeAM) {
            return this.incomeModel.aggregate([
                {
                    $match: {
                        $and: [
                            {codeDepartmentLevelSix: codeDepartment},
                            {codeAM}
                        ]
                    }
                },
                {
                    $group: {
                        _id: {
                            codeAM: "$codeAM",
                            kindOfMoney: "$kindOfMoney"
                        },
                        totalRaisingCapitalAtTheEnd: {
                            $sum: "$raisingCapitalAtTheEnd"
                        },
                        totalRaisingCapitalAtTheEndExchange: {
                            $sum: "$raisingCapitalAtTheEndExchange"
                        },
                        totalRaisingCapitalAtTheEndKKH: {
                            $sum: "$raisingCapitalAtTheEndKKH"
                        },
                        totalRaisingCapitalAtTheEndKKHExchange: {
                            $sum: "$raisingCapitalAtTheEndKKHExchange"
                        },
                        totalRaisingCapitalAtTheEndCKH: {
                            $sum: "$raisingCapitalAtTheEndCKH"
                        },
                        totalRaisingCapitalAtTheEndCKHExchange: {
                            $sum: "$raisingCapitalAtTheEndCKHExchange"
                        },
                        totalRaisingCapitalAvg: {
                            $sum: "$raisingCapitalAvg"
                        },
                        totalRaisingCapitalAvgExchange: {
                            $sum: "$raisingCapitalAvgExchange"
                        },
                        totalRaisingCapitalKKHAvg: {
                            $sum: "$raisingCapitalKKHAvg"
                        },
                        totalRaisingCapitalKKHAvgExchange: {
                            $sum: "$raisingCapitalKKHAvgExchange"
                        },
                        totalRaisingCapitalCKHAvg: {
                            $sum: "$raisingCapitalCKHAvg"
                        },
                        totalRaisingCapitalCKHAvgExchange: {
                            $sum: "$raisingCapitalCKHAvgExchange"
                        },
                        totalAmountDebtCreditAtTheEnd: {
                            $sum: "$amountDebtCreditAtTheEnd"
                        },
                        totalAmountDebtCreditAtTheEndExchange: {
                            $sum: "$amountDebtCreditAtTheEndExchange"
                        },
                        totalAmountDebtCreditTDHAtTheEnd: {
                            $sum: "$amountDebtCreditTDHAtTheEnd"
                        },
                        totalAmountDebtCreditTDHAtTheEndExchange: {
                            $sum: "$amountDebtCreditTDHAtTheEndExchange"
                        },
                        totalAmountDebtCreditAvgAtTheEnd: {
                            $sum: "$amountDebtCreditAvgAtTheEnd"
                        },
                        totalAmountDebtCreditAvgAtTheEndExchange: {
                            $sum: "$amountDebtCreditAvgAtTheEndExchange"
                        },
                        totalAmountDebtCreditTDHAvgAtTheEnd: {
                            $sum: "$amountDebtCreditTDHAvgAtTheEnd"
                        },
                        totalAmountDebtCreditTDHAvgAtTheEndExchange: {
                            $sum: "$amountDebtCreditTDHAvgAtTheEndExchange"
                        },
                        totalAmountDebtLoanGTCGAndEndCard: {
                            $sum: "$amountDebtLoanGTCGAndEndCard"
                        },
                        totalAmountDebtLoanGTCGAndAvgCard: {
                            $sum: "$amountDebtLoanGTCGAndAvgCard"
                        },
                    }
                },
            ]);

        }
        return this.incomeModel.aggregate([
            {
                $match: {
                    codeDepartmentLevelSix: codeDepartment,
                }
            },
            {
                $group: {
                    _id: {
                        codeAM: "$codeAM",
                        kindOfMoney: "$kindOfMoney"
                    },
                    totalRaisingCapitalAtTheEnd: {
                        $sum: "$raisingCapitalAtTheEnd"
                    },
                    totalRaisingCapitalAtTheEndExchange: {
                        $sum: "$raisingCapitalAtTheEndExchange"
                    },
                    totalRaisingCapitalAtTheEndKKH: {
                        $sum: "$raisingCapitalAtTheEndKKH"
                    },
                    totalRaisingCapitalAtTheEndKKHExchange: {
                        $sum: "$raisingCapitalAtTheEndKKHExchange"
                    },
                    totalRaisingCapitalAtTheEndCKH: {
                        $sum: "$raisingCapitalAtTheEndCKH"
                    },
                    totalRaisingCapitalAtTheEndCKHExchange: {
                        $sum: "$raisingCapitalAtTheEndCKHExchange"
                    },
                    totalRaisingCapitalAvg: {
                        $sum: "$raisingCapitalAvg"
                    },
                    totalRaisingCapitalAvgExchange: {
                        $sum: "$raisingCapitalAvgExchange"
                    },
                    totalRaisingCapitalKKHAvg: {
                        $sum: "$raisingCapitalKKHAvg"
                    },
                    totalRaisingCapitalKKHAvgExchange: {
                        $sum: "$raisingCapitalKKHAvgExchange"
                    },
                    totalRaisingCapitalCKHAvg: {
                        $sum: "$raisingCapitalCKHAvg"
                    },
                    totalRaisingCapitalCKHAvgExchange: {
                        $sum: "$raisingCapitalCKHAvgExchange"
                    },
                    totalAmountDebtCreditAtTheEnd: {
                        $sum: "$amountDebtCreditAtTheEnd"
                    },
                    totalAmountDebtCreditAtTheEndExchange: {
                        $sum: "$amountDebtCreditAtTheEndExchange"
                    },
                    totalAmountDebtCreditTDHAtTheEnd: {
                        $sum: "$amountDebtCreditTDHAtTheEnd"
                    },
                    totalAmountDebtCreditTDHAtTheEndExchange: {
                        $sum: "$amountDebtCreditTDHAtTheEndExchange"
                    },
                    totalAmountDebtCreditAvgAtTheEnd: {
                        $sum: "$amountDebtCreditAvgAtTheEnd"
                    },
                    totalAmountDebtCreditAvgAtTheEndExchange: {
                        $sum: "$amountDebtCreditAvgAtTheEndExchange"
                    },
                    totalAmountDebtCreditTDHAvgAtTheEnd: {
                        $sum: "$amountDebtCreditTDHAvgAtTheEnd"
                    },
                    totalAmountDebtCreditTDHAvgAtTheEndExchange: {
                        $sum: "$amountDebtCreditTDHAvgAtTheEndExchange"
                    },
                    totalAmountDebtLoanGTCGAndEndCard: {
                        $sum: "$amountDebtLoanGTCGAndEndCard"
                    },
                    totalAmountDebtLoanGTCGAndAvgCard: {
                        $sum: "$amountDebtLoanGTCGAndAvgCard"
                    },
                }
            },
        ]);
    }

    async findAllScaleGroupByDepartment<T>(
        codeDepartmentLevelSix?: string,
        options?: IDatabaseFindAllOptions
    ): Promise<T[]> {
        return this.incomeModel.aggregate([
            {
                $group: {
                    _id: {
                        codeDepartmentLevelSix: codeDepartmentLevelSix ? codeDepartmentLevelSix : "$codeDepartmentLevelSix",
                        kindOfMoney: "$kindOfMoney"
                    },
                    totalRaisingCapitalAtTheEnd: {
                        $sum: "$raisingCapitalAtTheEnd"
                    },
                    totalRaisingCapitalAtTheEndExchange: {
                        $sum: "$raisingCapitalAtTheEndExchange"
                    },
                    totalRaisingCapitalAtTheEndKKH: {
                        $sum: "$raisingCapitalAtTheEndKKH"
                    },
                    totalRaisingCapitalAtTheEndKKHExchange: {
                        $sum: "$raisingCapitalAtTheEndKKHExchange"
                    },
                    totalRaisingCapitalAtTheEndCKH: {
                        $sum: "$raisingCapitalAtTheEndCKH"
                    },
                    totalRaisingCapitalAtTheEndCKHExchange: {
                        $sum: "$raisingCapitalAtTheEndCKHExchange"
                    },
                    totalRaisingCapitalAvg: {
                        $sum: "$raisingCapitalAvg"
                    },
                    totalRaisingCapitalAvgExchange: {
                        $sum: "$raisingCapitalAvgExchange"
                    },
                    totalRaisingCapitalKKHAvg: {
                        $sum: "$raisingCapitalKKHAvg"
                    },
                    totalRaisingCapitalKKHAvgExchange: {
                        $sum: "$raisingCapitalKKHAvgExchange"
                    },
                    totalRaisingCapitalCKHAvg: {
                        $sum: "$raisingCapitalCKHAvg"
                    },
                    totalRaisingCapitalCKHAvgExchange: {
                        $sum: "$raisingCapitalCKHAvgExchange"
                    },
                    totalAmountDebtCreditAtTheEnd: {
                        $sum: "$amountDebtCreditAtTheEnd"
                    },
                    totalAmountDebtCreditAtTheEndExchange: {
                        $sum: "$amountDebtCreditAtTheEndExchange"
                    },
                    totalAmountDebtCreditTDHAtTheEnd: {
                        $sum: "$amountDebtCreditTDHAtTheEnd"
                    },
                    totalAmountDebtCreditTDHAtTheEndExchange: {
                        $sum: "$amountDebtCreditTDHAtTheEndExchange"
                    },
                    totalAmountDebtCreditAvgAtTheEnd: {
                        $sum: "$amountDebtCreditAvgAtTheEnd"
                    },
                    totalAmountDebtCreditAvgAtTheEndExchange: {
                        $sum: "$amountDebtCreditAvgAtTheEndExchange"
                    },
                    totalAmountDebtCreditTDHAvgAtTheEnd: {
                        $sum: "$amountDebtCreditTDHAvgAtTheEnd"
                    },
                    totalAmountDebtCreditTDHAvgAtTheEndExchange: {
                        $sum: "$amountDebtCreditTDHAvgAtTheEndExchange"
                    },
                    totalAmountDebtLoanGTCGAndEndCard: {
                        $sum: "$amountDebtLoanGTCGAndEndCard"
                    },
                    totalAmountDebtLoanGTCGAndAvgCard: {
                        $sum: "$amountDebtLoanGTCGAndAvgCard"
                    },
                }
            },
            {$sort: {_id: 1}}
        ]);
    }

    async findAllScaleGroupByUser<T>(
        codeAM?: string,
        options?: IDatabaseFindAllOptions
    ): Promise<T[]> {
        return this.incomeModel.aggregate([
            {
                $group: {
                    _id: {
                        codeAM: codeAM ? codeAM : "$codeAM",
                        kindOfMoney: "$kindOfMoney"
                    },
                    totalRaisingCapitalAtTheEnd: {
                        $sum: "$raisingCapitalAtTheEnd"
                    },
                    totalRaisingCapitalAtTheEndExchange: {
                        $sum: "$raisingCapitalAtTheEndExchange"
                    },
                    totalRaisingCapitalAtTheEndKKH: {
                        $sum: "$raisingCapitalAtTheEndKKH"
                    },
                    totalRaisingCapitalAtTheEndKKHExchange: {
                        $sum: "$raisingCapitalAtTheEndKKHExchange"
                    },
                    totalRaisingCapitalAtTheEndCKH: {
                        $sum: "$raisingCapitalAtTheEndCKH"
                    },
                    totalRaisingCapitalAtTheEndCKHExchange: {
                        $sum: "$raisingCapitalAtTheEndCKHExchange"
                    },
                    totalRaisingCapitalAvg: {
                        $sum: "$raisingCapitalAvg"
                    },
                    totalRaisingCapitalAvgExchange: {
                        $sum: "$raisingCapitalAvgExchange"
                    },
                    totalRaisingCapitalKKHAvg: {
                        $sum: "$raisingCapitalKKHAvg"
                    },
                    totalRaisingCapitalKKHAvgExchange: {
                        $sum: "$raisingCapitalKKHAvgExchange"
                    },
                    totalRaisingCapitalCKHAvg: {
                        $sum: "$raisingCapitalCKHAvg"
                    },
                    totalRaisingCapitalCKHAvgExchange: {
                        $sum: "$raisingCapitalCKHAvgExchange"
                    },
                    totalAmountDebtCreditAtTheEnd: {
                        $sum: "$amountDebtCreditAtTheEnd"
                    },
                    totalAmountDebtCreditAtTheEndExchange: {
                        $sum: "$amountDebtCreditAtTheEndExchange"
                    },
                    totalAmountDebtCreditTDHAtTheEnd: {
                        $sum: "$amountDebtCreditTDHAtTheEnd"
                    },
                    totalAmountDebtCreditTDHAtTheEndExchange: {
                        $sum: "$amountDebtCreditTDHAtTheEndExchange"
                    },
                    totalAmountDebtCreditAvgAtTheEnd: {
                        $sum: "$amountDebtCreditAvgAtTheEnd"
                    },
                    totalAmountDebtCreditAvgAtTheEndExchange: {
                        $sum: "$amountDebtCreditAvgAtTheEndExchange"
                    },
                    totalAmountDebtCreditTDHAvgAtTheEnd: {
                        $sum: "$amountDebtCreditTDHAvgAtTheEnd"
                    },
                    totalAmountDebtCreditTDHAvgAtTheEndExchange: {
                        $sum: "$amountDebtCreditTDHAvgAtTheEndExchange"
                    },
                    totalAmountDebtLoanGTCGAndEndCard: {
                        $sum: "$amountDebtLoanGTCGAndEndCard"
                    },
                    totalAmountDebtLoanGTCGAndAvgCard: {
                        $sum: "$amountDebtLoanGTCGAndAvgCard"
                    },
                }
            },
            {$sort: {_id: 1}}
        ]);
    }

    async findOneById<T>(
        _id: string,
        options?: IDatabaseFindOneOptions
    ): Promise<T> {
        const file = this.incomeModel.findById(_id);

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
        const file = this.incomeModel.findOne(find);

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
                     incomeCreateDatedLastYear,
                     cif,
                     codeAM,
                     fullName,
                     user,
                     codeDepartmentLevelSix,
                     kindOfMoney,
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
                     incomeFromCardAndInterestService,
                     raisingCapitalAtTheEndLastYear,
                     raisingCapitalAtTheEndExchangeLastYear,
                     raisingCapitalAtTheEndKKHLastYear,
                     raisingCapitalAtTheEndKKHExchangeLastYear,
                     raisingCapitalAtTheEndCKHLastYear,
                     raisingCapitalAtTheEndCKHExchangeLastYear,
                     raisingCapitalAvgLastYear,
                     raisingCapitalAvgExchangeLastYear,
                     raisingCapitalKKHAvgLastYear,
                     raisingCapitalKKHAvgExchangeLastYear,
                     raisingCapitalCKHAvgLastYear,
                     raisingCapitalCKHAvgExchangeLastYear,
                     amountDebtCreditAtTheEndLastYear,
                     amountDebtCreditAtTheEndExchangeLastYear,
                     amountDebtCreditTDHAtTheEndLastYear,
                     amountDebtCreditTDHAtTheEndExchangeLastYear,
                     amountDebtCreditAvgAtTheEndLastYear,
                     amountDebtCreditAvgAtTheEndExchangeLastYear,
                     amountDebtCreditTDHAvgAtTheEndLastYear,
                     amountDebtCreditTDHAvgAtTheEndExchangeLastYear,
                     amountDebtLoanGTCGAndEndCardLastYear,
                     amountDebtLoanGTCGAndAvgCardLastYear,
                     incomeFTPBaseMoreLastYear,
                     incomeFromInterestFTPBaseMoreLastYear,
                     incomeGuaranteeActivitiesLastYear,
                     incomeHDVFTPBaseMoreLastYear,
                     incomeOtherInterestLastYear,
                     incomeExcludeInterestLastYear,
                     incomeFromServiceLastYear,
                     incomeFromCreditFTPBaseMoreLastYear,
                     incomeFromToolFinanceLastYear,
                     incomeBuyStockLastYear,
                     incomeBuySharesAndContributionLastYear,
                     incomeGoldenLastYear,
                     incomeInterestKDNTPSLastYear,
                     incomeExcludeInterestKDNTPSLastYear,
                     incomeOtherActivityLastYear,
                     incomeFromDebtLastYear,
                     incomeFromCardAndInterestServiceLastYear,
                     incomeFromCardInterestLastYear,
                     incomeFromCardServiceLastYear,
                     incomeFromDebtCurrencyLastYear
                 }: IIncomeCreate
    ):
        Promise<IncomeDocument> {
        const incomeEntity: IncomeEntity = {
            incomeCreateDated,
            incomeCreateDatedLastYear,
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
            kindOfMoney,
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
            raisingCapitalAtTheEndLastYear,
            raisingCapitalAtTheEndExchangeLastYear,
            raisingCapitalAtTheEndKKHLastYear,
            raisingCapitalAtTheEndKKHExchangeLastYear,
            raisingCapitalAtTheEndCKHLastYear,
            raisingCapitalAtTheEndCKHExchangeLastYear,
            raisingCapitalAvgLastYear,
            raisingCapitalAvgExchangeLastYear,
            raisingCapitalKKHAvgLastYear,
            raisingCapitalKKHAvgExchangeLastYear,
            raisingCapitalCKHAvgLastYear,
            raisingCapitalCKHAvgExchangeLastYear,
            amountDebtCreditAtTheEndLastYear,
            amountDebtCreditAtTheEndExchangeLastYear,
            amountDebtCreditTDHAtTheEndLastYear,
            amountDebtCreditTDHAtTheEndExchangeLastYear,
            amountDebtCreditAvgAtTheEndLastYear,
            amountDebtCreditAvgAtTheEndExchangeLastYear,
            amountDebtCreditTDHAvgAtTheEndLastYear,
            amountDebtCreditTDHAvgAtTheEndExchangeLastYear,
            amountDebtLoanGTCGAndEndCardLastYear,
            amountDebtLoanGTCGAndAvgCardLastYear,
            incomeFTPBaseMoreLastYear,
            incomeFromInterestFTPBaseMoreLastYear,
            incomeGuaranteeActivitiesLastYear,
            incomeHDVFTPBaseMoreLastYear,
            incomeOtherInterestLastYear,
            incomeExcludeInterestLastYear,
            incomeFromServiceLastYear,
            incomeFromCreditFTPBaseMoreLastYear,
            incomeFromToolFinanceLastYear,
            incomeBuyStockLastYear,
            incomeBuySharesAndContributionLastYear,
            incomeGoldenLastYear,
            incomeInterestKDNTPSLastYear,
            incomeExcludeInterestKDNTPSLastYear,
            incomeOtherActivityLastYear,
            incomeFromDebtLastYear,
            incomeFromCardAndInterestServiceLastYear,
            incomeFromCardInterestLastYear,
            incomeFromCardServiceLastYear,
            incomeFromDebtCurrencyLastYear,
            user: new Types.ObjectId(user)
        };

        const create: IncomeDocument = new this.incomeModel(incomeEntity);
        return create.save();
    }

    async deleteOneById(_id: string):
        Promise<IncomeDocument> {
        return this.incomeModel.findByIdAndDelete(_id);
    }

    async deleteOne(find: Record<string, any>
    ):
        Promise<IncomeDocument> {
        return this.incomeModel.findOneAndDelete(find);
    }

    async updateOneById(
        id: string, {}: IIncomeCreate
    ):
        Promise<IncomeDocument> {
        const incomeModel
            :
            IncomeDocument = await this.incomeModel.findOne({cif: id});
        return incomeModel.save();
    }

    async updateOneByIdInfoCustomerIncomeScale(
        id: string,
        {
            incomeCreateDated,
            cif,
            codeAM,
            fullName,
            user,
            codeDepartmentLevelSix,
            kindOfMoney,
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
            incomeFromCardInterest,
            incomeFromCardService,
            incomeFromCardAndInterestService
        }
            :
            IIncomeCreate
    ):
        Promise<IncomeDocument> {
        const incomeModel: IncomeDocument = await this.incomeModel.findOne({
            cif: id,
            codeDepartmentLevelSix,
            kindOfMoney,
            codeAM
        });
        if (!incomeModel) {
            return;
        }
        incomeModel.incomeCreateDated = incomeCreateDated;
        incomeModel.cif = cif;
        incomeModel.codeAM = codeAM;
        incomeModel.fullName = fullName;
        incomeModel.user = new Types.ObjectId(user);
        incomeModel.codeDepartmentLevelSix = codeDepartmentLevelSix;
        incomeModel.kindOfMoney = kindOfMoney;
        incomeModel.raisingCapitalAtTheEnd = raisingCapitalAtTheEnd;
        incomeModel.raisingCapitalAtTheEndExchange = raisingCapitalAtTheEndExchange;
        incomeModel.raisingCapitalAtTheEndKKH = raisingCapitalAtTheEndKKH;
        incomeModel.raisingCapitalAtTheEndKKHExchange = raisingCapitalAtTheEndKKHExchange;
        incomeModel.raisingCapitalAtTheEndCKH = raisingCapitalAtTheEndCKH;
        incomeModel.raisingCapitalAtTheEndCKHExchange = raisingCapitalAtTheEndCKHExchange;
        incomeModel.raisingCapitalAvg = raisingCapitalAvg;
        incomeModel.raisingCapitalAvgExchange = raisingCapitalAvgExchange;
        incomeModel.raisingCapitalKKHAvg = raisingCapitalKKHAvg;
        incomeModel.raisingCapitalKKHAvgExchange = raisingCapitalKKHAvgExchange;
        incomeModel.raisingCapitalCKHAvg = raisingCapitalCKHAvg;
        incomeModel.raisingCapitalCKHAvgExchange = raisingCapitalCKHAvgExchange;
        incomeModel.amountDebtCreditAtTheEnd = amountDebtCreditAtTheEnd;
        incomeModel.amountDebtCreditAtTheEndExchange = amountDebtCreditAtTheEndExchange;
        incomeModel.amountDebtCreditTDHAtTheEnd = amountDebtCreditTDHAtTheEnd;
        incomeModel.amountDebtCreditTDHAtTheEndExchange = amountDebtCreditTDHAtTheEndExchange;
        incomeModel.amountDebtCreditAvgAtTheEnd = amountDebtCreditAvgAtTheEnd;
        incomeModel.amountDebtCreditAvgAtTheEndExchange = amountDebtCreditAvgAtTheEndExchange;
        incomeModel.amountDebtCreditTDHAvgAtTheEnd = amountDebtCreditTDHAvgAtTheEnd;
        incomeModel.amountDebtCreditTDHAvgAtTheEndExchange = amountDebtCreditTDHAvgAtTheEndExchange;
        incomeModel.amountDebtLoanGTCGAndEndCard = amountDebtLoanGTCGAndEndCard;
        incomeModel.amountDebtLoanGTCGAndAvgCard = amountDebtLoanGTCGAndAvgCard;
        incomeModel.incomeFTPBaseMore = incomeFTPBaseMore;
        incomeModel.incomeFromInterestFTPBaseMore = incomeFromInterestFTPBaseMore;
        incomeModel.incomeGuaranteeActivities = incomeGuaranteeActivities;
        incomeModel.incomeHDVFTPBaseMore = incomeHDVFTPBaseMore;
        incomeModel.incomeOtherInterest = incomeOtherInterest;
        incomeModel.incomeExcludeInterest = incomeExcludeInterest;
        incomeModel.incomeFromService = incomeFromService;
        incomeModel.incomeFromCreditFTPBaseMore = incomeFromCreditFTPBaseMore;
        incomeModel.incomeFromToolFinance = incomeFromToolFinance;
        incomeModel.incomeBuyStock = incomeBuyStock;
        incomeModel.incomeBuySharesAndContribution = incomeBuySharesAndContribution;
        incomeModel.incomeGolden = incomeGolden;
        incomeModel.incomeExcludeInterestKDNTPS = incomeExcludeInterestKDNTPS;
        incomeModel.incomeOtherActivity = incomeOtherActivity;
        incomeModel.incomeInterestKDNTPS = incomeInterestKDNTPS;
        incomeModel.incomeFromDebtCurrency = incomeFromDebtCurrency;
        incomeModel.incomeFromCardInterest = incomeFromCardInterest;
        incomeModel.incomeFromCardService = incomeFromCardService;
        incomeModel.incomeFromCardAndInterestService = incomeFromCardAndInterestService;
        return incomeModel.save();
    }

    async updateOneByInfoCustomerIncomeScaleLastYear(
        id: string,
        {
            incomeCreateDatedLastYear,
            cif,
            codeAM,
            fullName,
            user,
            codeDepartmentLevelSix,
            kindOfMoney,
            raisingCapitalAtTheEndLastYear,
            raisingCapitalAtTheEndExchangeLastYear,
            raisingCapitalAtTheEndKKHLastYear,
            raisingCapitalAtTheEndKKHExchangeLastYear,
            raisingCapitalAtTheEndCKHLastYear,
            raisingCapitalAtTheEndCKHExchangeLastYear,
            raisingCapitalAvgLastYear,
            raisingCapitalAvgExchangeLastYear,
            raisingCapitalKKHAvgLastYear,
            raisingCapitalKKHAvgExchangeLastYear,
            raisingCapitalCKHAvgLastYear,
            raisingCapitalCKHAvgExchangeLastYear,
            amountDebtCreditAtTheEndLastYear,
            amountDebtCreditAtTheEndExchangeLastYear,
            amountDebtCreditTDHAtTheEndLastYear,
            amountDebtCreditTDHAtTheEndExchangeLastYear,
            amountDebtCreditAvgAtTheEndLastYear,
            amountDebtCreditAvgAtTheEndExchangeLastYear,
            amountDebtCreditTDHAvgAtTheEndLastYear,
            amountDebtCreditTDHAvgAtTheEndExchangeLastYear,
            amountDebtLoanGTCGAndEndCardLastYear,
            amountDebtLoanGTCGAndAvgCardLastYear,
            incomeFTPBaseMoreLastYear,
            incomeFromInterestFTPBaseMoreLastYear,
            incomeGuaranteeActivitiesLastYear,
            incomeHDVFTPBaseMoreLastYear,
            incomeOtherInterestLastYear,
            incomeExcludeInterestLastYear,
            incomeFromServiceLastYear,
            incomeFromCreditFTPBaseMoreLastYear,
            incomeFromToolFinanceLastYear,
            incomeBuyStockLastYear,
            incomeBuySharesAndContributionLastYear,
            incomeGoldenLastYear,
            incomeInterestKDNTPSLastYear,
            incomeExcludeInterestKDNTPSLastYear,
            incomeOtherActivityLastYear,
            incomeFromDebtLastYear,
            incomeFromCardAndInterestServiceLastYear,
            incomeFromCardServiceLastYear,
            incomeFromCardInterestLastYear,
            incomeFromDebtCurrencyLastYear,
        }
            :
            IIncomeCreate
    ):
        Promise<IncomeDocument> {
        const incomeModel: IncomeDocument = await this.incomeModel.findOne({
            cif: id,
            codeDepartmentLevelSix,
            kindOfMoney,
            codeAM
        });
        if (!incomeModel) {
            return;
        }
        incomeModel.incomeCreateDatedLastYear = incomeCreateDatedLastYear;
        incomeModel.cif = cif;
        incomeModel.codeAM = codeAM;
        incomeModel.fullName = fullName;
        incomeModel.user = new Types.ObjectId(user);
        incomeModel.codeDepartmentLevelSix = codeDepartmentLevelSix;
        incomeModel.kindOfMoney = kindOfMoney;
        incomeModel.raisingCapitalAtTheEndLastYear = raisingCapitalAtTheEndLastYear;
        incomeModel.raisingCapitalAtTheEndExchangeLastYear = raisingCapitalAtTheEndExchangeLastYear;
        incomeModel.raisingCapitalAtTheEndKKHLastYear = raisingCapitalAtTheEndKKHLastYear;
        incomeModel.raisingCapitalAtTheEndKKHExchangeLastYear = raisingCapitalAtTheEndKKHExchangeLastYear;
        incomeModel.raisingCapitalAtTheEndCKHLastYear = raisingCapitalAtTheEndCKHLastYear;
        incomeModel.raisingCapitalAtTheEndCKHExchangeLastYear = raisingCapitalAtTheEndCKHExchangeLastYear;
        incomeModel.raisingCapitalAvgLastYear = raisingCapitalAvgLastYear;
        incomeModel.raisingCapitalAvgExchangeLastYear = raisingCapitalAvgExchangeLastYear;
        incomeModel.raisingCapitalKKHAvgLastYear = raisingCapitalKKHAvgLastYear;
        incomeModel.raisingCapitalKKHAvgExchangeLastYear = raisingCapitalKKHAvgExchangeLastYear;
        incomeModel.raisingCapitalCKHAvgLastYear = raisingCapitalCKHAvgLastYear;
        incomeModel.raisingCapitalCKHAvgExchangeLastYear = raisingCapitalCKHAvgExchangeLastYear;
        incomeModel.amountDebtCreditAtTheEndLastYear = amountDebtCreditAtTheEndLastYear;
        incomeModel.amountDebtCreditAtTheEndExchangeLastYear = amountDebtCreditAtTheEndExchangeLastYear;
        incomeModel.amountDebtCreditTDHAtTheEndLastYear = amountDebtCreditTDHAtTheEndLastYear;
        incomeModel.amountDebtCreditTDHAtTheEndExchangeLastYear = amountDebtCreditTDHAtTheEndExchangeLastYear;
        incomeModel.amountDebtCreditAvgAtTheEndLastYear = amountDebtCreditAvgAtTheEndLastYear;
        incomeModel.amountDebtCreditAvgAtTheEndExchangeLastYear = amountDebtCreditAvgAtTheEndExchangeLastYear;
        incomeModel.amountDebtLoanGTCGAndEndCardLastYear = amountDebtLoanGTCGAndEndCardLastYear;
        incomeModel.amountDebtCreditTDHAvgAtTheEndLastYear = amountDebtCreditTDHAvgAtTheEndLastYear;
        incomeModel.amountDebtCreditTDHAvgAtTheEndExchangeLastYear = amountDebtCreditTDHAvgAtTheEndExchangeLastYear;
        incomeModel.incomeFTPBaseMoreLastYear = incomeFTPBaseMoreLastYear;
        incomeModel.incomeFromInterestFTPBaseMoreLastYear = incomeFromInterestFTPBaseMoreLastYear;
        incomeModel.amountDebtLoanGTCGAndAvgCardLastYear = amountDebtLoanGTCGAndAvgCardLastYear;
        incomeModel.incomeFromCreditFTPBaseMoreLastYear = incomeFromCreditFTPBaseMoreLastYear;
        incomeModel.incomeGuaranteeActivitiesLastYear = incomeGuaranteeActivitiesLastYear;
        incomeModel.incomeHDVFTPBaseMoreLastYear = incomeHDVFTPBaseMoreLastYear;
        incomeModel.incomeOtherInterestLastYear = incomeOtherInterestLastYear;
        incomeModel.incomeExcludeInterestLastYear = incomeExcludeInterestLastYear;
        incomeModel.incomeFromServiceLastYear = incomeFromServiceLastYear;
        incomeModel.incomeFromToolFinanceLastYear = incomeFromToolFinanceLastYear;
        incomeModel.incomeBuyStockLastYear = incomeBuyStockLastYear;
        incomeModel.incomeBuySharesAndContributionLastYear = incomeBuySharesAndContributionLastYear;
        incomeModel.incomeGoldenLastYear = incomeGoldenLastYear;
        incomeModel.incomeInterestKDNTPSLastYear = incomeInterestKDNTPSLastYear;
        incomeModel.incomeExcludeInterestKDNTPSLastYear = incomeExcludeInterestKDNTPSLastYear;
        incomeModel.incomeOtherActivityLastYear = incomeOtherActivityLastYear;
        incomeModel.incomeFromDebtLastYear = incomeFromDebtLastYear;
        incomeModel.incomeFromCardAndInterestServiceLastYear = incomeFromCardAndInterestServiceLastYear;
        incomeModel.incomeFromCardServiceLastYear = incomeFromCardServiceLastYear;
        incomeModel.incomeFromCardInterestLastYear = incomeFromCardInterestLastYear;
        incomeModel.incomeFromDebtCurrencyLastYear = incomeFromDebtCurrencyLastYear;

        return incomeModel.save();
    }

}
