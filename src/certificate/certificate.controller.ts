import { Controller, Get, Param, ParseIntPipe, Request, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { CertificateService } from "./certificate.service";



@Controller('certificates')
@UseGuards(JwtAuthGuard)
export class CertificateController {
    constructor(private readonly certificateService: CertificateService) { }
    
    @Get()
    async getUserCertificate(@Request() req: any) {
        return this.certificateService.getUserCertificate(req.user.id);
    }

    @Get(':id')
    async getCertificate(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
        return this.certificateService.getCertificate(id, req.user.id)
    }
}