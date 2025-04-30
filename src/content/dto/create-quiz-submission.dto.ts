import { IsObject } from "class-validator";

export class CreateQuizSubmissionDto {
    @IsObject()
    answers: any
}