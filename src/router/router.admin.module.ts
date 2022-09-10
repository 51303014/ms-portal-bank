import {Module} from '@nestjs/common';
import {AuthModule} from 'src/auth/auth.module';
import {PermissionAdminController} from 'src/permission/controller/permission.admin.controller';
import {PermissionModule} from 'src/permission/permission.module';
import {RoleAdminController} from 'src/role/controller/role.admin.controller';
import {RoleModule} from 'src/role/role.module';
import {SettingAdminController} from 'src/setting/controller/setting.admin.controller';
import {UserAdminController} from 'src/user/controller/user.admin.controller';
import {UserModule} from 'src/user/user.module';
import {IncomeModule} from '../income/income.module';
import {CustomerModule} from "../customers/customer.module";
import {WorkCustomerModule} from "../workCustomer/workCustomer.module";
import {CodeDepartmentLevelSixAdminController} from "../codeDepartmentLevelSix/controller/codeDepartmentLevelSix.admin.controller";
import {CodeDepartmentLevelSixModule} from "../codeDepartmentLevelSix/codeDepartmentLevelSix.module";

@Module({
    controllers: [
        RoleAdminController,
        UserAdminController,
        PermissionAdminController,
        SettingAdminController,
        CodeDepartmentLevelSixAdminController
    ],
    providers: [],
    exports: [],
    imports: [AuthModule, CustomerModule, CodeDepartmentLevelSixModule, WorkCustomerModule, IncomeModule, RoleModule, UserModule, PermissionModule],
})
export class RouterAdminModule {
}
