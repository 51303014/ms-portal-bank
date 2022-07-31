import {Injectable} from '@nestjs/common';
import {Model} from 'mongoose';
import {plainToInstance} from 'class-transformer';
import {DatabaseEntity} from 'src/database/database.decorator';
import {PermissionEntity} from 'src/permission/schema/permission.schema';
import {IDatabaseFindAllOptions, IDatabaseFindOneOptions,} from 'src/database/database.interface';
import {UserEntity} from "../../user/schema/user.schema";
import {CompanyDocument, CompanyEntity} from "../schema/company.schema";
import {CompanyUploadSerialization} from "../serialization/company.upload.serialization";
import {ICompanyCreate, ICompanyDocument} from "../company.interface";
import {CompanyListSerialization} from "../serialization/company.list.serialization";
import {CompanyGetSerialization} from "../serialization/company.get.serialization";


@Injectable()
export class CompanyService {
    private readonly uploadPath: string;

    constructor(
        @DatabaseEntity(CompanyEntity.name)
        private readonly companyModel: Model<CompanyDocument>,
    ) {
        this.uploadPath = 'report';
    }

    async findAll<T>(
        find?: Record<string, any>,
        options?: IDatabaseFindAllOptions
    ): Promise<T[]> {
        const files = this.companyModel.find(find)

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
        return this.companyModel.countDocuments(find);
    }

    async serializationProfile(
        data: ICompanyDocument
    ): Promise<CompanyUploadSerialization> {
        return plainToInstance(CompanyUploadSerialization, data);
    }

    async serializationList(
        data: ICompanyDocument[]
    ): Promise<CompanyListSerialization[]> {
        return plainToInstance(CompanyListSerialization, data);
    }

    async serializationGet(data: ICompanyDocument): Promise<CompanyGetSerialization> {
        return plainToInstance(CompanyGetSerialization, data);
    }

    async findOneById<T>(
        _id: string,
        options?: IDatabaseFindOneOptions
    ): Promise<T> {
        const file = this.companyModel.findById(_id);

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
        const file = this.companyModel.findOne(find);

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
                     nameCompany,
                     cifCompany,
                     position,
                     relationshipOtherCompany,
                 }: ICompanyCreate
    ):
        Promise<CompanyDocument> {
        const companyEntity: CompanyEntity = {
            cif,
            nameCompany,
            cifCompany,
            position,
            relationshipOtherCompany,
        };

        const create: CompanyDocument = new this.companyModel(companyEntity);
        return create.save();
    }

    async deleteOneById(_id: string):
        Promise<CompanyDocument> {
        return this.companyModel.findByIdAndDelete(_id);
    }

    async deleteOne(find: Record<string, any>
    ):
        Promise<CompanyDocument> {
        return this.companyModel.findOneAndDelete(find);
    }

    async updateOneById(
        id: string, {}: ICompanyCreate
    ):
        Promise<CompanyDocument> {
        const companyModel
            :
            CompanyDocument = await this.companyModel.findOne({cif: id});
        return companyModel.save();
    }
}
