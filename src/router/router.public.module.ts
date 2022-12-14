import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { AuthPublicController } from 'src/auth/controller/auth.public.controller';
import { AwsModule } from 'src/aws/aws.module';
import { PermissionModule } from 'src/permission/permission.module';
import { RoleModule } from 'src/role/role.module';
import { UserPublicController } from 'src/user/controller/user.public.controller';
import { UserModule } from 'src/user/user.module';
import {FileModule} from "../files/file.module";
import {FileController} from "../files/controller/file.controller";
import {CustomerModule} from "../customers/customer.module";
import {CustomerController} from "../customers/controller/customer.controller";
import {IncomeModule} from "../income/income.module";
import {IncomeController} from "../income/controller/income.controller";
import {CardController} from "../card/controller/card.controller";
import {CardModule} from "../card/card.module";
import {AssetModule} from "../assetSpecial/asset.module";
import {AssetController} from "../assetSpecial/controller/asset.controller";
import {CompanyModule} from "../company/company.module";
import {CompanyController} from "../company/controller/company.controller";
import {ParentModule} from "../parents/parent.module";
import {ParentController} from "../parents/controller/parent.controller";
import {WorkCustomerModule} from "../workCustomer/workCustomer.module";
import {WorkCustomerController} from "../workCustomer/controller/workCustomer.controller";
import {OtherInfoModule} from "../otherInfoCustomer/otherInfo.module";
import {OtherInfoController} from "../otherInfoCustomer/controller/otherInfo.controller";
import { HistoryCustomerModule } from '../historyCustomer/historyCustomer.module';
import { HistoryCustomerController } from '../historyCustomer/controller/historyCustomer.controller';

@Module({
    controllers: [UserPublicController,FileController,WorkCustomerController,OtherInfoController, ParentController, CompanyController, CustomerController, AssetController, HistoryCustomerController, IncomeController, CardController, AuthPublicController],
    providers: [],
    exports: [],
    imports: [UserModule, FileModule, CustomerModule, HistoryCustomerModule, OtherInfoModule, WorkCustomerModule, AssetModule,ParentModule, CompanyModule, IncomeModule, CardModule, AwsModule, AuthModule, RoleModule, PermissionModule],
})
export class RouterPublicModule {}
