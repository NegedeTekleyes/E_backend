import { Module } from '@nestjs/common';
import { EnrollmentController } from './enrollment.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { EnrollmentService } from './enrollment.service';
@Module({
  imports: [PrismaModule],
  controllers: [EnrollmentController],
  providers: [EnrollmentService],
})
export class EnrollmentModule {}
