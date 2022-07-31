import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { AuthModule } from 'src/auth/auth.module';
import { AuthCommonController } from 'src/auth/controller/auth.common.controller';
import { HealthCommonController } from 'src/health/controller/health.common.controller';
import { HealthModule } from 'src/health/health.module';
import { PermissionModule } from 'src/permission/permission.module';
import { RoleModule } from 'src/role/role.module';
import { SettingCommonController } from 'src/setting/controller/setting.common.controller';
import { UserModule } from 'src/user/user.module';
import {FileModule} from "../files/file.module";
import {CustomerModule} from "../customers/customer.module";
import {IncomeModule} from "../income/income.module";
import {CardModule} from "../card/card.module";
import {AssetModule} from "../assetSpecial/asset.module";
import {CompanyModule} from "../company/company.module";
import {ParentModule} from "../parents/parent.module";
import {WorkCustomerModule} from "../workCustomer/workCustomer.module";
import {OtherInfoModule} from "../otherInfoCustomer/otherInfo.module";

@Module({
    controllers: [
        AuthCommonController,
        HealthCommonController,
        SettingCommonController,
    ],
    providers: [],
    exports: [],
    imports: [
        UserModule,
        FileModule,
        CustomerModule,
        ParentModule,
        OtherInfoModule,
        WorkCustomerModule,
        IncomeModule,
        AssetModule,
        CompanyModule,
        CardModule,
        AuthModule,
        RoleModule,
        PermissionModule,
        TerminusModule,
        HttpModule,
        HealthModule,
    ],
})
export class RouterCommonModule {}
