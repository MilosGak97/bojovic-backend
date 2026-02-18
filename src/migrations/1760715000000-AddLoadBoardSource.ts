import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddLoadBoardSource1760715000000 implements MigrationInterface {
  name = 'AddLoadBoardSource1760715000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'load_board_source_enum') THEN
          CREATE TYPE "load_board_source_enum" AS ENUM ('TRANS_EU', 'TIMOCOM', 'MANUAL', 'OTHER');
        END IF;
      END
      $$;
    `);

    await queryRunner.query(
      `ALTER TABLE "loads" ADD COLUMN IF NOT EXISTS "board_source" "load_board_source_enum" NOT NULL DEFAULT 'MANUAL'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "loads" DROP COLUMN IF EXISTS "board_source"`,
    );
    await queryRunner.query(`DROP TYPE IF EXISTS "load_board_source_enum"`);
  }
}
