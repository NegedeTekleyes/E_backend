import { Body, Controller, Post } from '@nestjs/common';
import { EnrollmentService } from './enrollment.service';

@Controller('enrollment')
export class EnrollmentController {
    constructor(private readonly enrollmentService: EnrollmentService) { }
   
    @Post()
    async createEnrollment(@Body() body: { courseId: number, userId: number }) {
        return this.enrollmentService.createEnrollment(body.courseId, body.userId);
    }
}
