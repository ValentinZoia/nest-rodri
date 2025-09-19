import { MigrationInterface, QueryRunner } from "typeorm";

export class InitUsers1758245304033 implements MigrationInterface {
    name = 'InitUsers1758245304033'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."tasks_task_status_enum" AS ENUM('CREATED', 'IN_PROGRESS', 'FINISH')`);
        await queryRunner.query(`CREATE TABLE "tasks" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "task_name" character varying NOT NULL, "task_description" character varying NOT NULL, "task_status" "public"."tasks_task_status_enum" NOT NULL, "responsable_name" character varying NOT NULL, "project_id" uuid, CONSTRAINT "PK_8d12ff38fcc62aaba2cab748772" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TYPE "public"."users_projects_access_level_enum" RENAME TO "users_projects_access_level_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."users_projects_access_level_enum" AS ENUM('30', '40', '50')`);
        await queryRunner.query(`ALTER TABLE "users_projects" ALTER COLUMN "access_level" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "users_projects" ALTER COLUMN "access_level" TYPE "public"."users_projects_access_level_enum" USING "access_level"::"text"::"public"."users_projects_access_level_enum"`);
        await queryRunner.query(`ALTER TABLE "users_projects" ALTER COLUMN "access_level" SET DEFAULT '40'`);
        await queryRunner.query(`DROP TYPE "public"."users_projects_access_level_enum_old"`);
        await queryRunner.query(`ALTER TABLE "tasks" ADD CONSTRAINT "FK_9eecdb5b1ed8c7c2a1b392c28d4" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tasks" DROP CONSTRAINT "FK_9eecdb5b1ed8c7c2a1b392c28d4"`);
        await queryRunner.query(`CREATE TYPE "public"."users_projects_access_level_enum_old" AS ENUM('40', '50')`);
        await queryRunner.query(`ALTER TABLE "users_projects" ALTER COLUMN "access_level" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "users_projects" ALTER COLUMN "access_level" TYPE "public"."users_projects_access_level_enum_old" USING "access_level"::"text"::"public"."users_projects_access_level_enum_old"`);
        await queryRunner.query(`ALTER TABLE "users_projects" ALTER COLUMN "access_level" SET DEFAULT '40'`);
        await queryRunner.query(`DROP TYPE "public"."users_projects_access_level_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."users_projects_access_level_enum_old" RENAME TO "users_projects_access_level_enum"`);
        await queryRunner.query(`DROP TABLE "tasks"`);
        await queryRunner.query(`DROP TYPE "public"."tasks_task_status_enum"`);
    }

}
