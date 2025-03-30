import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCourseDto } from './dto/create-course.dto';
@Injectable()
export class CoursesService {
  constructor(private prisma: PrismaService) {}

    async createCourse(dto: CreateCourseDto, userId: number) {
        // check if user is an instructor
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId
            }
        });
        if (!user || user.role !== 'INSTRUCTOR') {
            throw new ForbiddenException('You are not allowed to create a course');
        }
    return this.prisma.course.create({
     data: {
        title: dto.title,
        description: dto.description,
        price: dto.price,
        duration: dto.duration,
        category: dto.category,
        language: dto.language,
        instructorId: userId,
      },
    });
  }

  async getCourses() {
    return this.prisma.course.findMany({ include: { instructor: true } });
  }
}