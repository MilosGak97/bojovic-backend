import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiPropertyOptional,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { IsDateString, IsOptional } from 'class-validator';
import { ExpenseCategory, ExpenseType } from '../../common/enums';
import { FinanceService } from './finance.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { CreateDriverPayRecordDto } from './dto/create-driver-pay-record.dto';
import { UpdateDriverPayRecordDto } from './dto/update-driver-pay-record.dto';
import {
  CashFlowDto,
  ExpenseBreakdownItemDto,
  LoadProfitDto,
  MonthlyPnLItemDto,
  PeriodSummaryDto,
  VanCostSummaryDto,
} from './dto/financial-summary.dto';
import { Expense } from './entities/expense.entity';
import { DriverPayRecord } from './entities/driver-pay-record.entity';

class MarkDriverPayPaidDto {
  @ApiPropertyOptional({
    description: 'Optional explicit payment date. Defaults to today when omitted.',
    example: '2026-03-05',
    format: 'date',
    type: String,
  })
  @IsOptional()
  @IsDateString()
  paidDate?: string;
}

@ApiTags('Finance')
@Controller('finance')
export class FinanceController {
  constructor(private readonly financeService: FinanceService) {}

  private parseBooleanQuery(value?: string): boolean | undefined {
    if (value === undefined) return undefined;

    const normalized = value.toLowerCase();
    if (['1', 'true', 'yes', 'on'].includes(normalized)) return true;
    if (['0', 'false', 'no', 'off'].includes(normalized)) return false;

    throw new BadRequestException('Invalid boolean value for isRecurring query parameter.');
  }

  // ─── Expenses ──────────────────────────────────────────────────────────────

  @Post('expenses')
  @ApiOperation({ summary: 'Create expense' })
  @ApiResponse({ status: 201, type: Expense })
  createExpense(@Body() dto: CreateExpenseDto) {
    return this.financeService.createExpense(dto);
  }

  @Get('expenses')
  @ApiOperation({ summary: 'List expenses with optional filters' })
  @ApiQuery({ name: 'vanId', required: false, format: 'uuid' })
  @ApiQuery({ name: 'driverId', required: false, format: 'uuid' })
  @ApiQuery({ name: 'loadId', required: false, format: 'uuid' })
  @ApiQuery({ name: 'category', required: false, enum: ExpenseCategory, enumName: 'ExpenseCategory' })
  @ApiQuery({ name: 'type', required: false, enum: ExpenseType, enumName: 'ExpenseType' })
  @ApiQuery({ name: 'from', required: false, format: 'date' })
  @ApiQuery({ name: 'to', required: false, format: 'date' })
  @ApiQuery({ name: 'isRecurring', required: false, type: String })
  @ApiResponse({ status: 200, type: [Expense] })
  findExpenses(
    @Query('vanId') vanId?: string,
    @Query('driverId') driverId?: string,
    @Query('loadId') loadId?: string,
    @Query('category') category?: ExpenseCategory,
    @Query('type') type?: ExpenseType,
    @Query('from') from?: string,
    @Query('to') to?: string,
    @Query('isRecurring') isRecurring?: string,
  ) {
    return this.financeService.findExpenses({
      vanId,
      driverId,
      loadId,
      category,
      expenseType: type,
      from,
      to,
      isRecurring: this.parseBooleanQuery(isRecurring),
    });
  }

  @Get('expenses/recurring')
  @ApiOperation({ summary: 'List recurring expenses' })
  @ApiResponse({ status: 200, type: [Expense] })
  findRecurringExpenses() {
    return this.financeService.findRecurringExpenses();
  }

  @Get('expenses/:id')
  @ApiOperation({ summary: 'Get one expense by ID' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiResponse({ status: 200, type: Expense })
  findExpense(@Param('id', ParseUUIDPipe) id: string) {
    return this.financeService.findExpense(id);
  }

  @Put('expenses/:id')
  @ApiOperation({ summary: 'Update expense' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiResponse({ status: 200, type: Expense })
  updateExpense(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateExpenseDto,
  ) {
    return this.financeService.updateExpense(id, dto);
  }

  @Delete('expenses/:id')
  @ApiOperation({ summary: 'Delete expense' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiResponse({ status: 200 })
  deleteExpense(@Param('id', ParseUUIDPipe) id: string) {
    return this.financeService.deleteExpense(id);
  }

  // ─── Driver Pay ───────────────────────────────────────────────────────────

  @Post('driver-pay')
  @ApiOperation({ summary: 'Create driver pay record' })
  @ApiResponse({ status: 201, type: DriverPayRecord })
  createDriverPay(@Body() dto: CreateDriverPayRecordDto) {
    return this.financeService.createDriverPay(dto);
  }

  @Get('driver-pay')
  @ApiOperation({ summary: 'List driver pay records with optional filters' })
  @ApiQuery({ name: 'driverId', required: false, format: 'uuid' })
  @ApiQuery({ name: 'year', required: false, type: Number })
  @ApiQuery({ name: 'month', required: false, type: Number })
  @ApiResponse({ status: 200, type: [DriverPayRecord] })
  findDriverPayRecords(
    @Query('driverId') driverId?: string,
    @Query('year') year?: string,
    @Query('month') month?: string,
  ) {
    return this.financeService.findDriverPayRecords({
      driverId,
      year: year ? Number(year) : undefined,
      month: month ? Number(month) : undefined,
    });
  }

  @Get('driver-pay/:id')
  @ApiOperation({ summary: 'Get one driver pay record by ID' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiResponse({ status: 200, type: DriverPayRecord })
  findDriverPay(@Param('id', ParseUUIDPipe) id: string) {
    return this.financeService.findDriverPay(id);
  }

  @Put('driver-pay/:id')
  @ApiOperation({ summary: 'Update driver pay record' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiResponse({ status: 200, type: DriverPayRecord })
  updateDriverPay(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateDriverPayRecordDto,
  ) {
    return this.financeService.updateDriverPay(id, dto);
  }

  @Patch('driver-pay/:id/paid')
  @ApiOperation({ summary: 'Mark driver pay record as paid' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiResponse({ status: 200, type: DriverPayRecord })
  markDriverPayPaid(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: MarkDriverPayPaidDto,
  ) {
    return this.financeService.markDriverPayPaid(id, dto.paidDate);
  }

  // ─── Reports ──────────────────────────────────────────────────────────────

  @Get('reports/summary')
  @ApiOperation({ summary: 'Get period P&L summary' })
  @ApiQuery({ name: 'from', required: true, format: 'date' })
  @ApiQuery({ name: 'to', required: true, format: 'date' })
  @ApiResponse({ status: 200, type: PeriodSummaryDto })
  getPeriodSummary(@Query('from') from: string, @Query('to') to: string) {
    return this.financeService.getPeriodSummary(from, to);
  }

  @Get('reports/expense-breakdown')
  @ApiOperation({ summary: 'Get expense breakdown by category' })
  @ApiQuery({ name: 'from', required: true, format: 'date' })
  @ApiQuery({ name: 'to', required: true, format: 'date' })
  @ApiResponse({ status: 200, type: [ExpenseBreakdownItemDto] })
  getExpenseBreakdown(@Query('from') from: string, @Query('to') to: string) {
    return this.financeService.getExpenseBreakdown(from, to);
  }

  @Get('reports/cash-flow')
  @ApiOperation({ summary: 'Get expected incoming vs outgoing cash flow' })
  @ApiQuery({ name: 'from', required: true, format: 'date' })
  @ApiQuery({ name: 'to', required: true, format: 'date' })
  @ApiResponse({ status: 200, type: CashFlowDto })
  getCashFlow(@Query('from') from: string, @Query('to') to: string) {
    return this.financeService.getCashFlow(from, to);
  }

  @Get('reports/load-profit/:loadId')
  @ApiOperation({ summary: 'Get profitability for one load' })
  @ApiParam({ name: 'loadId', format: 'uuid' })
  @ApiResponse({ status: 200, type: LoadProfitDto })
  getLoadProfit(@Param('loadId', ParseUUIDPipe) loadId: string) {
    return this.financeService.getLoadProfit(loadId);
  }

  @Get('reports/load-profits')
  @ApiOperation({ summary: 'Get profitability for all delivered loads in period' })
  @ApiQuery({ name: 'from', required: true, format: 'date' })
  @ApiQuery({ name: 'to', required: true, format: 'date' })
  @ApiResponse({ status: 200, type: [LoadProfitDto] })
  getLoadProfits(@Query('from') from: string, @Query('to') to: string) {
    return this.financeService.getLoadProfits(from, to);
  }

  @Get('reports/van-costs')
  @ApiOperation({ summary: 'Get aggregated costs for all vans in period' })
  @ApiQuery({ name: 'from', required: true, format: 'date' })
  @ApiQuery({ name: 'to', required: true, format: 'date' })
  @ApiResponse({ status: 200, type: [VanCostSummaryDto] })
  getAllVanCosts(@Query('from') from: string, @Query('to') to: string) {
    return this.financeService.getAllVanCostSummaries(from, to);
  }

  @Get('reports/van-costs/:vanId')
  @ApiOperation({ summary: 'Get aggregated costs for one van in period' })
  @ApiParam({ name: 'vanId', format: 'uuid' })
  @ApiQuery({ name: 'from', required: true, format: 'date' })
  @ApiQuery({ name: 'to', required: true, format: 'date' })
  @ApiResponse({ status: 200, type: VanCostSummaryDto })
  getVanCosts(
    @Param('vanId', ParseUUIDPipe) vanId: string,
    @Query('from') from: string,
    @Query('to') to: string,
  ) {
    return this.financeService.getVanCostSummary(vanId, from, to);
  }

  @Get('reports/monthly-pnl')
  @ApiOperation({ summary: 'Get month-by-month P&L for a year' })
  @ApiQuery({ name: 'year', required: true, type: Number })
  @ApiResponse({ status: 200, type: [MonthlyPnLItemDto] })
  getMonthlyPnL(@Query('year') year: string) {
    return this.financeService.getMonthlyPnL(Number(year));
  }
}
