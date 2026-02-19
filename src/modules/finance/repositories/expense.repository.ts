import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Expense } from '../entities/expense.entity';
import { ExpenseCategory } from '../../../common/enums';

export interface ExpenseBreakdownRow {
  category: ExpenseCategory;
  total: number;
  count: number;
}

export interface VanExpenseCategoryRow {
  vanId: string;
  category: ExpenseCategory;
  total: number;
}

export interface LoadExpenseTotalRow {
  loadId: string;
  total: number;
}

@Injectable()
export class ExpenseRepository extends Repository<Expense> {
  constructor(private dataSource: DataSource) {
    super(Expense, dataSource.createEntityManager());
  }

  async findByVan(vanId: string): Promise<Expense[]> {
    return this.find({
      where: { vanId },
      relations: ['van', 'driver', 'load'],
      order: { expenseDate: 'DESC', createdAt: 'DESC' },
    });
  }

  async findByDriver(driverId: string): Promise<Expense[]> {
    return this.find({
      where: { driverId },
      relations: ['van', 'driver', 'load'],
      order: { expenseDate: 'DESC', createdAt: 'DESC' },
    });
  }

  async findByLoad(loadId: string): Promise<Expense[]> {
    return this.find({
      where: { loadId },
      relations: ['van', 'driver', 'load'],
      order: { expenseDate: 'DESC', createdAt: 'DESC' },
    });
  }

  async findByDateRange(from: string, to: string): Promise<Expense[]> {
    return this.createQueryBuilder('expense')
      .leftJoinAndSelect('expense.van', 'van')
      .leftJoinAndSelect('expense.driver', 'driver')
      .leftJoinAndSelect('expense.load', 'load')
      .where('expense.expenseDate BETWEEN :from AND :to', { from, to })
      .orderBy('expense.expenseDate', 'DESC')
      .addOrderBy('expense.createdAt', 'DESC')
      .getMany();
  }

  async findByCategory(category: ExpenseCategory): Promise<Expense[]> {
    return this.find({
      where: { category },
      relations: ['van', 'driver', 'load'],
      order: { expenseDate: 'DESC', createdAt: 'DESC' },
    });
  }

  async findRecurring(): Promise<Expense[]> {
    return this.find({
      where: { isRecurring: true },
      relations: ['van', 'driver', 'load'],
      order: { recurringLabel: 'ASC', expenseDate: 'DESC', createdAt: 'DESC' },
    });
  }

  async getExpenseBreakdown(from: string, to: string): Promise<ExpenseBreakdownRow[]> {
    const rows = await this.createQueryBuilder('expense')
      .select('expense.category', 'category')
      .addSelect('SUM(expense.amount)', 'total')
      .addSelect('COUNT(*)', 'count')
      .where('expense.expenseDate BETWEEN :from AND :to', { from, to })
      .groupBy('expense.category')
      .getRawMany<{ category: ExpenseCategory; total: string; count: string }>();

    return rows.map((row) => ({
      category: row.category,
      total: Number(row.total ?? 0),
      count: Number(row.count ?? 0),
    }));
  }

  async getTotalByPeriod(from: string, to: string): Promise<number> {
    const row = await this.createQueryBuilder('expense')
      .select('COALESCE(SUM(expense.amount), 0)', 'total')
      .where('expense.expenseDate BETWEEN :from AND :to', { from, to })
      .getRawOne<{ total: string }>();

    return Number(row?.total ?? 0);
  }

  async getTotalByVanGrouped(from: string, to: string): Promise<VanExpenseCategoryRow[]> {
    const rows = await this.createQueryBuilder('expense')
      .select('expense.vanId', 'vanId')
      .addSelect('expense.category', 'category')
      .addSelect('SUM(expense.amount)', 'total')
      .where('expense.expenseDate BETWEEN :from AND :to', { from, to })
      .andWhere('expense.vanId IS NOT NULL')
      .groupBy('expense.vanId')
      .addGroupBy('expense.category')
      .getRawMany<{ vanId: string; category: ExpenseCategory; total: string }>();

    return rows.map((row) => ({
      vanId: row.vanId,
      category: row.category,
      total: Number(row.total ?? 0),
    }));
  }

  async getTotalByLoadGrouped(loadIds: string[]): Promise<LoadExpenseTotalRow[]> {
    if (loadIds.length === 0) return [];

    const rows = await this.createQueryBuilder('expense')
      .select('expense.loadId', 'loadId')
      .addSelect('SUM(expense.amount)', 'total')
      .where('expense.loadId IN (:...loadIds)', { loadIds })
      .groupBy('expense.loadId')
      .getRawMany<{ loadId: string; total: string }>();

    return rows.map((row) => ({
      loadId: row.loadId,
      total: Number(row.total ?? 0),
    }));
  }
}
