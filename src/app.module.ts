import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { CoursesModule } from './courses/courses.module';
import { VideosModule } from './videos/videos.module';
import { NotesModule } from './notes/notes.module';
import { QuizzesModule } from './quizzes/quizzes.module';
import { PaymentsModule } from './payments/payments.module';
import { PrismaModule } from './prisma/prisma.module';
import { EnrollmentModule } from './enrollment/enrollment.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    AuthModule,
    UserModule,
    CoursesModule,
    VideosModule,
    NotesModule,
    QuizzesModule,
    PaymentsModule,
    PrismaModule,
    EnrollmentModule],
  
})
export class AppModule {}
