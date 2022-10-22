import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {Document} from 'mongoose';

@Schema({timestamps: true, versionKey: false})
export class AssetEntity {
    @Prop({
        required: false,
        trim: true,
        index: true
    })
    cif: string;

    @Prop({
        required: false,
        index: true
    })
    codeDepartmentLevelSix?: string;

    @Prop({
        required: false,
        trim: true,
    })
    fullName?: string;

    @Prop({
        required: false,
        trim: true,
    })
    totalDebtTSDB?: string;

    @Prop({
        required: false,
        trim: true,
    })
    debtShortTSDB?: string;

    @Prop({
        required: false,
        trim: true,
    })
    debtMediumTSDB?: string;

    @Prop({
        required: false,
        trim: true,
    })
    debtLongTSDB?: string;

    @Prop({
        required: false
    })
    valueTSDB?: number;

    @Prop({
        required: false,
        trim: true,
    })
    property?: string;

    @Prop({
        required: false,
        trim: true,
    })
    saveMoney?: string;

    @Prop({
        required: false,
        trim: true,
    })
    otherAsset?: string;
}

export const AssetDataBaseName = 'assets';
export const AssetSchema = SchemaFactory.createForClass(AssetEntity);

export type AssetDocument = AssetEntity & Document;

// Hooks
AssetSchema.pre<AssetDocument>('save', function (next) {
    next();
});
