import { Controller, Post, Body, Get, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import {CoursesService} from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
@Controller('courses')
export class CourseController {
    constructor(private courseService: CoursesService) { }
    
    @Post()
    @UseGuards(JwtAuthGuard)
    crateCourse(@Body() dto:CreateCourseDto, @Request()req) {
        return this.courseService.createCourse(dto, req.user.sub);
    }

    @Get()
    getCourse() {
        return this.courseService.getCourses();
    }
}