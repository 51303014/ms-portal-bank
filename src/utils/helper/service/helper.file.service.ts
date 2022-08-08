/* istanbul ignore file */

import {Injectable} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import excelJs from 'exceljs';
import {HelperDateService} from './helper.date.service';

@Injectable()
export class HelperFileService {
    private readonly appName: string;

    constructor(
        private readonly configService: ConfigService,
        private readonly helperDateService: HelperDateService
    ) {
        this.appName = this.configService.get<string>('app.name');
    }

    getCellValue(row: excelJs.Row, cellIndex: number) {
        const cell = row.getCell(cellIndex);
        return cell.value ? cell.value.toString() : '';
    };

    getCellFormulaValue(row: excelJs.Row, cellIndex: number) {
        const value = row.getCell(cellIndex).value as excelJs.CellFormulaValue;
        return value.result ? value.result.toString() : '';
    };

    getCellValueCommon(row: excelJs.Row, cellIndex: number) {
        const value = row.getCell(cellIndex).value as excelJs.CellFormulaValue;
        if (!value) {
            const cell = row.getCell(cellIndex);
            return cell.value ? cell.value.toString() : '';
        }
        return value.result ? value.result.toString() : '';
    }

    async writeExcel(
        headers: string[],
        rows: Record<string, string>[]
    ): Promise<Buffer> {
        const workbook = new excelJs.Workbook();
        workbook.creator = this.appName;
        workbook.lastModifiedBy = this.appName;
        workbook.created = this.helperDateService.create();
        workbook.modified = this.helperDateService.create();
        workbook.properties.date1904 = true;
        workbook.views = [
            {
                x: 0,
                y: 0,
                width: 10000,
                height: 20000,
                firstSheet: 0,
                activeTab: 1,
                visibility: 'visible',
            },
        ];

        // sheet
        const worksheet = workbook.addWorksheet('Sheet 1', {
            views: [{state: 'frozen', xSplit: 1}, {showGridLines: true}],
        });

        worksheet.columns = headers.map((val) => ({
            header: val,
        }));
        worksheet.addRows(rows);

        return (await workbook.xlsx.writeBuffer()) as Buffer;
    }
}
