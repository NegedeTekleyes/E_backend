// src/course/course.controller.ts
import { Controller, Get, Post, Patch, Delete, Body, Param, Request, UseGuards, ParseIntPipe } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { CreateTranslationDto } from './dto/create-translation.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('courses')
export class CourseController {
  constructor(private readonly courseService: CoursesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createCourseDto: CreateCourseDto, @Request() req: Request & { user: { sub: number; role: string } }) {
    return this.courseService.createCourse(createCourseDto, req.user.sub, req.user.role);
  }

  @Get()
  findAll(@Request() req?: Request & { user?: { sub: number; role: string } }) {
    return this.courseService.getAllCourses(req?.user);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.courseService.getCourseById(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCourseDto: UpdateCourseDto,
    @Request() req: Request & { user: { sub: number; role: string } },
  ) {
    return this.courseService.updateCourse(id, updateCourseDto, req.user.sub, req.user.role);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id', ParseIntPipe) id: number, @Request() req: Request & { user: { sub: number; role: string } }) {
    return this.courseService.deleteCourse(id, req.user.sub, req.user.role);
  }

  @Post(':id/translations')
  @UseGuards(JwtAuthGuard)
  addTranslation(
    @Param('id', ParseIntPipe) id: number,
    @Body() createTranslationDto: CreateTranslationDto,
    @Request() req: Request & { user: { sub: number; role: string } },
  ) {
    return this.courseService.addCourseTranslation(id, createTranslationDto, req.user.sub, req.user.role);
  }
}