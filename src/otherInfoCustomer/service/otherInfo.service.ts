import {Injectable} from '@nestjs/common';
import {Model} from 'mongoose';
import {DatabaseEntity} from 'src/database/database.decorator';
import {PermissionEntity} from 'src/permission/schema/permission.schema';
import {IDatabaseFindAllOptions, IDatabaseFindOneOptions,} from 'src/database/database.interface';
import {UserEntity} from "../../user/schema/user.schema";
import {OtherInfoCustomerDocument, OtherInfoCustomerEntity} from "../schema/otherInfo.schema";
import {IOtherInfoCustomerCreate} from "../otherInfo.interface";


@Injectable()
export class OtherInfoService {
    private readonly uploadPath: string;

    constructor(
        @DatabaseEntity(OtherInfoCustomerEntity.name)
        private readonly otherInfoCustomerModel: Model<OtherInfoCustomerDocument>,
    ) {
        this.uploadPath = 'report';
    }

    async findAll(
        find?: Record<string, any>,
        options?: IDatabaseFindAllOptions
    ): Promise<OtherInfoCustomerDocument[]> {
        const files = this.otherInfoCustomerModel.find(find)

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
        return this.otherInfoCustomerModel.countDocuments(find);
    }


    async findOneById<T>(
        _id: string,
        options?: IDatabaseFindOneOptions
    ): Promise<T> {
        const file = this.otherInfoCustomerModel.findById(_id);

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
        const file = this.otherInfoCustomerModel.findOne(find);

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
                     _id,
                     cif,
                     dateKHCCAdditional,
                     expensesPayed,
                     priorityKHRegistered,
                     productsApply,
                     programsApplied,
                     favouriteCustomer,
                     habitsCustomer,
                     user
                 }: IOtherInfoCustomerCreate
    ):
        Promise<OtherInfoCustomerDocument> {
        const infoOther = await this.otherInfoCustomerModel.findOne({_id, user});
        if (infoOther) {
            if (dateKHCCAdditional) {
                infoOther.dateKHCCAdditional = dateKHCCAdditional;
            }
            if (productsApply) {
                infoOther.productsApply = productsApply;
            }
            if (programsApplied) {
                infoOther.programsApplied = programsApplied;
            }
            if (priorityKHRegistered) {
                infoOther.priorityKHRegistered = priorityKHRegistered;
            }
            if (expensesPayed) {
                infoOther.expensesPayed = expensesPayed;
            }
            if (habitsCustomer) {
                infoOther.habitsCustomer = habitsCustomer;
            }
            if (favouriteCustomer) {
                infoOther.favouriteCustomer = favouriteCustomer;
            }
            return infoOther.save();
        }
        const otherInfoCustomerEntity: OtherInfoCustomerEntity = {
            cif,
            dateKHCCAdditional,
            expensesPayed,
            priorityKHRegistered,
            productsApply,
            programsApplied,
            favouriteCustomer,
            habitsCustomer
        };

        const create: OtherInfoCustomerDocument = new this.otherInfoCustomerModel(otherInfoCustomerEntity);
        return create.save();
    }

    async deleteOneById(_id: string):
        Promise<OtherInfoCustomerDocument> {
        return this.otherInfoCustomerModel.findByIdAndDelete(_id);
    }

    async deleteOne(find: Record<string, any>
    ):
        Promise<OtherInfoCustomerDocument> {
        return this.otherInfoCustomerModel.findOneAndDelete(find);
    }

    async updateOneById(
        id: string, {}: IOtherInfoCustomerCreate
    ):
        Promise<OtherInfoCustomerDocument> {
        const otherInfoCustomerModel
            :
            OtherInfoCustomerDocument = await this.otherInfoCustomerModel.findOne({cif: id});
        return otherInfoCustomerModel.save();
    }
}
