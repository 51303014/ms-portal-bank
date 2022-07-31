import {Injectable} from '@nestjs/common';
import {Model} from 'mongoose';
import {DatabaseEntity} from 'src/database/database.decorator';
import {PermissionEntity} from 'src/permission/schema/permission.schema';
import {IDatabaseFindAllOptions, IDatabaseFindOneOptions,} from 'src/database/database.interface';
import {UserEntity} from "../../user/schema/user.schema";
import {ParentDocument, ParentEntity} from "../schema/parent.schema";
import {IParentCreate} from "../parent.interface";


@Injectable()
export class ParentService {
    private readonly uploadPath: string;

    constructor(
        @DatabaseEntity(ParentEntity.name)
        private readonly parentModel: Model<ParentDocument>,
    ) {
        this.uploadPath = 'report';
    }

    async findAll(
        find?: Record<string, any>,
        options?: IDatabaseFindAllOptions
    ): Promise<ParentDocument[]> {
        const files = this.parentModel.find(find)

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
        return this.parentModel.countDocuments(find);
    }


    async findOneById<T>(
        _id: string,
        options?: IDatabaseFindOneOptions
    ): Promise<T> {
        const file = this.parentModel.findById(_id);

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
        const file = this.parentModel.findOne(find);

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
                     cifRelevant,
                     fullNameRelevant,
                     relationship,
                 }: IParentCreate
    ):
        Promise<ParentDocument> {
        const ParentEntity: ParentEntity = {
            cif,
            cifRelevant,
            fullNameRelevant,
            relationship,
        };

        const create: ParentDocument = new this.parentModel(ParentEntity);
        return create.save();
    }

    async deleteOneById(_id: string):
        Promise<ParentDocument> {
        return this.parentModel.findByIdAndDelete(_id);
    }

    async deleteOne(find: Record<string, any>
    ):
        Promise<ParentDocument> {
        return this.parentModel.findOneAndDelete(find);
    }

    async updateOneById(
        id: string, {}: IParentCreate
    ):
        Promise<ParentDocument> {
        const parentModel
            :
            ParentDocument = await this.parentModel.findOne({cif: id});
        return parentModel.save();
    }
}
