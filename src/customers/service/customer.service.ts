import {Injectable} from '@nestjs/common';
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
                     codeAM,
                     formPHTDebitDomestic,
                     statusDebitDomestic,
                     codeDebitDomestic,
                     typeChipDebitDomestic,
                     typeProductDebitDomestic,
                     accountNumberDebitDomestic,
                     cardNumberDebitDomestic,
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
                     fileTypeCustomer,
                     coreDebt,
                     coreDebtLastYear,
                     cardNumberDebitInternational,
                     accountNumberDefaultLinkedCard,
                     amountFeeAnnually,
                     statusCardDebitInternational,
                     expiredDateCardDebitInternational,
                     activeDateCardDebitInternational,
                     typeCardDebitInternational,
                     codeCardDebitInternational,
                     department,
                     typeCreditCard,
                     accountNumberCreditCard,
                     accountIdCreditCard,
                     accountCreditCardLink,
                     limitAmountCreditCard,
                     statusCreditCard,
                     rateDebtAutoCreditCard,
                     activeDateCreditCard,
                     activeDateFirstTimeCreditCard,
                     activeDateAgainCreditCard,
                     expiredDateCreditCard,
                     closedDateCreditCard,
                     statusChangeDateCreditCard,
                     formIssueCreditCard,
                     transactionAmountCreditCard,
                     transactionAmountDebtCreditCard,
                     transactionAmountWriteCreditCard,
                     amountFeeCreditCard,
                     amountFeeServiceCreditCard,
                     feeServiceCreditCard,
                     numberOfTransactionsCreditCard,
                     numberOfTransactionsDebtCreditCard,
                     numberOfTransactionsWriteCreditCard,
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
            coreDebt,
            coreDebtLastYear,
            codeAM,
            formPHTDebitDomestic,
            accountNumberDebitDomestic,
            cardNumberDebitDomestic,
            typeChipDebitDomestic,
            typeProductDebitDomestic,
            codeDebitDomestic,
            statusDebitDomestic,
            cardNumberDebitInternational,
            accountNumberDefaultLinkedCard,
            amountFeeAnnually,
            statusCardDebitInternational,
            expiredDateCardDebitInternational,
            activeDateCardDebitInternational,
            typeCardDebitInternational,
            codeCardDebitInternational,
            department,
            typeCreditCard,
            accountNumberCreditCard,
            accountIdCreditCard,
            accountCreditCardLink,
            limitAmountCreditCard,
            statusCreditCard,
            rateDebtAutoCreditCard,
            activeDateCreditCard,
            activeDateFirstTimeCreditCard,
            activeDateAgainCreditCard,
            expiredDateCreditCard,
            closedDateCreditCard,
            statusChangeDateCreditCard,
            formIssueCreditCard,
            transactionAmountCreditCard,
            transactionAmountDebtCreditCard,
            transactionAmountWriteCreditCard,
            amountFeeCreditCard,
            amountFeeServiceCreditCard,
            feeServiceCreditCard,
            numberOfTransactionsCreditCard,
            numberOfTransactionsDebtCreditCard,
            numberOfTransactionsWriteCreditCard,
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

    async updateOneByIdInfoCustomerIncomeScale(
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

    async updateOneByInfoCustomerCoreDebt(
        id: string,
        type: SheetName,
        {
            coreDebt,
            coreDebtLastYear
        }: ICustomerCreate
    ): Promise<CustomerDocument> {
        const customerModel: CustomerDocument = await this.customerModel.findOne({cif: id});
        if (type === SheetName.InfoCustomerCoreDebt) {
            customerModel.coreDebt = coreDebt;
        }
        if (type === SheetName.InfoCustomerCoreDebtLastYear) {
            customerModel.coreDebtLastYear = coreDebtLastYear;
        }
        return customerModel.save();
    }

    async updateOneByInfoCreditInternationalCard(
        id: string,
        {
            department,
            fullName,
            codeAM,
            typeCreditCard,
            accountNumberCreditCard,
            accountIdCreditCard,
            accountCreditCardLink,
            limitAmountCreditCard,
            statusCreditCard,
            rateDebtAutoCreditCard,
            activeDateCreditCard,
            activeDateFirstTimeCreditCard,
            activeDateAgainCreditCard,
            expiredDateCreditCard,
            closedDateCreditCard,
            statusChangeDateCreditCard,
            formIssueCreditCard,
            transactionAmountCreditCard,
            transactionAmountDebtCreditCard,
            transactionAmountWriteCreditCard,
            amountFeeCreditCard,
            amountFeeServiceCreditCard,
            feeServiceCreditCard,
            numberOfTransactionsCreditCard,
            numberOfTransactionsDebtCreditCard,
            numberOfTransactionsWriteCreditCard
        }: ICustomerCreate
    ): Promise<CustomerDocument> {
        const customerModel: CustomerDocument = await this.customerModel.findOne({cif: id});
        customerModel.cif = id;
        customerModel.fullName = fullName;
        customerModel.codeAM = codeAM;
        customerModel.department = department;
        customerModel.typeCreditCard = typeCreditCard;
        customerModel.accountNumberCreditCard = accountNumberCreditCard;
        customerModel.accountIdCreditCard = accountIdCreditCard;
        customerModel.accountCreditCardLink = accountCreditCardLink;
        customerModel.limitAmountCreditCard = limitAmountCreditCard;
        customerModel.rateDebtAutoCreditCard = rateDebtAutoCreditCard;
        customerModel.activeDateCreditCard = activeDateCreditCard;
        customerModel.activeDateFirstTimeCreditCard = activeDateFirstTimeCreditCard;
        customerModel.activeDateAgainCreditCard = activeDateAgainCreditCard;
        customerModel.expiredDateCreditCard = expiredDateCreditCard;
        customerModel.closedDateCreditCard = closedDateCreditCard;
        customerModel.statusChangeDateCreditCard = statusChangeDateCreditCard;
        customerModel.formIssueCreditCard = formIssueCreditCard;
        customerModel.statusCreditCard = statusCreditCard;
        customerModel.transactionAmountCreditCard = transactionAmountCreditCard;
        customerModel.transactionAmountDebtCreditCard = transactionAmountDebtCreditCard;
        customerModel.transactionAmountWriteCreditCard = transactionAmountWriteCreditCard;
        customerModel.amountFeeCreditCard = amountFeeCreditCard;
        customerModel.amountFeeServiceCreditCard = amountFeeServiceCreditCard;
        customerModel.feeServiceCreditCard = feeServiceCreditCard;
        customerModel.numberOfTransactionsCreditCard = numberOfTransactionsCreditCard;
        customerModel.numberOfTransactionsDebtCreditCard = numberOfTransactionsDebtCreditCard;
        customerModel.numberOfTransactionsWriteCreditCard = numberOfTransactionsWriteCreditCard;
        return customerModel.save();
    }

    async updateOneByInfoDebitDomesticCard(
        id: string,
        {
            fullName,
            accountNumberDebitDomestic,
            cardNumberDebitDomestic,
            typeProductDebitDomestic,
            typeChipDebitDomestic,
            codeAM,
            codeDebitDomestic,
            statusDebitDomestic,
            formPHTDebitDomestic
        }: ICustomerCreate
    ): Promise<CustomerDocument> {
        const customerModel: CustomerDocument = await this.customerModel.findOne({cif: id});
        customerModel.cif = id;
        customerModel.fullName = fullName;
        customerModel.accountNumberDebitDomestic = accountNumberDebitDomestic;
        customerModel.cardNumberDebitDomestic = cardNumberDebitDomestic;
        customerModel.typeProductDebitDomestic = typeProductDebitDomestic;
        customerModel.typeChipDebitDomestic = typeChipDebitDomestic;
        customerModel.codeDebitDomestic = codeDebitDomestic;
        customerModel.statusDebitDomestic = statusDebitDomestic;
        customerModel.formPHTDebitDomestic = formPHTDebitDomestic;
        customerModel.codeAM = codeAM;
        return customerModel.save();
    }

    async updateOneByInfoDebitInternationalCard(
        id: string,
        {
            fullName,
            cardNumberDebitInternational,
            accountNumberDefaultLinkedCard,
            amountFeeAnnually,
            statusCardDebitInternational,
            expiredDateCardDebitInternational,
            activeDateCardDebitInternational,
            typeCardDebitInternational,
            codeCardDebitInternational,
            codeAM
        }: ICustomerCreate
    ): Promise<CustomerDocument> {
        const customerModel: CustomerDocument = await this.customerModel.findOne({cif: id});
        customerModel.cif = id;
        customerModel.fullName = fullName;
        customerModel.cardNumberDebitInternational = cardNumberDebitInternational;
        customerModel.accountNumberDefaultLinkedCard = accountNumberDefaultLinkedCard;
        customerModel.amountFeeAnnually = amountFeeAnnually;
        customerModel.statusCardDebitInternational = statusCardDebitInternational;
        customerModel.expiredDateCardDebitInternational = expiredDateCardDebitInternational;
        customerModel.activeDateCardDebitInternational = activeDateCardDebitInternational;
        customerModel.typeCardDebitInternational = typeCardDebitInternational;
        customerModel.codeCardDebitInternational = codeCardDebitInternational;
        customerModel.codeAM = codeAM;
        return customerModel.save();
    }

    async updateOneByInfoDetailTSDB(
        id: string,
        {
            fullName,
            totalDebtTSDB,
            debtShortTSDB,
            debtMediumTSDB,
            debtLongTSDB,
            valueTSDB,
            property,
            saveMoney,
            otherAsset
        }: ICustomerCreate
    ): Promise<CustomerDocument> {
        const customerModel: CustomerDocument = await this.customerModel.findOne({cif: id});
        customerModel.cif = id;
        customerModel.fullName = fullName;
        customerModel.totalDebtTSDB = totalDebtTSDB;
        customerModel.debtShortTSDB = debtShortTSDB;
        customerModel.debtMediumTSDB = debtMediumTSDB;
        customerModel.debtLongTSDB = debtLongTSDB;
        customerModel.valueTSDB = valueTSDB;
        customerModel.property = property;
        customerModel.saveMoney = saveMoney;
        customerModel.otherAsset = otherAsset;
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
        customerModel.cif = id;
        customerModel.fullName = fullName;
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
        customerModel.cif = id;
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
