import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";


@Injectable()
export class CertificateService {
    constructor(private prisma: PrismaService) { }
    

    async getUserCertificate(userId: number) {
        return this.prisma.certificate.findMany({
            where: { studentId: userId },
            include: { course: true },
        })
    }

    async getCertificate(certificateId: number, userId: number) {
        const certificate = await this.prisma.certificate.findUnique({
            where: { id: certificateId },
            include: { course: true },
        })
    
        if (!certificate) {
            throw new NotFoundException('Certificate not found')
        }
        if (certificate.studentId !== userId) {
            throw new ForbiddenException('You do not have access to this certificate')
        }
        return certificate;
    }
}
