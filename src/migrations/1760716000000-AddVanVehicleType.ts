import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddVanVehicleType1760716000000 implements MigrationInterface {
  name = 'AddVanVehicleType1760716000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'van_type_enum') THEN
          CREATE TYPE "van_type_enum" AS ENUM ('VAN_3_5T', 'TRUCK_7T', 'CARGO_VAN');
        END IF;
      END
      $$;
    `);

    await queryRunner.query(
      `ALTER TABLE "vans" ADD COLUMN IF NOT EXISTS "vehicle_type" "van_type_enum" NOT NULL DEFAULT 'CARGO_VAN'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "vans" DROP COLUMN IF EXISTS "vehicle_type"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "van_type_enum"`);
  }
}
