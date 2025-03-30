import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CourseController } from './course.controller';
import { CoursesService } from './courses.service';

@Module({
    imports: [PrismaModule, AuthModule],
    controllers: [CourseController],
    providers: [CoursesService],
    
})
export class CoursesModule {}
