import {Injectable} from '@nestjs/common';
import {Model} from 'mongoose';
import {Types} from 'mongoose';
import {plainToInstance} from 'class-transformer';
import {DatabaseEntity} from 'src/database/database.decorator';
import {HelperStringService} from 'src/utils/helper/service/helper.string.service';
import {PermissionEntity} from 'src/permission/schema/permission.schema';
import {
    IDatabaseFindAllOptions,
    IDatabaseFindOneOptions,
} from 'src/database/database.interface';
import {UserEntity} from "../../user/schema/user.schema";
import {CustomerDocument, CustomerEntity} from "../schema/customer.schema";
import {ICustomerCheckExist, ICustomerCreate, ICustomerDocument} from "../customer.interface";
import {CustomerUploadSerialization} from "../serialization/customer.upload.serialization";
import {CustomerListSerialization} from "../serialization/customer.list.serialization";
import {CustomerGetSerialization} from "../serialization/customer.get.serialization";

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

    async findAll(
        find?: Record<string, any>,
        options?: IDatabaseFindAllOptions
    ): Promise<ICustomerDocument[]> {
        const files = this.customerModel.find(find).populate({
            path: 'user',
            model: UserEntity.name,
        });

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
        data: ICustomerDocument[]
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
                     fileTypeCustomer
                 }: ICustomerCreate): Promise<CustomerDocument> {
        const customerEntity: CustomerEntity = {
            cif,
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
            fileTypeCustomer,
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

    async updateOneById(
        id: string,
        {
            creditLimitCustomer,
            totalCreditBalanceLastYear,
            totalCreditBalanceEndDay,
            totalCreditBalanceAvgBeginYear,
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
            incomeBrandLastYear,
            incomeTotalLastYear
        }: ICustomerCreate
    ): Promise<CustomerDocument> {
        const customerModel: CustomerDocument = await this.customerModel.findOne({cif: id});
        customerModel.creditLimitCustomer = creditLimitCustomer;
        customerModel.totalCreditBalanceLastYear = totalCreditBalanceLastYear;
        customerModel.totalCreditBalanceEndDay = totalCreditBalanceEndDay;
        customerModel.totalCreditBalanceAvgBeginYear = totalCreditBalanceAvgBeginYear;
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
        customerModel.incomeBrandLastYear = incomeBrandLastYear;
        customerModel.incomeTotalLastYear = incomeTotalLastYear;

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
        customerModel.incomeBrandLastYear = incomeBrandLastYear;
        customerModel.incomeTotalLastYear = incomeTotalLastYear;
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
