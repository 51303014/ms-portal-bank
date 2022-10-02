import {Command} from 'nestjs-command';
import {Injectable} from '@nestjs/common';
import {UserService} from 'src/user/service/user.service';
import {UserBulkService} from 'src/user/service/user.bulk.service';
import {RoleService} from 'src/role/service/role.service';
import {AuthService} from 'src/auth/service/auth.service';
import {RoleDocument} from 'src/role/schema/role.schema';
import {ErrorMeta} from 'src/utils/error/error.decorator';

@Injectable()
export class UserSeed {
    constructor(
        private readonly authService: AuthService,
        private readonly userService: UserService,
        private readonly userBulkService: UserBulkService,
        private readonly roleService: RoleService
    ) {
    }

    @ErrorMeta(UserSeed.name, 'insert')
    @Command({
        command: 'insert:user',
        describe: 'insert users',
    })
    async insert(): Promise<void> {
        const roleAdmin: RoleDocument = await this.roleService.findOne<RoleDocument>(
            {
                name: 'admin',
            }
        );
        const roleManager: RoleDocument = await this.roleService.findOne<RoleDocument>(
            {
                name: 'manager',
            }
        );
        const roleLeader: RoleDocument = await this.roleService.findOne<RoleDocument>(
            {
                name: 'leader',
            }
        );
        const roleUser: RoleDocument = await this.roleService.findOne<RoleDocument>(
            {
                name: 'user',
            }
        );

        try {
            const password = await this.authService.createPassword(
                'aaAA@@123444'
            );

            await this.userService.create({
                fullName: 'võ tấn trần duy',
                codeEmployee: '80553',
                password: password.passwordHash,
                passwordExpired: password.passwordExpired,
                mobileNumber: '0913659111',
                role: roleAdmin._id,
                salt: password.salt,
            });
            await this.userService.create({
                fullName: 'Đặng Thị Ngọc An',
                codeEmployee: '169044',
                password: password.passwordHash,
                passwordExpired: password.passwordExpired,
                mobileNumber: '0913659111',
                role: roleAdmin._id,
                salt: password.salt,
            });
            //
            // await this.userService.create({
            //     firstName: 'user',
            //     lastName: 'user',
            //     codeEmployee: '176818',
            //     password: password.passwordHash,
            //     passwordExpired: password.passwordExpired,
            //     mobileNumber: '08111111113',
            //     role: roleUser._id,
            //     salt: password.salt,
            // });
            // await this.userService.create({
            //     firstName: 'manager',
            //     lastName: 'manager',
            //     codeEmployee: '133436',
            //     password: password.passwordHash,
            //     passwordExpired: password.passwordExpired,
            //     mobileNumber: '08111111114',
            //     role: roleManager._id,
            //     salt: password.salt,
            // });
            // await this.userService.create({
            //     firstName: 'leader',
            //     lastName: 'leader',
            //     codeEmployee: '76719',
            //     password: password.passwordHash,
            //     passwordExpired: password.passwordExpired,
            //     mobileNumber: '08111111115',
            //     role: roleLeader._id,
            //     salt: password.salt,
            // });
        } catch (e) {
            throw new Error(e.message);
        }

        return;
    }

    @ErrorMeta(UserSeed.name, 'remove')
    @Command({
        command: 'remove:user',
        describe: 'remove users',
    })
    async remove(): Promise<void> {
        try {
            await this.userBulkService.deleteMany({});
        } catch (e) {
            throw new Error(e.message);
        }

        return;
    }
}
