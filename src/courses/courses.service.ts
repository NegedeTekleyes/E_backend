// src/course/course.service.ts
import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { CreateTranslationDto } from './dto/create-translation.dto';
@Injectable()
export class CoursesService {
  constructor(private prisma: PrismaService) {}

  async createCourse(dto: CreateCourseDto, userId: number, userRole: string) {
    if (userRole !== 'INSTRUCTOR' && userRole !== 'ADMIN') {
      throw new ForbiddenException('Only instructors or admins can create courses');
    }

    const course = await this.prisma.course.create({
      data: {
        title: dto.title,
        description: dto.description,
        price: dto.price,
        duration: dto.duration,
        category: dto.category,
        language: dto.language,
        instructorId: userId,
        isPublished: dto.isPublished || false,
      },
    });
    return this.mapCourseToResponse(course);
  }

  async getAllCourses(user?: { sub: number; role: string }) {
    const courses = await this.prisma.course.findMany({
      where: user?.role === 'ADMIN' ? {} : { isPublished: true }, // Admins see all, others only published
      include: {
        instructor: { select: { id: true, name: true } },
        translations: true,
      },
    });
    return courses.map(this.mapCourseToResponse);
  }

  async getCourseById(id: number) {
    const course = await this.prisma.course.findUnique({
      where: { id },
      include: {
        instructor: { select: { id: true, name: true } },
        translations: true,
        enrollments: { select: { studentId: true, progress: true } },
      },
    });
    if (!course) {
      throw new NotFoundException('Courses not found');
    }
    return this.mapCourseToResponse(course);
  }

  async updateCourse(id: number, dto: UpdateCourseDto, userId: number, userRole: string) {
    const course = await this.prisma.course.findUnique({ where: { id } });
    if (!course) {
      throw new NotFoundException('Courses not found');
    }
    if (course.instructorId !== userId && userRole !== 'ADMIN') {
      throw new ForbiddenException('Only the course instructor or admin can update this course');
    }

    const updatedCourse = await this.prisma.course.update({
      where: { id },
      data: dto,
    });
    return this.mapCourseToResponse(updatedCourse);
  }

  async deleteCourse(id: number, userId: number, userRole: string) {
    const course = await this.prisma.course.findUnique({ where: { id } });
    if (!course) {
      throw new NotFoundException('Course not found');
    }
    if (course.instructorId !== userId && userRole !== 'ADMIN') {
      throw new ForbiddenException('Only the course instructor or admin can delete this course');
    }

    await this.prisma.course.delete({ where: { id } });
    return { message: 'Course deleted successfully' };
  }

  async addCourseTranslation(id: number, dto: CreateTranslationDto, userId: number, userRole: string) {
    const course = await this.prisma.course.findUnique({ where: { id } });
    if (!course) {
      throw new NotFoundException('Course not found');
    }
    if (course.instructorId !== userId && userRole !== 'ADMIN') {
      throw new ForbiddenException('Only the course instructor or admin can add translations');
    }

    const translation = await this.prisma.courseTranslation.create({
      data: {
        courseId: id,
        language: dto.language,
        title: dto.title,
        description: dto.description,
        price: dto.price,
        duration: dto.duration,
        category: dto.category,
      },
    });
    return translation;
  }

  private mapCourseToResponse(course: any) {
    return {
      id: course.id,
      title: course.title,
      description: course.description,
      price: course.price,
      duration: course.duration,
      category: course.category,
      language: course.language,
      isPublished: course.isPublished,
      instructor: course.instructor,
      translations: course.translations || [],
      enrollments: course.enrollments || [],
      createdAt: course.createdAt,
      updatedAt: course.updatedAt,
    };
  }
}