import {Injectable} from '@nestjs/common';
import {Model, Types} from 'mongoose';
import {plainToInstance} from 'class-transformer';
import {DatabaseEntity} from 'src/database/database.decorator';
import {HelperStringService} from 'src/utils/helper/service/helper.string.service';
import {PermissionEntity} from 'src/permission/schema/permission.schema';
import {IDatabaseFindAllOptions, IDatabaseFindOneOptions,} from 'src/database/database.interface';
import {UserEntity} from "../../user/schema/user.schema";
import {CustomerUploadSerialization} from "../serialization/customer.upload.serialization";
import {CustomerListSerialization} from "../serialization/customer.list.serialization";
import {CustomerGetSerialization} from "../serialization/customer.get.serialization";
import {AssetDocument, AssetEntity} from "../schema/asset.schema";
import {IAssetCreate, IAssetDocument} from "../asset.interface";

@Injectable()
export class AssetService {
    private readonly uploadPath: string;

    constructor(
        @DatabaseEntity(AssetEntity.name)
        private readonly assetModel: Model<AssetDocument>,
        private readonly helperStringService: HelperStringService,
    ) {
        this.uploadPath = 'report';
    }

    async findAll<T>(
        find?: Record<string, any>,
        options?: IDatabaseFindAllOptions,
    ): Promise<T[]> {
        const assets = this.assetModel.find(find);
        if (
            options &&
            options.limit !== undefined &&
            options.skip !== undefined
        ) {
            assets.limit(options.limit).skip(options.skip);
        }

        if (options && options.sort) {
            assets.sort(options.sort);
        }

        return assets.lean();
    }

    async findAllBaseField<T>(
        find?: Record<string, any>,
    ): Promise<T[]> {
        return this.assetModel.aggregate([
            {
                $group: {
                    _id: "$cif",
                    totalValueTSDB: {
                        $sum: "$valueTSDB"
                    }
                }
            }
        ]);
    }

    async getTotal(find?: Record<string, any>): Promise<number> {
        return this.assetModel.countDocuments(find);
    }

    async serializationProfile(
        data: IAssetDocument
    ): Promise<CustomerUploadSerialization> {
        return plainToInstance(CustomerUploadSerialization, data);
    }

    async serializationList(
        data: IAssetDocument[]
    ): Promise<CustomerListSerialization[]> {
        return plainToInstance(CustomerListSerialization, data);
    }

    async serializationGet(data: IAssetDocument): Promise<CustomerGetSerialization> {
        return plainToInstance(CustomerGetSerialization, data);
    }

    async findOneById<T>(
        _id: string,
        options?: IDatabaseFindOneOptions
    ): Promise<T> {
        const file = this.assetModel.findById(_id);

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
        const file = this.assetModel.findOne(find);

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
                     codeDepartmentLevelSix,
                     fullName,
                     totalDebtTSDB,
                     debtShortTSDB,
                     debtMediumTSDB,
                     debtLongTSDB,
                     valueTSDB,
                     property,
                     saveMoney,
                     otherAsset,
                 }: IAssetCreate): Promise<AssetDocument> {
        const AssetEntity: AssetEntity = {
            cif,
            codeDepartmentLevelSix,
            fullName,
            totalDebtTSDB,
            debtShortTSDB,
            debtMediumTSDB,
            debtLongTSDB,
            valueTSDB,
            property,
            saveMoney,
            otherAsset
        };
        const create: AssetDocument = new this.assetModel(AssetEntity);
        return create.save();
    }

    async deleteOneById(_id: string): Promise<AssetDocument> {
        return this.assetModel.findByIdAndDelete(_id);
    }

    async deleteOne(find: Record<string, any>): Promise<AssetDocument> {
        return this.assetModel.findOneAndDelete(find);
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
        }: IAssetCreate
    ): Promise<AssetDocument> {
        const assetModel: AssetDocument = await this.assetModel.findOne({cif: id});
        assetModel.cif = id;
        assetModel.fullName = fullName;
        assetModel.totalDebtTSDB = totalDebtTSDB;
        assetModel.debtShortTSDB = debtShortTSDB;
        assetModel.debtMediumTSDB = debtMediumTSDB;
        assetModel.debtLongTSDB = debtLongTSDB;
        assetModel.valueTSDB = valueTSDB;
        assetModel.property = property;
        assetModel.saveMoney = saveMoney;
        assetModel.otherAsset = otherAsset;
        return assetModel.save();
    }


    async createRandomFilename(originalFileName: string): Promise<Record<string, any>> {
        const filename: string = this.helperStringService.random(20);
        return {
            path: this.uploadPath,
            filename: `${filename}_${originalFileName}`,
        };
    }

}
