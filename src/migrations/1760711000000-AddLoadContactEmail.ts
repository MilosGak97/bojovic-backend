import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddLoadContactEmail1760711000000 implements MigrationInterface {
  name = 'AddLoadContactEmail1760711000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "loads" ADD COLUMN IF NOT EXISTS "contact_email" character varying(255)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "loads" DROP COLUMN IF EXISTS "contact_email"`,
    );
  }
}
