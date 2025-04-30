import { Module } from "@nestjs/common";
import { CertificateController } from "./certificate.controller";
import { CertificateService } from "./certificate.service";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthModule } from "src/auth/auth.module";


@Module({
    imports: [AuthModule],
    controllers: [CertificateController],
    providers: [CertificateService, PrismaService],
})
export class CertificateModule {}