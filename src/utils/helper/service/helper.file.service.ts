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

    getCellValue(row: excelJs.Row, cellIndex: number, cif?: boolean) {
        const cell = row.getCell(cellIndex);
        if (cif && (cell.value === 0 || cell.value === '0')) {
            return '0';
        }
        return cell && cell.value ? cell.value.toString() : '';
    };

    getCellFormulaValue(row: excelJs.Row, cellIndex: number, cif?: boolean) {
        const value = row.getCell(cellIndex).value as excelJs.CellFormulaValue;
        if (cif && (value.result === 0 || value.result === '0')) {
            return '0';
        }
        return value && value.result ? value.result.toString() : '';
    };

    getCellValueCommon(row: excelJs.Row, cellIndex: number) {
        const value = row.getCell(cellIndex).value as excelJs.CellFormulaValue;
        const cell = row.getCell(cellIndex);
        if (!value) {
            return cell && cell.value ? cell.value.toString() : null;
        }
        return value ? value.toString() : value.result ? value.result.toString() : null;
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
