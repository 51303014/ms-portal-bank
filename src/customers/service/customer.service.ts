import {Injectable, NotFoundException} from '@nestjs/common';
import {Model, Types} from 'mongoose';
import {plainToInstance} from 'class-transformer';
import {DatabaseEntity} from 'src/database/database.decorator';
import {HelperStringService} from 'src/utils/helper/service/helper.string.service';
import {PermissionEntity} from 'src/permission/schema/permission.schema';
import {IDatabaseFindAllOptions, IDatabaseFindOneOptions,} from 'src/database/database.interface';
import {UserEntity} from "../../user/schema/user.schema";
import {CustomerDocument, CustomerEntity} from "../schema/customer.schema";
import {ICustomerCheckExist, ICustomerCreate, ICustomerDocument, SheetName} from "../customer.interface";
import {CustomerUploadSerialization} from "../serialization/customer.upload.serialization";
import {CustomerListSerialization} from "../serialization/customer.list.serialization";
import {CustomerGetSerialization} from "../serialization/customer.get.serialization";
import {ENUM_USER_STATUS_CODE_ERROR} from "../customer.constant";
import {IIncomeCreate} from "../../income/income.interface";

@Injectable()
export class CustomerService {
    private readonly uploadPath: string;

    constructor(
        @DatabaseEntity(CustomerEntity.name)
        private readonly customerModel: Model<CustomerDocument>,
        private readonly helperStringService: HelperStringService,
    ) {
        this.uploadPath = 'report';
    }

    async findAll<T>(
        find?: Record<string, any>,
        options?: IDatabaseFindAllOptions
    ): Promise<T[]> {
        const files = this.customerModel.find(find);

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
        return this.customerModel.countDocuments(find);
    }

    async serializationProfile(
        data: ICustomerDocument
    ): Promise<CustomerUploadSerialization> {
        return plainToInstance(CustomerUploadSerialization, data);
    }

    async serializationList(
        data: CustomerDocument[]
    ): Promise<CustomerListSerialization[]> {
        return plainToInstance(CustomerListSerialization, data);
    }

    async serializationGet(data: ICustomerDocument): Promise<CustomerGetSerialization> {
        return plainToInstance(CustomerGetSerialization, data);
    }

    async findOneById<T>(
        _id: string,
        options?: IDatabaseFindOneOptions
    ): Promise<T> {
        const file = this.customerModel.findById(_id);

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
        const file = this.customerModel.findOne(find);

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
                     cif,
                     codeAM,
                     codeDepartmentLevelSix,
                     customerId,
                     user,
                     address,
                     age,
                     balanceCreditLastYear,
                     balanceDebtEndDay,
                     balanceDebtLastYear,
                     birthday,
                     birthPlace,
                     brandCifOpen,
                     creditBalanceSegment,
                     creditLimitCustomer,
                     currentStatus,
                     customerSegment,
                     customerType,
                     dateCifOpen,
                     debtGroup, depositBalanceSegment, effectiveDate, email, fullName, gender, incomeBrandLastYear, incomeBrandYearly,
                     incomeTotalLastYear, incomeTotalYearly, job, maritalStatus, mobile, nationality, numberIdentity, overdraftBalanceEndDay, overdraftBalanceLastYear,
                     paymentBalanceDepositEndDay, paymentBalanceDepositLastYear, previousStatus, relationshipBank, residence, statusChangeDate,
                     termDepositBalanceEndDay, termDepositBalanceLastYear, totalCreditBalanceAvgBeginYear, totalCreditBalanceEndDay, totalCreditBalanceLastYear,
                     totalDepositBalanceAvgBeginYear, totalDepositBalanceEndDay, totalDepositBalanceLastYear,
                     totalCreditBalanceAvgLastYear,
                     totalDepositBalanceAvgLastYear,
                     fileTypeCustomer,
                     coreDebt,
                     coreDebtLastYear,
                     totalDebtTSDB,
                     debtShortTSDB,
                     debtMediumTSDB,
                     debtLongTSDB,
                     valueTSDB,
                     property,
                     saveMoney,
                     otherAsset,
                     productServiceBrandTGCKH,
                     productServiceBrandTGTT,
                     productServiceBrandLOAN,
                     productServiceBrandOverdraft,
                     productServiceBrandTTTM,
                     productServiceBrandVisaCard,
                     productServiceBrandMasterCard,
                     productServiceBrandATMCard,
                     productServiceBrandRegisterSalary,
                     productServiceBrandStock,
                     productServiceBrandSmartBanking,
                     productServiceBrandBSMS,
                     productServiceBrandBANKPlus,
                     productServiceBrandVNTopup,
                     productServiceBrandCollectAndPay,
                     productServiceBrandTCC,
                     productServiceBrandIBank,
                     productServiceBrandBillElectricUNCAuto,
                     productServiceBrandExcludeBillElectricUNCAuto,
                     productServiceBrandTotalProductUse,
                     productServiceSystemTGCKH,
                     productServiceSystemTGTT,
                     productServiceSystemLOAN,
                     productServiceSystemOverdraft,
                     productServiceSystemTTTM,
                     productServiceSystemVisaCard,
                     productServiceSystemMasterCard,
                     productServiceSystemATMCard,
                     productServiceSystemRegisterSalary,
                     productServiceSystemStock,
                     productServiceSystemSmartBanking,
                     productServiceSystemBSMS,
                     productServiceSystemBANKPlus,
                     productServiceSystemVNTopup,
                     productServiceSystemCollectAndPay,
                     productServiceSystemTCC,
                     productServiceSystemIBank,
                     productServiceSystemBillElectricUNCAuto,
                     productServiceSystemExcludeBillElectricUNCAuto,
                     productServiceSystemTotalProductUse,
                 }: ICustomerCreate): Promise<CustomerDocument> {
        const customerEntity: CustomerEntity = {
            cif,
            codeDepartmentLevelSix,
            customerId,
            address,
            age,
            balanceCreditLastYear,
            balanceDebtEndDay,
            balanceDebtLastYear,
            birthday,
            birthPlace,
            brandCifOpen,
            creditBalanceSegment,
            creditLimitCustomer,
            currentStatus,
            customerSegment,
            customerType,
            dateCifOpen,
            debtGroup,
            depositBalanceSegment,
            effectiveDate,
            email,
            fullName,
            gender,
            incomeBrandLastYear,
            incomeBrandYearly,
            incomeTotalLastYear,
            incomeTotalYearly,
            job,
            maritalStatus,
            mobile,
            nationality,
            numberIdentity,
            overdraftBalanceEndDay,
            overdraftBalanceLastYear,
            paymentBalanceDepositEndDay,
            paymentBalanceDepositLastYear,
            previousStatus,
            relationshipBank,
            residence,
            statusChangeDate,
            termDepositBalanceEndDay,
            termDepositBalanceLastYear,
            totalCreditBalanceAvgBeginYear,
            totalCreditBalanceEndDay,
            totalCreditBalanceLastYear,
            totalDepositBalanceAvgBeginYear,
            totalDepositBalanceEndDay,
            totalDepositBalanceLastYear,
            totalCreditBalanceAvgLastYear,
            totalDepositBalanceAvgLastYear,
            fileTypeCustomer,
            coreDebt,
            coreDebtLastYear,
            codeAM,
            totalDebtTSDB,
            debtShortTSDB,
            debtMediumTSDB,
            debtLongTSDB,
            valueTSDB,
            property,
            saveMoney,
            otherAsset,
            productServiceBrandTGCKH,
            productServiceBrandTGTT,
            productServiceBrandLOAN,
            productServiceBrandOverdraft,
            productServiceBrandTTTM,
            productServiceBrandVisaCard,
            productServiceBrandMasterCard,
            productServiceBrandATMCard,
            productServiceBrandRegisterSalary,
            productServiceBrandStock,
            productServiceBrandSmartBanking,
            productServiceBrandBSMS,
            productServiceBrandBANKPlus,
            productServiceBrandVNTopup,
            productServiceBrandCollectAndPay,
            productServiceBrandTCC,
            productServiceBrandIBank,
            productServiceBrandBillElectricUNCAuto,
            productServiceBrandExcludeBillElectricUNCAuto,
            productServiceBrandTotalProductUse,
            productServiceSystemTGCKH,
            productServiceSystemTGTT,
            productServiceSystemLOAN,
            productServiceSystemOverdraft,
            productServiceSystemTTTM,
            productServiceSystemVisaCard,
            productServiceSystemMasterCard,
            productServiceSystemATMCard,
            productServiceSystemRegisterSalary,
            productServiceSystemStock,
            productServiceSystemSmartBanking,
            productServiceSystemBSMS,
            productServiceSystemBANKPlus,
            productServiceSystemVNTopup,
            productServiceSystemCollectAndPay,
            productServiceSystemTCC,
            productServiceSystemIBank,
            productServiceSystemBillElectricUNCAuto,
            productServiceSystemExcludeBillElectricUNCAuto,
            productServiceSystemTotalProductUse,
            user: new Types.ObjectId(user)
        };

        const create: CustomerDocument = new this.customerModel(customerEntity);
        return create.save();
    }

    async deleteOneById(_id: string): Promise<CustomerDocument> {
        return this.customerModel.findByIdAndDelete(_id);
    }

    async deleteOne(find: Record<string, any>): Promise<CustomerDocument> {
        return this.customerModel.findOneAndDelete(find);
    }

    async updateOneByInfoCustomerMis(
        id: string,
        {
            address,
            numberIdentity,
            effectiveDate,
            age,
            email,
            mobile,
            job,
            customerId,
            relationshipBank,
            currentStatus,
            previousStatus,
            statusChangeDate,
            customerType,
            customerSegment,
            creditBalanceSegment,
            depositBalanceSegment,
            debtGroup,
            incomeBrandYearly,
            incomeTotalYearly,
        }: ICustomerCreate
    ): Promise<CustomerDocument> {
        const customerModel: CustomerDocument = await this.customerModel.findOne({cif: id});
        customerModel.address = address;
        customerModel.numberIdentity = numberIdentity;
        customerModel.effectiveDate = effectiveDate;
        customerModel.age = age;
        customerModel.email = email;
        customerModel.mobile = mobile;
        customerModel.customerId = customerId;
        customerModel.job = job;
        customerModel.relationshipBank = relationshipBank;
        customerModel.currentStatus = currentStatus;
        customerModel.previousStatus = previousStatus;
        customerModel.statusChangeDate = statusChangeDate;
        customerModel.customerType = customerType;
        customerModel.customerSegment = customerSegment;
        customerModel.creditBalanceSegment = creditBalanceSegment;
        customerModel.depositBalanceSegment = depositBalanceSegment;
        customerModel.debtGroup = debtGroup;
        customerModel.incomeBrandYearly = incomeBrandYearly;
        customerModel.incomeTotalYearly = incomeTotalYearly;
        return customerModel.save();
    }

    async updateOneById(
        id: string,
        {
            creditLimitCustomer,
            totalCreditBalanceLastYear,
            totalCreditBalanceEndDay,
            totalCreditBalanceAvgBeginYear,
            totalCreditBalanceAvgLastYear,
            totalDepositBalanceAvgLastYear,
            balanceDebtLastYear,
            balanceDebtEndDay,
            balanceCreditLastYear,
            balanceCreditEndDay,
            overdraftBalanceLastYear,
            overdraftBalanceEndDay,
            totalDepositBalanceLastYear,
            totalDepositBalanceEndDay,
            totalDepositBalanceAvgBeginYear,
            paymentBalanceDepositLastYear,
            paymentBalanceDepositEndDay,
            termDepositBalanceLastYear,
            termDepositBalanceEndDay,
        }: ICustomerCreate
    ): Promise<CustomerDocument> {
        const customerModel: CustomerDocument = await this.customerModel.findOne({cif: id});
        customerModel.creditLimitCustomer = creditLimitCustomer;
        customerModel.totalCreditBalanceLastYear = totalCreditBalanceLastYear;
        customerModel.totalCreditBalanceEndDay = totalCreditBalanceEndDay;
        customerModel.totalCreditBalanceAvgBeginYear = totalCreditBalanceAvgBeginYear;
        customerModel.totalCreditBalanceAvgLastYear = totalCreditBalanceAvgLastYear;
        customerModel.totalDepositBalanceAvgLastYear = totalDepositBalanceAvgLastYear;
        customerModel.balanceDebtLastYear = balanceDebtLastYear;
        customerModel.balanceDebtEndDay = balanceDebtEndDay;
        customerModel.balanceCreditLastYear = balanceCreditLastYear;
        customerModel.balanceCreditEndDay = balanceCreditEndDay;
        customerModel.overdraftBalanceLastYear = overdraftBalanceLastYear;
        customerModel.overdraftBalanceEndDay = overdraftBalanceEndDay;
        customerModel.totalDepositBalanceLastYear = totalDepositBalanceLastYear;
        customerModel.totalDepositBalanceEndDay = totalDepositBalanceEndDay;
        customerModel.totalDepositBalanceAvgBeginYear = totalDepositBalanceAvgBeginYear;
        customerModel.paymentBalanceDepositLastYear = paymentBalanceDepositLastYear;
        customerModel.paymentBalanceDepositEndDay = paymentBalanceDepositEndDay;
        customerModel.termDepositBalanceLastYear = termDepositBalanceLastYear;
        customerModel.termDepositBalanceEndDay = termDepositBalanceEndDay;
        return customerModel.save();
    }

    async updateOneByInfoCustomerMisLastYear(
        id: string,
        {
            incomeBrandLastYear,
            incomeTotalLastYear
        }: ICustomerCreate
    ): Promise<CustomerDocument> {
        const customerModel: CustomerDocument = await this.customerModel.findOne({cif: id});
        customerModel.cif = id;
        customerModel.incomeBrandLastYear = incomeBrandLastYear;
        customerModel.incomeTotalLastYear = incomeTotalLastYear;
        return customerModel.save();
    }

    async updateOneByInfoIncomeLastYear(
        id: string,
        {
            totalCreditBalanceAvgLastYear,
            totalDepositBalanceAvgLastYear
        }: IIncomeCreate
    ): Promise<CustomerDocument> {
        const customerModel: CustomerDocument = await this.customerModel.findOne({cif: id});
        if (!customerModel) {return;};
        customerModel.cif = id;
        customerModel.totalCreditBalanceAvgLastYear = totalCreditBalanceAvgLastYear;
        customerModel.totalDepositBalanceAvgLastYear = totalDepositBalanceAvgLastYear;
        return customerModel.save();
    }

    async updateOneByTotalTSDB(
        id: string,
        {
            totalValueTSDB,
        }: ICustomerCreate
    ): Promise<CustomerDocument> {
        const customerModel: CustomerDocument = await this.customerModel.findOne({cif: id});
        if (!customerModel) {
            return;
        }
        customerModel.totalValueTSDB = totalValueTSDB;
        return customerModel.save();
    }

    async updateOneByInfoCustomerCoreDebt(
        id: string,
        type: SheetName,
        total: number
    ): Promise<CustomerDocument> {
        const customerModel: CustomerDocument = await this.customerModel.findOne({cif: id});
        if (type === SheetName.InfoCustomerCoreDebt) {
            customerModel.coreDebt = total;
        }
        if (type === SheetName.InfoCustomerCoreDebtLastYear) {
            customerModel.coreDebtLastYear = total;
        }
        return customerModel.save();
    }

    async updateOneByInfoProductServiceBrand(
        id: string,
        {
            fullName,
            productServiceBrandTGCKH,
            productServiceBrandTGTT,
            productServiceBrandLOAN,
            productServiceBrandOverdraft,
            productServiceBrandTTTM,
            productServiceBrandVisaCard,
            productServiceBrandMasterCard,
            productServiceBrandATMCard,
            productServiceBrandRegisterSalary,
            productServiceBrandStock,
            productServiceBrandSmartBanking,
            productServiceBrandBSMS,
            productServiceBrandBANKPlus,
            productServiceBrandVNTopup,
            productServiceBrandCollectAndPay,
            productServiceBrandTCC,
            productServiceBrandIBank,
            productServiceBrandBillElectricUNCAuto,
            productServiceBrandExcludeBillElectricUNCAuto,
            productServiceBrandTotalProductUse,
        }: ICustomerCreate
    ): Promise<CustomerDocument> {
        const customerModel: CustomerDocument = await this.customerModel.findOne({cif: id});
        if (fullName) {
            customerModel.fullName = fullName;
        }
        customerModel.productServiceBrandTGCKH = productServiceBrandTGCKH;
        customerModel.productServiceBrandTGTT = productServiceBrandTGTT;
        customerModel.productServiceBrandLOAN = productServiceBrandLOAN;
        customerModel.productServiceBrandOverdraft = productServiceBrandOverdraft;
        customerModel.productServiceBrandTTTM = productServiceBrandTTTM;
        customerModel.productServiceBrandVisaCard = productServiceBrandVisaCard;
        customerModel.productServiceBrandMasterCard = productServiceBrandMasterCard;
        customerModel.productServiceBrandATMCard = productServiceBrandATMCard;
        customerModel.productServiceBrandRegisterSalary = productServiceBrandRegisterSalary;
        customerModel.productServiceBrandStock = productServiceBrandStock;
        customerModel.productServiceBrandSmartBanking = productServiceBrandSmartBanking;
        customerModel.productServiceBrandBSMS = productServiceBrandBSMS;
        customerModel.productServiceBrandBANKPlus = productServiceBrandBANKPlus;
        customerModel.productServiceBrandVNTopup = productServiceBrandVNTopup;
        customerModel.productServiceBrandCollectAndPay = productServiceBrandCollectAndPay;
        customerModel.productServiceBrandTCC = productServiceBrandTCC;
        customerModel.productServiceBrandIBank = productServiceBrandIBank;
        customerModel.productServiceBrandBillElectricUNCAuto = productServiceBrandBillElectricUNCAuto;
        customerModel.productServiceBrandExcludeBillElectricUNCAuto = productServiceBrandExcludeBillElectricUNCAuto;
        customerModel.productServiceBrandTotalProductUse = productServiceBrandTotalProductUse;
        return customerModel.save();
    }

    async updateOneByInfoProductServiceSystem(
        id: string,
        {
            fullName,
            productServiceSystemTGCKH,
            productServiceSystemTGTT,
            productServiceSystemLOAN,
            productServiceSystemOverdraft,
            productServiceSystemTTTM,
            productServiceSystemVisaCard,
            productServiceSystemMasterCard,
            productServiceSystemATMCard,
            productServiceSystemRegisterSalary,
            productServiceSystemStock,
            productServiceSystemSmartBanking,
            productServiceSystemBSMS,
            productServiceSystemBANKPlus,
            productServiceSystemVNTopup,
            productServiceSystemCollectAndPay,
            productServiceSystemTCC,
            productServiceSystemIBank,
            productServiceSystemBillElectricUNCAuto,
            productServiceSystemExcludeBillElectricUNCAuto,
            productServiceSystemTotalProductUse,
        }: ICustomerCreate
    ): Promise<CustomerDocument> {
        const customerModel: CustomerDocument = await this.customerModel.findOne({cif: id});
        customerModel.fullName = fullName;
        customerModel.productServiceSystemTGCKH = productServiceSystemTGCKH;
        customerModel.productServiceSystemTGTT = productServiceSystemTGTT;
        customerModel.productServiceSystemLOAN = productServiceSystemLOAN;
        customerModel.productServiceSystemOverdraft = productServiceSystemOverdraft;
        customerModel.productServiceSystemTTTM = productServiceSystemTTTM;
        customerModel.productServiceSystemVisaCard = productServiceSystemVisaCard;
        customerModel.productServiceSystemMasterCard = productServiceSystemMasterCard;
        customerModel.productServiceSystemATMCard = productServiceSystemATMCard;
        customerModel.productServiceSystemRegisterSalary = productServiceSystemRegisterSalary;
        customerModel.productServiceSystemStock = productServiceSystemStock;
        customerModel.productServiceSystemSmartBanking = productServiceSystemSmartBanking;
        customerModel.productServiceSystemBSMS = productServiceSystemBSMS;
        customerModel.productServiceSystemBANKPlus = productServiceSystemBANKPlus;
        customerModel.productServiceSystemVNTopup = productServiceSystemVNTopup;
        customerModel.productServiceSystemCollectAndPay = productServiceSystemCollectAndPay;
        customerModel.productServiceSystemTCC = productServiceSystemTCC;
        customerModel.productServiceSystemIBank = productServiceSystemIBank;
        customerModel.productServiceSystemBillElectricUNCAuto = productServiceSystemBillElectricUNCAuto;
        customerModel.productServiceSystemExcludeBillElectricUNCAuto = productServiceSystemExcludeBillElectricUNCAuto;
        customerModel.productServiceSystemTotalProductUse = productServiceSystemTotalProductUse;
        return customerModel.save();
    }

    async checkExist(
        email: string,
        fileName: string,
        _id?: string
    ): Promise<ICustomerCheckExist> {
        const existFile: Record<string, any> = await this.customerModel.exists({
            codeEmployee: {
                $regex: new RegExp(email),
                $options: 'i',
            },
            _id: {$nin: [new Types.ObjectId(_id)]},
        });

        const existUser: Record<string, any> =
            await this.customerModel.exists({
                fileName,
                _id: {$nin: [new Types.ObjectId(_id)]},
            });

        return {
            user: !!existUser,
            file: !!existFile,
        };
    }


    async createRandomFilename(originalFileName: string): Promise<Record<string, any>> {
        const filename: string = this.helperStringService.random(20);
        return {
            path: this.uploadPath,
            filename: `${filename}_${originalFileName}`,
        };
    }

}
