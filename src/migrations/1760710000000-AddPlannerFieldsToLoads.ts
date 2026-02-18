import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPlannerFieldsToLoads1760710000000 implements MigrationInterface {
  name = 'AddPlannerFieldsToLoads1760710000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "loads" ADD COLUMN IF NOT EXISTS "brokerage_name" character varying(200)`,
    );
    await queryRunner.query(
      `ALTER TABLE "loads" ADD COLUMN IF NOT EXISTS "origin_transeu_link" character varying(500)`,
    );
    await queryRunner.query(
      `ALTER TABLE "loads" ADD COLUMN IF NOT EXISTS "dest_transeu_link" character varying(500)`,
    );
    await queryRunner.query(
      `ALTER TABLE "loads" ADD COLUMN IF NOT EXISTS "is_inactive" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "load_stops" ADD COLUMN IF NOT EXISTS "pallets" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "load_stops" ADD COLUMN IF NOT EXISTS "transeu_link" character varying(500)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "load_stops" DROP COLUMN IF EXISTS "transeu_link"`,
    );
    await queryRunner.query(
      `ALTER TABLE "load_stops" DROP COLUMN IF EXISTS "pallets"`,
    );
    await queryRunner.query(
      `ALTER TABLE "loads" DROP COLUMN IF EXISTS "is_inactive"`,
    );
    await queryRunner.query(
      `ALTER TABLE "loads" DROP COLUMN IF EXISTS "dest_transeu_link"`,
    );
    await queryRunner.query(
      `ALTER TABLE "loads" DROP COLUMN IF EXISTS "origin_transeu_link"`,
    );
    await queryRunner.query(
      `ALTER TABLE "loads" DROP COLUMN IF EXISTS "brokerage_name"`,
    );
  }
}
