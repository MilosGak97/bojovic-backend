import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { LoadStatus, PaymentStatus, ExpenseCategory, ExpenseType, DriverPayStatus } from '../../common/enums';
import { LoadRepository } from '../load/repositories/load.repository';
import { PaymentRecordRepository } from '../payment/repositories/payment-record.repository';
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
import {
  ExpenseRepository,
  VanExpenseCategoryRow,
} from './repositories/expense.repository';
import { DriverPayRecordRepository } from './repositories/driver-pay-record.repository';

interface ExpenseFilters {
  vanId?: string;
  driverId?: string;
  loadId?: string;
  category?: ExpenseCategory;
  expenseType?: ExpenseType;
  from?: string;
  to?: string;
  isRecurring?: boolean;
}

interface DriverPayFilters {
  driverId?: string;
  year?: number;
  month?: number;
}

interface PeriodTotals {
  totalRevenue: number;
  operationalExpenses: number;
  totalSalaries: number;
  totalExpenses: number;
  netProfit: number;
  profitMarginPercent: number;
  totalKmDriven: number;
  costPerKm: number;
  revenuePerKm: number;
}

@Injectable()
export class FinanceService {
  constructor(
    private readonly expenseRepo: ExpenseRepository,
    private readonly driverPayRepo: DriverPayRecordRepository,
    private readonly paymentRepo: PaymentRecordRepository,
    private readonly loadRepo: LoadRepository,
  ) {}

  private static toNumber(value: unknown): number {
    if (value === null || value === undefined) return 0;
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  private static round(value: number, scale = 2): number {
    const factor = 10 ** scale;
    return Math.round(value * factor) / factor;
  }

  private static normalizeDateRange(from?: string, to?: string): { from: string; to: string } {
    if (!from || !to) {
      throw new BadRequestException('Both from and to query parameters are required.');
    }

    const fromDate = new Date(from);
    const toDate = new Date(to);

    if (Number.isNaN(fromDate.getTime()) || Number.isNaN(toDate.getTime())) {
      throw new BadRequestException('Invalid date range. Use ISO date format (YYYY-MM-DD).');
    }

    const fromKey = fromDate.toISOString().slice(0, 10);
    const toKey = toDate.toISOString().slice(0, 10);

    if (fromKey > toKey) {
      throw new BadRequestException('Invalid date range. `from` must be before or equal to `to`.');
    }

    return { from: fromKey, to: toKey };
  }

  private static toMonthRange(year: number, month: number): { from: string; to: string } {
    const fromDate = new Date(Date.UTC(year, month - 1, 1));
    const toDate = new Date(Date.UTC(year, month, 0));
    return {
      from: fromDate.toISOString().slice(0, 10),
      to: toDate.toISOString().slice(0, 10),
    };
  }

  private static calculateTotalPay(input: {
    baseSalary?: number | null;
    perDiemTotal?: number | null;
    bonus?: number | null;
    deductions?: number | null;
  }): number {
    const base = FinanceService.toNumber(input.baseSalary);
    const perDiem = FinanceService.toNumber(input.perDiemTotal);
    const bonus = FinanceService.toNumber(input.bonus);
    const deductions = FinanceService.toNumber(input.deductions);
    return FinanceService.round(base + perDiem + bonus - deductions);
  }

  private async calculatePeriodTotals(from: string, to: string): Promise<PeriodTotals> {
    const [revenueAndKm, operationalExpenses, totalSalaries] = await Promise.all([
      this.loadRepo
        .createQueryBuilder('load')
        .select('COALESCE(SUM(COALESCE(load.agreedPrice, 0)), 0)', 'totalRevenue')
        .addSelect('COALESCE(SUM(COALESCE(load.distanceKm, 0)), 0)', 'totalKmDriven')
        .where('load.status = :status', { status: LoadStatus.DELIVERED })
        .andWhere('load.delivery_date_from::date BETWEEN :from AND :to', { from, to })
        .getRawOne<{ totalRevenue: string; totalKmDriven: string }>(),
      this.expenseRepo.getTotalByPeriod(from, to),
      this.driverPayRepo.getTotalSalariesByPeriod(from, to),
    ]);

    const totalRevenue = FinanceService.round(FinanceService.toNumber(revenueAndKm?.totalRevenue));
    const totalKmDriven = FinanceService.round(FinanceService.toNumber(revenueAndKm?.totalKmDriven), 2);
    const safeOperationalExpenses = FinanceService.round(operationalExpenses);
    const safeSalaries = FinanceService.round(totalSalaries);
    const totalExpenses = FinanceService.round(safeOperationalExpenses + safeSalaries);
    const netProfit = FinanceService.round(totalRevenue - totalExpenses);

    return {
      totalRevenue,
      operationalExpenses: safeOperationalExpenses,
      totalSalaries: safeSalaries,
      totalExpenses,
      netProfit,
      profitMarginPercent:
        totalRevenue > 0 ? FinanceService.round((netProfit / totalRevenue) * 100) : 0,
      totalKmDriven,
      costPerKm:
        totalKmDriven > 0 ? FinanceService.round(totalExpenses / totalKmDriven, 4) : 0,
      revenuePerKm:
        totalKmDriven > 0 ? FinanceService.round(totalRevenue / totalKmDriven, 4) : 0,
    };
  }

  private async getExpenseSumForLoad(loadId: string): Promise<number> {
    const grouped = await this.expenseRepo.getTotalByLoadGrouped([loadId]);
    if (grouped.length === 0) return 0;
    return FinanceService.round(grouped[0].total);
  }

  private buildVanCostSummary(
    vanId: string,
    rows: VanExpenseCategoryRow[],
    kmByVan: Map<string, number>,
  ): VanCostSummaryDto {
    let fuel = 0;
    let toll = 0;
    let maintenance = 0;
    let insurance = 0;
    let leasing = 0;
    let other = 0;

    for (const row of rows) {
      const value = FinanceService.toNumber(row.total);

      switch (row.category) {
        case ExpenseCategory.FUEL:
          fuel += value;
          break;
        case ExpenseCategory.TOLL:
          toll += value;
          break;
        case ExpenseCategory.MAINTENANCE:
        case ExpenseCategory.REPAIR:
          maintenance += value;
          break;
        case ExpenseCategory.INSURANCE:
          insurance += value;
          break;
        case ExpenseCategory.LEASING:
          leasing += value;
          break;
        default:
          other += value;
      }
    }

    const grandTotal = fuel + toll + maintenance + insurance + leasing + other;
    const km = FinanceService.toNumber(kmByVan.get(vanId));

    return {
      vanId,
      fuel: FinanceService.round(fuel),
      toll: FinanceService.round(toll),
      maintenance: FinanceService.round(maintenance),
      insurance: FinanceService.round(insurance),
      leasing: FinanceService.round(leasing),
      other: FinanceService.round(other),
      grandTotal: FinanceService.round(grandTotal),
      costPerKm: km > 0 ? FinanceService.round(grandTotal / km, 4) : 0,
    };
  }

  // ─── Expense CRUD ──────────────────────────────────────────────────────────

  async createExpense(dto: CreateExpenseDto): Promise<Expense> {
    const expense = this.expenseRepo.create({
      ...dto,
      expenseDate: new Date(dto.expenseDate),
    });
    const saved = await this.expenseRepo.save(expense);
    return this.findExpense(saved.id);
  }

  async findExpense(id: string): Promise<Expense> {
    const expense = await this.expenseRepo.findOne({
      where: { id },
      relations: ['van', 'driver', 'load'],
    });

    if (!expense) {
      throw new NotFoundException(`Expense ${id} not found.`);
    }

    return expense;
  }

  async updateExpense(id: string, dto: UpdateExpenseDto): Promise<Expense> {
    const existing = await this.findExpense(id);

    Object.assign(existing, {
      ...dto,
      ...(dto.expenseDate ? { expenseDate: new Date(dto.expenseDate) } : {}),
    });

    await this.expenseRepo.save(existing);
    return this.findExpense(id);
  }

  async deleteExpense(id: string): Promise<void> {
    const expense = await this.findExpense(id);
    await this.expenseRepo.remove(expense);
  }

  async findExpenses(filters: ExpenseFilters): Promise<Expense[]> {
    const qb = this.expenseRepo
      .createQueryBuilder('expense')
      .leftJoinAndSelect('expense.van', 'van')
      .leftJoinAndSelect('expense.driver', 'driver')
      .leftJoinAndSelect('expense.load', 'load')
      .orderBy('expense.expenseDate', 'DESC')
      .addOrderBy('expense.createdAt', 'DESC');

    if (filters.vanId) {
      qb.andWhere('expense.vanId = :vanId', { vanId: filters.vanId });
    }
    if (filters.driverId) {
      qb.andWhere('expense.driverId = :driverId', { driverId: filters.driverId });
    }
    if (filters.loadId) {
      qb.andWhere('expense.loadId = :loadId', { loadId: filters.loadId });
    }
    if (filters.category) {
      qb.andWhere('expense.category = :category', { category: filters.category });
    }
    if (filters.expenseType) {
      qb.andWhere('expense.expenseType = :expenseType', { expenseType: filters.expenseType });
    }
    if (filters.isRecurring !== undefined) {
      qb.andWhere('expense.isRecurring = :isRecurring', { isRecurring: filters.isRecurring });
    }

    if (filters.from || filters.to) {
      const { from, to } = FinanceService.normalizeDateRange(filters.from, filters.to);
      qb.andWhere('expense.expenseDate BETWEEN :from AND :to', { from, to });
    }

    return qb.getMany();
  }

  async findRecurringExpenses(): Promise<Expense[]> {
    return this.expenseRepo.findRecurring();
  }

  // ─── Driver Pay CRUD ───────────────────────────────────────────────────────

  async createDriverPay(dto: CreateDriverPayRecordDto): Promise<DriverPayRecord> {
    const existing = await this.driverPayRepo.findOne({
      where: { driverId: dto.driverId, year: dto.year, month: dto.month },
    });

    if (existing) {
      throw new BadRequestException(
        `Driver pay record for driver ${dto.driverId} and period ${dto.year}-${dto.month} already exists.`,
      );
    }

    const driverPay = this.driverPayRepo.create({
      ...dto,
      paidDate: dto.paidDate ? new Date(dto.paidDate) : undefined,
      totalPay: FinanceService.calculateTotalPay(dto),
    });

    const saved = await this.driverPayRepo.save(driverPay);
    return this.findDriverPay(saved.id);
  }

  async findDriverPay(id: string): Promise<DriverPayRecord> {
    const record = await this.driverPayRepo.findOne({
      where: { id },
      relations: ['driver'],
    });

    if (!record) {
      throw new NotFoundException(`Driver pay record ${id} not found.`);
    }

    return record;
  }

  async updateDriverPay(id: string, dto: UpdateDriverPayRecordDto): Promise<DriverPayRecord> {
    const existing = await this.findDriverPay(id);

    const merged = {
      baseSalary: dto.baseSalary ?? existing.baseSalary,
      perDiemTotal: dto.perDiemTotal ?? existing.perDiemTotal,
      bonus: dto.bonus ?? existing.bonus,
      deductions: dto.deductions ?? existing.deductions,
    };

    Object.assign(existing, {
      ...dto,
      ...(dto.paidDate ? { paidDate: new Date(dto.paidDate) } : {}),
      totalPay: FinanceService.calculateTotalPay(merged),
    });

    await this.driverPayRepo.save(existing);
    return this.findDriverPay(id);
  }

  async markDriverPayPaid(id: string, paidDate?: string): Promise<DriverPayRecord> {
    const existing = await this.findDriverPay(id);

    existing.status = DriverPayStatus.PAID;
    existing.paidDate = paidDate ? new Date(paidDate) : new Date();

    await this.driverPayRepo.save(existing);
    return this.findDriverPay(id);
  }

  async findDriverPayRecords(filters: DriverPayFilters): Promise<DriverPayRecord[]> {
    const qb = this.driverPayRepo
      .createQueryBuilder('pay')
      .leftJoinAndSelect('pay.driver', 'driver')
      .orderBy('pay.year', 'DESC')
      .addOrderBy('pay.month', 'DESC')
      .addOrderBy('pay.createdAt', 'DESC');

    if (filters.driverId) {
      qb.andWhere('pay.driverId = :driverId', { driverId: filters.driverId });
    }
    if (filters.year) {
      qb.andWhere('pay.year = :year', { year: filters.year });
    }
    if (filters.month) {
      qb.andWhere('pay.month = :month', { month: filters.month });
    }

    return qb.getMany();
  }

  // ─── Reports ───────────────────────────────────────────────────────────────

  async getPeriodSummary(from: string, to: string): Promise<PeriodSummaryDto> {
    const range = FinanceService.normalizeDateRange(from, to);
    const totals = await this.calculatePeriodTotals(range.from, range.to);

    return {
      totalRevenue: totals.totalRevenue,
      totalExpenses: totals.totalExpenses,
      totalSalaries: totals.totalSalaries,
      netProfit: totals.netProfit,
      profitMarginPercent: totals.profitMarginPercent,
      totalKmDriven: totals.totalKmDriven,
      costPerKm: totals.costPerKm,
      revenuePerKm: totals.revenuePerKm,
    };
  }

  async getExpenseBreakdown(from: string, to: string): Promise<ExpenseBreakdownItemDto[]> {
    const range = FinanceService.normalizeDateRange(from, to);
    const rows = await this.expenseRepo.getExpenseBreakdown(range.from, range.to);
    const grandTotal = rows.reduce((sum, row) => sum + FinanceService.toNumber(row.total), 0);

    return rows
      .map((row) => {
        const total = FinanceService.round(FinanceService.toNumber(row.total));
        return {
          category: row.category,
          total,
          count: FinanceService.toNumber(row.count),
          percentOfTotal:
            grandTotal > 0 ? FinanceService.round((total / grandTotal) * 100) : 0,
        };
      })
      .sort((a, b) => b.total - a.total);
  }

  async getCashFlow(from: string, to: string): Promise<CashFlowDto> {
    const range = FinanceService.normalizeDateRange(from, to);

    const incoming = await this.paymentRepo
      .createQueryBuilder('payment')
      .innerJoin('payment.load', 'load')
      .select('COALESCE(SUM(COALESCE(payment.totalWithVat, payment.amount, 0)), 0)', 'expectedIncoming')
      .addSelect(
        `COALESCE(SUM(CASE WHEN load.invoitix = true THEN COALESCE(payment.totalWithVat, payment.amount, 0) ELSE 0 END), 0)`,
        'expectedIncomingInvoitix',
      )
      .addSelect(
        `COALESCE(SUM(CASE WHEN load.valutaCheck = true THEN COALESCE(payment.totalWithVat, payment.amount, 0) ELSE 0 END), 0)`,
        'expectedIncomingValuta',
      )
      .where('payment.status <> :writtenOff', { writtenOff: PaymentStatus.WRITTEN_OFF })
      .andWhere(
        `COALESCE(payment.due_date, payment.issue_date, payment.created_at::date) BETWEEN :from AND :to`,
        range,
      )
      .getRawOne<{
        expectedIncoming: string;
        expectedIncomingInvoitix: string;
        expectedIncomingValuta: string;
      }>();

    const [totalExpenses, totalSalaries] = await Promise.all([
      this.expenseRepo.getTotalByPeriod(range.from, range.to),
      this.driverPayRepo.getTotalSalariesByPeriod(range.from, range.to),
    ]);

    const expectedIncoming = FinanceService.round(FinanceService.toNumber(incoming?.expectedIncoming));
    const expectedIncomingInvoitix = FinanceService.round(
      FinanceService.toNumber(incoming?.expectedIncomingInvoitix),
    );
    const expectedIncomingValuta = FinanceService.round(
      FinanceService.toNumber(incoming?.expectedIncomingValuta),
    );
    const safeExpenses = FinanceService.round(totalExpenses);
    const safeSalaries = FinanceService.round(totalSalaries);

    return {
      expectedIncoming,
      expectedIncomingInvoitix,
      expectedIncomingValuta,
      totalExpenses: safeExpenses,
      totalSalaries: safeSalaries,
      netCashFlow: FinanceService.round(expectedIncoming - safeExpenses - safeSalaries),
    };
  }

  async getLoadProfit(loadId: string): Promise<LoadProfitDto> {
    const load = await this.loadRepo.findOne({ where: { id: loadId } });

    if (!load) {
      throw new NotFoundException(`Load ${loadId} not found.`);
    }

    const revenue = FinanceService.round(FinanceService.toNumber(load.agreedPrice));
    const expenses = await this.getExpenseSumForLoad(loadId);
    const profit = FinanceService.round(revenue - expenses);
    const distanceKm = FinanceService.round(FinanceService.toNumber(load.distanceKm), 2);

    return {
      loadId,
      revenue,
      expenses,
      profit,
      profitMarginPercent: revenue > 0 ? FinanceService.round((profit / revenue) * 100) : 0,
      distanceKm,
      profitPerKm: distanceKm > 0 ? FinanceService.round(profit / distanceKm, 4) : 0,
    };
  }

  async getLoadProfits(from: string, to: string): Promise<LoadProfitDto[]> {
    const range = FinanceService.normalizeDateRange(from, to);

    const loads = await this.loadRepo
      .createQueryBuilder('load')
      .where('load.status = :status', { status: LoadStatus.DELIVERED })
      .andWhere('load.delivery_date_from::date BETWEEN :from AND :to', range)
      .orderBy('load.deliveryDateFrom', 'ASC')
      .getMany();

    if (loads.length === 0) return [];

    const expenseByLoad = new Map(
      (await this.expenseRepo.getTotalByLoadGrouped(loads.map((load) => load.id))).map((row) => [
        row.loadId,
        FinanceService.toNumber(row.total),
      ]),
    );

    return loads.map((load) => {
      const revenue = FinanceService.round(FinanceService.toNumber(load.agreedPrice));
      const expenses = FinanceService.round(expenseByLoad.get(load.id) ?? 0);
      const profit = FinanceService.round(revenue - expenses);
      const distanceKm = FinanceService.round(FinanceService.toNumber(load.distanceKm), 2);

      return {
        loadId: load.id,
        revenue,
        expenses,
        profit,
        profitMarginPercent: revenue > 0 ? FinanceService.round((profit / revenue) * 100) : 0,
        distanceKm,
        profitPerKm: distanceKm > 0 ? FinanceService.round(profit / distanceKm, 4) : 0,
      };
    });
  }

  async getVanCostSummary(vanId: string, from: string, to: string): Promise<VanCostSummaryDto> {
    const range = FinanceService.normalizeDateRange(from, to);

    const [expenseRows, kmRows] = await Promise.all([
      this.expenseRepo
        .createQueryBuilder('expense')
        .select('expense.vanId', 'vanId')
        .addSelect('expense.category', 'category')
        .addSelect('SUM(expense.amount)', 'total')
        .where('expense.vanId = :vanId', { vanId })
        .andWhere('expense.expenseDate BETWEEN :from AND :to', range)
        .groupBy('expense.vanId')
        .addGroupBy('expense.category')
        .getRawMany<{ vanId: string; category: ExpenseCategory; total: string }>(),
      this.loadRepo
        .createQueryBuilder('load')
        .select('load.plannerVanId', 'vanId')
        .addSelect('COALESCE(SUM(COALESCE(load.distanceKm, 0)), 0)', 'km')
        .where('load.plannerVanId = :vanId', { vanId })
        .andWhere('load.status = :status', { status: LoadStatus.DELIVERED })
        .andWhere('load.delivery_date_from::date BETWEEN :from AND :to', range)
        .groupBy('load.plannerVanId')
        .getRawMany<{ vanId: string; km: string }>(),
    ]);

    const kmByVan = new Map(
      kmRows.map((row) => [row.vanId, FinanceService.toNumber(row.km)]),
    );

    return this.buildVanCostSummary(
      vanId,
      expenseRows.map((row) => ({
        vanId: row.vanId,
        category: row.category,
        total: FinanceService.toNumber(row.total),
      })),
      kmByVan,
    );
  }

  async getAllVanCostSummaries(from: string, to: string): Promise<VanCostSummaryDto[]> {
    const range = FinanceService.normalizeDateRange(from, to);

    const [expenseRows, kmRows] = await Promise.all([
      this.expenseRepo.getTotalByVanGrouped(range.from, range.to),
      this.loadRepo
        .createQueryBuilder('load')
        .select('load.plannerVanId', 'vanId')
        .addSelect('COALESCE(SUM(COALESCE(load.distanceKm, 0)), 0)', 'km')
        .where('load.plannerVanId IS NOT NULL')
        .andWhere('load.status = :status', { status: LoadStatus.DELIVERED })
        .andWhere('load.delivery_date_from::date BETWEEN :from AND :to', range)
        .groupBy('load.plannerVanId')
        .getRawMany<{ vanId: string; km: string }>(),
    ]);

    const kmByVan = new Map(
      kmRows.map((row) => [row.vanId, FinanceService.toNumber(row.km)]),
    );

    const vanIds = new Set<string>([
      ...expenseRows.map((row) => row.vanId),
      ...kmRows.map((row) => row.vanId),
    ]);

    return Array.from(vanIds)
      .sort((a, b) => a.localeCompare(b))
      .map((vanId) =>
        this.buildVanCostSummary(
          vanId,
          expenseRows.filter((row) => row.vanId === vanId),
          kmByVan,
        ),
      );
  }

  async getMonthlyPnL(year: number): Promise<MonthlyPnLItemDto[]> {
    if (!Number.isInteger(year) || year < 2000 || year > 3000) {
      throw new BadRequestException('Invalid year. Expected an integer in range 2000-3000.');
    }

    const periods = Array.from({ length: 12 }, (_, index) => ({
      month: index + 1,
      ...FinanceService.toMonthRange(year, index + 1),
    }));

    const monthlyTotals = await Promise.all(
      periods.map((period) => this.calculatePeriodTotals(period.from, period.to)),
    );

    return periods.map((period, idx) => ({
      month: period.month,
      totalRevenue: monthlyTotals[idx].totalRevenue,
      totalExpenses: monthlyTotals[idx].operationalExpenses,
      totalSalaries: monthlyTotals[idx].totalSalaries,
      netProfit: monthlyTotals[idx].netProfit,
    }));
  }
}
