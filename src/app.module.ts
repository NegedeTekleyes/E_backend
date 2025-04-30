import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { CoursesModule } from './courses/courses.module';
import { PaymentsModule } from './payments/payments.module';
import { PrismaModule } from './prisma/prisma.module';
import { EnrollmentModule } from './enrollment/enrollment.module';
import { ConfigModule } from '@nestjs/config';
import { ContentModule } from './content/content.module';
import { CertificateModule } from './certificate/certificate.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    AuthModule,
    UserModule,
    CoursesModule,
    ContentModule,
    CertificateModule,
    PaymentsModule,
    PrismaModule,
    EnrollmentModule],
  
})
export class AppModule {}
