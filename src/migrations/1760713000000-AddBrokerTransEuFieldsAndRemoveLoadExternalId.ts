import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddBrokerTransEuFieldsAndRemoveLoadExternalId1760713000000
  implements MigrationInterface
{
  name = 'AddBrokerTransEuFieldsAndRemoveLoadExternalId1760713000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "broker_companies" ADD COLUMN IF NOT EXISTS "trans_eu_paid_on_time" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "broker_companies" ADD COLUMN IF NOT EXISTS "trans_eu_paid_with_delay" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "broker_companies" ADD COLUMN IF NOT EXISTS "trans_eu_payment_issues" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "broker_companies" ADD COLUMN IF NOT EXISTS "trans_eu_rating" character varying(20)`,
    );
    await queryRunner.query(
      `ALTER TABLE "broker_companies" ADD COLUMN IF NOT EXISTS "trans_eu_review_count" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "loads" DROP COLUMN IF EXISTS "external_id"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "loads" ADD COLUMN IF NOT EXISTS "external_id" character varying(100)`,
    );
    await queryRunner.query(
      `ALTER TABLE "broker_companies" DROP COLUMN IF EXISTS "trans_eu_review_count"`,
    );
    await queryRunner.query(
      `ALTER TABLE "broker_companies" DROP COLUMN IF EXISTS "trans_eu_rating"`,
    );
    await queryRunner.query(
      `ALTER TABLE "broker_companies" DROP COLUMN IF EXISTS "trans_eu_payment_issues"`,
    );
    await queryRunner.query(
      `ALTER TABLE "broker_companies" DROP COLUMN IF EXISTS "trans_eu_paid_with_delay"`,
    );
    await queryRunner.query(
      `ALTER TABLE "broker_companies" DROP COLUMN IF EXISTS "trans_eu_paid_on_time"`,
    );
  }
}

