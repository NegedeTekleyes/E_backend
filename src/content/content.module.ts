import { Module } from "@nestjs/common";
import { AuthModule } from "src/auth/auth.module";
import { ContentController } from "./content.controller";
import { ContentService } from "./content.service";
import { PrismaService } from "src/prisma/prisma.service";


@Module({
    imports: [AuthModule],
    controllers: [ContentController],
    providers: [ContentService, PrismaService],
})
export class ContentModule {}