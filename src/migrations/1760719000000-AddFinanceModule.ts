import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddFinanceModule1760719000000 implements MigrationInterface {
  name = 'AddFinanceModule1760719000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'expense_category_enum') THEN
          CREATE TYPE "expense_category_enum" AS ENUM (
            'FUEL',
            'TOLL',
            'MAINTENANCE',
            'REPAIR',
            'PARKING',
            'INSURANCE',
            'LEASING',
            'PERMITS',
            'OFFICE',
            'SOFTWARE',
            'SALARY',
            'PER_DIEM',
            'OTHER'
          );
        END IF;
      END
      $$;
    `);

    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'expense_type_enum') THEN
          CREATE TYPE "expense_type_enum" AS ENUM ('FIXED', 'VARIABLE', 'TRIP_LINKED');
        END IF;
      END
      $$;
    `);

    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'expense_currency_enum') THEN
          CREATE TYPE "expense_currency_enum" AS ENUM ('EUR', 'PLN', 'CZK', 'GBP', 'CHF', 'USD');
        END IF;
      END
      $$;
    `);

    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'driver_pay_currency_enum') THEN
          CREATE TYPE "driver_pay_currency_enum" AS ENUM ('EUR', 'PLN', 'CZK', 'GBP', 'CHF', 'USD');
        END IF;
      END
      $$;
    `);

    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'driver_pay_status_enum') THEN
          CREATE TYPE "driver_pay_status_enum" AS ENUM ('PENDING', 'PAID');
        END IF;
      END
      $$;
    `);

    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'driver_salary_currency_enum') THEN
          CREATE TYPE "driver_salary_currency_enum" AS ENUM ('EUR', 'PLN', 'CZK', 'GBP', 'CHF', 'USD');
        END IF;
      END
      $$;
    `);

    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'van_cost_currency_enum') THEN
          CREATE TYPE "van_cost_currency_enum" AS ENUM ('EUR', 'PLN', 'CZK', 'GBP', 'CHF', 'USD');
        END IF;
      END
      $$;
    `);

    await queryRunner.query(
      `ALTER TABLE "drivers" ADD COLUMN IF NOT EXISTS "monthly_salary" numeric(10,2)`,
    );
    await queryRunner.query(
      `ALTER TABLE "drivers" ADD COLUMN IF NOT EXISTS "salary_currency" "driver_salary_currency_enum"`,
    );

    await queryRunner.query(
      `ALTER TABLE "vans" ADD COLUMN IF NOT EXISTS "monthly_leasing_cost" numeric(10,2)`,
    );
    await queryRunner.query(
      `ALTER TABLE "vans" ADD COLUMN IF NOT EXISTS "monthly_insurance_cost" numeric(10,2)`,
    );
    await queryRunner.query(
      `ALTER TABLE "vans" ADD COLUMN IF NOT EXISTS "cost_currency" "van_cost_currency_enum"`,
    );

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "expenses" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "created_by" uuid,
        "updated_by" uuid,
        "version" integer NOT NULL DEFAULT 1,
        "category" "expense_category_enum" NOT NULL,
        "expense_type" "expense_type_enum" NOT NULL DEFAULT 'VARIABLE',
        "amount" numeric(12,2) NOT NULL,
        "currency" "expense_currency_enum" NOT NULL DEFAULT 'EUR',
        "vat_rate" numeric(5,2),
        "vat_amount" numeric(12,2),
        "total_with_vat" numeric(12,2),
        "expense_date" date NOT NULL,
        "description" character varying(500),
        "receipt_url" character varying(1000),
        "is_recurring" boolean NOT NULL DEFAULT false,
        "recurring_label" character varying(200),
        "vendor" character varying(200),
        "reference_number" character varying(100),
        "notes" text,
        "van_id" uuid,
        "driver_id" uuid,
        "load_id" uuid,
        CONSTRAINT "PK_expenses_id" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "driver_pay_records" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "created_by" uuid,
        "updated_by" uuid,
        "version" integer NOT NULL DEFAULT 1,
        "driver_id" uuid NOT NULL,
        "year" integer NOT NULL,
        "month" integer NOT NULL,
        "base_salary" numeric(10,2) NOT NULL,
        "per_diem_total" numeric(10,2),
        "bonus" numeric(10,2),
        "deductions" numeric(10,2),
        "total_pay" numeric(10,2) NOT NULL,
        "currency" "driver_pay_currency_enum" NOT NULL DEFAULT 'EUR',
        "status" "driver_pay_status_enum" NOT NULL DEFAULT 'PENDING',
        "paid_date" date,
        "notes" text,
        CONSTRAINT "PK_driver_pay_records_id" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_expense_van" ON "expenses" ("van_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_expense_driver" ON "expenses" ("driver_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_expense_load" ON "expenses" ("load_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_expense_category" ON "expenses" ("category")`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_expense_type" ON "expenses" ("expense_type")`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_expense_date" ON "expenses" ("expense_date")`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_expense_recurring" ON "expenses" ("is_recurring")`,
    );

    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_driver_pay_driver" ON "driver_pay_records" ("driver_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_driver_pay_period" ON "driver_pay_records" ("year", "month")`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_driver_pay_status" ON "driver_pay_records" ("status")`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX IF NOT EXISTS "UQ_driver_pay_driver_period" ON "driver_pay_records" ("driver_id", "year", "month")`,
    );

    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'FK_expenses_van') THEN
          ALTER TABLE "expenses"
          ADD CONSTRAINT "FK_expenses_van"
          FOREIGN KEY ("van_id") REFERENCES "vans"("id")
          ON DELETE SET NULL ON UPDATE NO ACTION;
        END IF;
      END
      $$;
    `);

    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'FK_expenses_driver') THEN
          ALTER TABLE "expenses"
          ADD CONSTRAINT "FK_expenses_driver"
          FOREIGN KEY ("driver_id") REFERENCES "drivers"("id")
          ON DELETE SET NULL ON UPDATE NO ACTION;
        END IF;
      END
      $$;
    `);

    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'FK_expenses_load') THEN
          ALTER TABLE "expenses"
          ADD CONSTRAINT "FK_expenses_load"
          FOREIGN KEY ("load_id") REFERENCES "loads"("id")
          ON DELETE SET NULL ON UPDATE NO ACTION;
        END IF;
      END
      $$;
    `);

    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'FK_driver_pay_driver') THEN
          ALTER TABLE "driver_pay_records"
          ADD CONSTRAINT "FK_driver_pay_driver"
          FOREIGN KEY ("driver_id") REFERENCES "drivers"("id")
          ON DELETE RESTRICT ON UPDATE NO ACTION;
        END IF;
      END
      $$;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "driver_pay_records" DROP CONSTRAINT IF EXISTS "FK_driver_pay_driver"`,
    );
    await queryRunner.query(
      `ALTER TABLE "expenses" DROP CONSTRAINT IF EXISTS "FK_expenses_load"`,
    );
    await queryRunner.query(
      `ALTER TABLE "expenses" DROP CONSTRAINT IF EXISTS "FK_expenses_driver"`,
    );
    await queryRunner.query(
      `ALTER TABLE "expenses" DROP CONSTRAINT IF EXISTS "FK_expenses_van"`,
    );

    await queryRunner.query(
      `DROP INDEX IF EXISTS "UQ_driver_pay_driver_period"`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "IDX_driver_pay_status"`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "IDX_driver_pay_period"`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "IDX_driver_pay_driver"`,
    );

    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_expense_recurring"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_expense_date"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_expense_type"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_expense_category"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_expense_load"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_expense_driver"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_expense_van"`);

    await queryRunner.query(`DROP TABLE IF EXISTS "driver_pay_records"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "expenses"`);

    await queryRunner.query(
      `ALTER TABLE "vans" DROP COLUMN IF EXISTS "cost_currency"`,
    );
    await queryRunner.query(
      `ALTER TABLE "vans" DROP COLUMN IF EXISTS "monthly_insurance_cost"`,
    );
    await queryRunner.query(
      `ALTER TABLE "vans" DROP COLUMN IF EXISTS "monthly_leasing_cost"`,
    );

    await queryRunner.query(
      `ALTER TABLE "drivers" DROP COLUMN IF EXISTS "salary_currency"`,
    );
    await queryRunner.query(
      `ALTER TABLE "drivers" DROP COLUMN IF EXISTS "monthly_salary"`,
    );

    await queryRunner.query(`DROP TYPE IF EXISTS "van_cost_currency_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "driver_salary_currency_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "driver_pay_status_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "driver_pay_currency_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "expense_currency_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "expense_type_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "expense_category_enum"`);
  }
}
