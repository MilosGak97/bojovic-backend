import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddLoadPlannerVan1760718000000 implements MigrationInterface {
  name = 'AddLoadPlannerVan1760718000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "loads" ADD COLUMN IF NOT EXISTS "planner_van_id" uuid`,
    );

    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_load_planner_van" ON "loads" ("planner_van_id")`,
    );

    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1
          FROM pg_constraint
          WHERE conname = 'FK_loads_planner_van'
        ) THEN
          ALTER TABLE "loads"
          ADD CONSTRAINT "FK_loads_planner_van"
          FOREIGN KEY ("planner_van_id")
          REFERENCES "vans"("id")
          ON DELETE SET NULL
          ON UPDATE NO ACTION;
        END IF;
      END
      $$;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "loads" DROP CONSTRAINT IF EXISTS "FK_loads_planner_van"`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "IDX_load_planner_van"`,
    );
    await queryRunner.query(
      `ALTER TABLE "loads" DROP COLUMN IF EXISTS "planner_van_id"`,
    );
  }
}
