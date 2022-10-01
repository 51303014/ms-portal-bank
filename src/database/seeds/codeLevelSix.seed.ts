import {Command} from 'nestjs-command';
import {Injectable} from '@nestjs/common';
import {ErrorMeta} from 'src/utils/error/error.decorator';
import {CodeDepartmentLevelSixService} from "../../codeDepartmentLevelSix/service/codeDepartmentLevelSix.service";
import {CodeDepartmentLevelSixBulkService} from "../../codeDepartmentLevelSix/service/codeDepartmentLevelSix.bulk.service";

@Injectable()
export class CodeLevelSixSeed {
    constructor(
        private readonly codeLevelSixService: CodeDepartmentLevelSixService,
        private readonly codeLevelSixBulk: CodeDepartmentLevelSixBulkService
    ) {
    }

    @ErrorMeta(CodeLevelSixSeed.name, 'insert')
    @Command({
        command: 'insert:codeLevelSix',
        describe: 'insert codeLevelSix',
    })
    async insert(): Promise<void> {
        try {
            await this.codeLevelSixService.create({
                name: 'PHONG KHACH HANG DOANH NGHIEP 1_CN GIA DINH',
                code: '111100135021',
            });
            await this.codeLevelSixService.create({
                name: 'PHONG KHACH HANG DOANH NGHIEP 2_CN GIA DINH',
                code: '111100135022',
            });
            await this.codeLevelSixService.create({
                name: 'PHONG KHACH HANG UU TIEN_CN GIA DINH',
                code: '112100135123',
            });
            await this.codeLevelSixService.create({
                name: 'PHONG KHACH HANG CA NHAN 1_CN GIA DINH',
                code: '112100135121',
            });
            await this.codeLevelSixService.create({
                name: 'PHONG KHACH HANG CA NHAN 2_CN GIA DINH',
                code: '112100135122',
            });
            await this.codeLevelSixService.create({
                name: 'PGD HANG XANH_CN GIA DINH',
                code: '112100135153',
            });
            await this.codeLevelSixService.create({
                name: 'PGD DAKAO_CN GIA DINH',
                code: '112100135150',
            });
            await this.codeLevelSixService.create({
                name: 'PGD DINH TIEN HOANG_CN GIA DINH',
                code: '112100135152',
            });
            await this.codeLevelSixService.create({
                name: 'PHONG KE HOACH TAI CHINH_CN GIA DINH',
                code: '116700135521',
            });
            await this.codeLevelSixService.create({
                name: 'PHONG CHUNG_CN GIA DINH',
                code: '119000135000',
            });
        } catch (e) {
            throw new Error(e.message);
        }

        return;
    }

    @ErrorMeta(CodeLevelSixSeed.name, 'remove')
    @Command({
        command: 'remove:codeLevelSix',
        describe: 'remove codeLevelSix',
    })
    async remove(): Promise<void> {
        try {
            await this.codeLevelSixBulk.deleteMany({});
        } catch (e) {
            throw new Error(e.message);
        }

        return;
    }
}
