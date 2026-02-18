import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddBrokerEmployeeCount1760712000000 implements MigrationInterface {
  name = 'AddBrokerEmployeeCount1760712000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "broker_companies" ADD COLUMN IF NOT EXISTS "employee_count" integer`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "broker_companies" DROP COLUMN IF EXISTS "employee_count"`,
    );
  }
}

