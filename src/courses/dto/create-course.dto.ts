import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";



export class CreateCourseDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsNumber()
    @IsNotEmpty()
    duration: number; // in minute



    @IsNumber()
    @IsNotEmpty()
    price: number;

    @IsString()
    @IsNotEmpty()
    category: string;

    @IsString()
    @IsNotEmpty()
    language: string;

    @IsBoolean()
    @IsOptional()
    isPublished?: boolean;
}