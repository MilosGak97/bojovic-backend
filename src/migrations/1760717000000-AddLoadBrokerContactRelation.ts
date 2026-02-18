import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddLoadBrokerContactRelation1760717000000 implements MigrationInterface {
  name = 'AddLoadBrokerContactRelation1760717000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "loads" ADD COLUMN IF NOT EXISTS "trans_eu_freight_number" character varying(100)`,
    );

    await queryRunner.query(
      `ALTER TABLE "loads" ADD COLUMN IF NOT EXISTS "broker_contact_id" uuid`,
    );

    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_load_broker_contact" ON "loads" ("broker_contact_id")`,
    );

    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1
          FROM pg_constraint
          WHERE conname = 'FK_loads_broker_contact'
        ) THEN
          ALTER TABLE "loads"
          ADD CONSTRAINT "FK_loads_broker_contact"
          FOREIGN KEY ("broker_contact_id")
          REFERENCES "broker_contacts"("id")
          ON DELETE SET NULL
          ON UPDATE NO ACTION;
        END IF;
      END
      $$;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "loads" DROP CONSTRAINT IF EXISTS "FK_loads_broker_contact"`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "IDX_load_broker_contact"`,
    );
    await queryRunner.query(
      `ALTER TABLE "loads" DROP COLUMN IF EXISTS "broker_contact_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "loads" DROP COLUMN IF EXISTS "trans_eu_freight_number"`,
    );
  }
}
