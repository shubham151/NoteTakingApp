import { MigrationInterface, QueryRunner } from "typeorm";

export class MyNewMigration1755371281663 implements MigrationInterface {
    name = 'MyNewMigration1755371281663'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "username" character varying NOT NULL, "email" character varying NOT NULL, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "password" character varying NOT NULL, CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "note_details" ("id" SERIAL NOT NULL, "content" text NOT NULL, "headerId" integer, CONSTRAINT "PK_8f2a8029fd70e9f3b79dbb1d228" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "note_header" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "owner" character varying NOT NULL, "sharedWith" text array NOT NULL DEFAULT '{}', CONSTRAINT "PK_b5ed3c485950ddf39ec52ffb354" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "note_details" ADD CONSTRAINT "FK_b9cdf9c6d5b126b7c309719eb56" FOREIGN KEY ("headerId") REFERENCES "note_header"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "note_details" DROP CONSTRAINT "FK_b9cdf9c6d5b126b7c309719eb56"`);
        await queryRunner.query(`DROP TABLE "note_header"`);
        await queryRunner.query(`DROP TABLE "note_details"`);
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
