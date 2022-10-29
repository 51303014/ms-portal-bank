import {Injectable} from '@nestjs/common';
import {Model, Types} from 'mongoose';
import {DatabaseEntity} from 'src/database/database.decorator';
import {PermissionEntity} from 'src/permission/schema/permission.schema';
import {IDatabaseFindAllOptions, IDatabaseFindOneOptions,} from 'src/database/database.interface';
import {UserEntity} from "../../user/schema/user.schema";
import {WorkCustomerDocument, WorkCustomerEntity} from "../schema/workCustomer.schema";
import {IWorkCustomerCreate} from "../workCustomer.interface";
import {CustomerDocument} from "../../customers/schema/customer.schema";
import {CustomerListSerialization} from "../../customers/serialization/customer.list.serialization";
import {plainToInstance} from "class-transformer";
import {WorkCustomerListSerialization} from "../serialization/work-customer.list.serialization";


@Injectable()
export class WorkCustomerService {
    private readonly uploadPath: string;

    constructor(
        @DatabaseEntity(WorkCustomerEntity.name)
        private readonly workCustomerModel: Model<WorkCustomerDocument>,
    ) {
        this.uploadPath = 'report';
    }

    async findAllWorkProgress<T>(
        find?: Record<string, any>,
    ): Promise<T[]> {
        return this.workCustomerModel.aggregate([
            {
                $project: {
                    "year": {$year: "$created_at"},
                    "month": {$month: "$created_at"},
                    "day": {$dayOfMonth: "$created_at"}
                },
                $match: {
                    "year": new Date().getFullYear(),
                    "month": new Date().getMonth() + 1,
                    "day": new Date().getDate()
                },
            }
        ]);
    }

    async findAll<T>(
        find?: Record<string, any>,
        options?: IDatabaseFindAllOptions
    ): Promise<T[]> {
        const files = this.workCustomerModel.find(find)

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
        return this.workCustomerModel.countDocuments(find);
    }


    async findOneById<T>(
        _id: string,
        options?: IDatabaseFindOneOptions
    ): Promise<T> {
        const file = this.workCustomerModel.findById(_id);

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
        const file = this.workCustomerModel.findOne(find);

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

    async createOrUpdate({
                     cif,
                     codeAM,
                     codeDepartmentLevelSix,
                     statusFix,
                     result,
                     inProgress,
                     deadline,
                     dateStart,
                     workHandle,
                     user,
                 }: IWorkCustomerCreate
    ):
        Promise<WorkCustomerDocument> {
        const infoUserCreated: WorkCustomerDocument  = await this.findOne({user, cif});
        if (infoUserCreated) {
            infoUserCreated.inProgress = inProgress;
            infoUserCreated.result = result;
            infoUserCreated.statusFix = statusFix;
            infoUserCreated.workHandle = workHandle;
        }
        const workCustomerEntity: WorkCustomerEntity = {
            dateStart,
            deadline,
            inProgress,
            user: new Types.ObjectId(user),
            result,
            statusFix,
            workHandle,
            cif,
            codeAM,
            codeDepartmentLevelSix,
        };

        const create: WorkCustomerDocument = new this.workCustomerModel(workCustomerEntity);
        return create.save();
    }

    async deleteOneById(_id: string):
        Promise<WorkCustomerDocument> {
        return this.workCustomerModel.findByIdAndDelete(_id);
    }

    async deleteOne(find: Record<string, any>
    ):
        Promise<WorkCustomerDocument> {
        return this.workCustomerModel.findOneAndDelete(find);
    }

    async updateOneById(
        id: string, {}: IWorkCustomerCreate
    ):
        Promise<WorkCustomerDocument> {
        const workCustomerModel
            :
            WorkCustomerDocument = await this.workCustomerModel.findOne({cif: id});
        return workCustomerModel.save();
    }

    async serializationList(
        data: WorkCustomerDocument[]
    ): Promise<WorkCustomerListSerialization[]> {
        return plainToInstance(WorkCustomerListSerialization, data);
    }
}
