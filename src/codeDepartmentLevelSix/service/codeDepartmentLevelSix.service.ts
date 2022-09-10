import { Injectable } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { DatabaseEntity } from 'src/database/database.decorator';
import { PermissionEntity } from 'src/permission/schema/permission.schema';
import {
    IDatabaseFindAllOptions,
    IDatabaseFindOneOptions,
} from 'src/database/database.interface';
import {CodeDepartmentLevelSixDocument, CodeDepartmentLevelSixEntity} from "../schema/codeDepartmentLevelSix.schema";
import {CodeDepartmentLevelSixCreateDto} from "../dto/codeDepartmentLevelSix.create.dto";
import {CodeDepartmentLevelSixUpdateDto} from "../dto/codeDepartmentLevelSix.update.dto";

@Injectable()
export class CodeDepartmentLevelSixService {
    constructor(
        @DatabaseEntity(CodeDepartmentLevelSixEntity.name)
        private readonly CodeDepartmentLevelSixModel: Model<CodeDepartmentLevelSixDocument>
    ) {}

    async findAll(
        find?: Record<string, any>,
        options?: IDatabaseFindAllOptions
    ): Promise<CodeDepartmentLevelSixDocument[]> {
        const roles = this.CodeDepartmentLevelSixModel.find(find);
        if (
            options &&
            options.limit !== undefined &&
            options.skip !== undefined
        ) {
            roles.limit(options.limit).skip(options.skip);
        }

        if (options && options.sort) {
            roles.sort(options.sort);
        }

        return roles.lean();
    }

    async getTotal(find?: Record<string, any>): Promise<number> {
        return this.CodeDepartmentLevelSixModel.countDocuments(find);
    }

    async findOneById<T>(
        _id: string,
        options?: IDatabaseFindOneOptions
    ): Promise<T> {
        const roles = this.CodeDepartmentLevelSixModel.findById(_id);

        if (options && options.populate && options.populate.permission) {
            roles.populate({
                path: 'permissions',
                model: PermissionEntity.name,
            });
        }

        return roles.lean();
    }

    async findOne<T>(
        find?: Record<string, any>,
        options?: IDatabaseFindOneOptions
    ): Promise<T> {
        const role = this.CodeDepartmentLevelSixModel.findOne(find);

        if (options && options.populate && options.populate.permission) {
            role.populate({
                path: 'permissions',
                model: PermissionEntity.name,
            });
        }

        return role.lean();
    }

    async exists(code: string, _id?: string): Promise<boolean> {
        const exist = await this.CodeDepartmentLevelSixModel.exists({
            code: {
                $regex: new RegExp(code),
                $options: 'i',
            },
            _id: { $nin: new Types.ObjectId(_id) },
        });

        return !!exist;
    }

    async create({
        name,
        code,
    }: CodeDepartmentLevelSixCreateDto): Promise<CodeDepartmentLevelSixDocument> {
        const create: CodeDepartmentLevelSixDocument = new this.CodeDepartmentLevelSixModel({
            name: name,
            code: code,
            isActive: true,
        });

        return create.save();
    }

    async update(
        _id: string,
        { name, code }: CodeDepartmentLevelSixUpdateDto
    ): Promise<CodeDepartmentLevelSixDocument> {
        const update: CodeDepartmentLevelSixDocument = await this.CodeDepartmentLevelSixModel.findById(_id);
        update.name = name;
        update.code = code

        return update.save();
    }

    async inactive(_id: string): Promise<CodeDepartmentLevelSixDocument> {
        const role: CodeDepartmentLevelSixDocument = await this.CodeDepartmentLevelSixModel.findById(_id);

        role.isActive = false;
        return role.save();
    }

    async active(_id: string): Promise<CodeDepartmentLevelSixDocument> {
        const role: CodeDepartmentLevelSixDocument = await this.CodeDepartmentLevelSixModel.findById(_id);

        role.isActive = true;
        return role.save();
    }

    async deleteOneById(_id: string): Promise<CodeDepartmentLevelSixDocument> {
        return this.CodeDepartmentLevelSixModel.findByIdAndDelete(_id);
    }

}
