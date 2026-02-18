import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddLoadPricingChecks1760714000000 implements MigrationInterface {
  name = 'AddLoadPricingChecks1760714000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "loads" ADD COLUMN IF NOT EXISTS "invoitix" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "loads" ADD COLUMN IF NOT EXISTS "valuta_check" boolean NOT NULL DEFAULT false`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "loads" DROP COLUMN IF EXISTS "valuta_check"`,
    );
    await queryRunner.query(
      `ALTER TABLE "loads" DROP COLUMN IF EXISTS "invoitix"`,
    );
  }
}
