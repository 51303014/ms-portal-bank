import {IUserDocument} from "../user/user.interface";
import {AssetDocument} from "./schema/asset.schema";

export interface IAssetDocument extends Omit<AssetDocument, 'user'> {
    user: IUserDocument;
}

export interface IAssetCreate {
    cif?: string;
    fullName?: string;
    totalDebtTSDB?: string;
    debtShortTSDB?: string;
    debtMediumTSDB?: string;
    debtLongTSDB?: string;
    valueTSDB?: number;
    property?: string;
    saveMoney?: string;
    otherAsset?: string;
}

export type IAssetUpdate = Pick<IAssetCreate, 'cif'>;

