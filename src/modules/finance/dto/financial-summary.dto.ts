import { ApiProperty } from '@nestjs/swagger';
import { ExpenseCategory } from '../../../common/enums';

export class PeriodSummaryDto {
  @ApiProperty({ example: 24500, description: 'Total delivered-load revenue in the period' })
  totalRevenue: number;

  @ApiProperty({ example: 18200, description: 'Total outgoing costs (expenses + salaries) in the period' })
  totalExpenses: number;

  @ApiProperty({ example: 6200, description: 'Salary component included in totalExpenses' })
  totalSalaries: number;

  @ApiProperty({ example: 6300, description: 'Net profit = totalRevenue - totalExpenses' })
  netProfit: number;

  @ApiProperty({ example: 25.71, description: 'Profit margin percentage' })
  profitMarginPercent: number;

  @ApiProperty({ example: 18450, description: 'Total kilometers driven by delivered loads' })
  totalKmDriven: number;

  @ApiProperty({ example: 0.99, description: 'Cost per kilometer' })
  costPerKm: number;

  @ApiProperty({ example: 1.33, description: 'Revenue per kilometer' })
  revenuePerKm: number;
}

export class ExpenseBreakdownItemDto {
  @ApiProperty({ enum: ExpenseCategory, enumName: 'ExpenseCategory', example: ExpenseCategory.FUEL })
  category: ExpenseCategory;

  @ApiProperty({ example: 7420, description: 'Total amount for this category in the period' })
  total: number;

  @ApiProperty({ example: 38, description: 'Number of expense records in this category' })
  count: number;

  @ApiProperty({ example: 41.23, description: 'Category share of total expenses in percent' })
  percentOfTotal: number;
}

export class CashFlowDto {
  @ApiProperty({ example: 21000, description: 'Expected incoming payments in the period' })
  expectedIncoming: number;

  @ApiProperty({ example: 12600, description: 'Expected incoming where related load uses invoitix' })
  expectedIncomingInvoitix: number;

  @ApiProperty({ example: 8400, description: 'Expected incoming where related load uses valuta check' })
  expectedIncomingValuta: number;

  @ApiProperty({ example: 9400, description: 'Total operational expenses from expense records' })
  totalExpenses: number;

  @ApiProperty({ example: 6200, description: 'Total salaries from payroll records' })
  totalSalaries: number;

  @ApiProperty({ example: 5400, description: 'Net cash flow = expectedIncoming - expenses - salaries' })
  netCashFlow: number;
}

export class LoadProfitDto {
  @ApiProperty({ format: 'uuid', example: 'c7d9ffac-4474-4bb4-ab29-cef6d07c26be' })
  loadId: string;

  @ApiProperty({ example: 1800 })
  revenue: number;

  @ApiProperty({ example: 740 })
  expenses: number;

  @ApiProperty({ example: 1060 })
  profit: number;

  @ApiProperty({ example: 58.89 })
  profitMarginPercent: number;

  @ApiProperty({ example: 670 })
  distanceKm: number;

  @ApiProperty({ example: 1.58 })
  profitPerKm: number;
}

export class VanCostSummaryDto {
  @ApiProperty({ format: 'uuid', example: '0f5eec83-22bd-4a4a-92f3-2c793fca1485' })
  vanId: string;

  @ApiProperty({ example: 4200 })
  fuel: number;

  @ApiProperty({ example: 620 })
  toll: number;

  @ApiProperty({ example: 310 })
  maintenance: number;

  @ApiProperty({ example: 240 })
  insurance: number;

  @ApiProperty({ example: 980 })
  leasing: number;

  @ApiProperty({ example: 190 })
  other: number;

  @ApiProperty({ example: 6540 })
  grandTotal: number;

  @ApiProperty({ example: 0.89 })
  costPerKm: number;
}

export class MonthlyPnLItemDto {
  @ApiProperty({ example: 1 })
  month: number;

  @ApiProperty({ example: 21500 })
  totalRevenue: number;

  @ApiProperty({ example: 15600 })
  totalExpenses: number;

  @ApiProperty({ example: 6100 })
  totalSalaries: number;

  @ApiProperty({ example: 5900 })
  netProfit: number;
}
