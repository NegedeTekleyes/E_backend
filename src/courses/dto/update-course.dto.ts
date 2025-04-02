import { IsBoolean, IsNumber, IsOptional, IsString } from "class-validator";

  


export class UpdateCourseDto{
    @IsString()
    @IsOptional()
    title?: string;


    @IsString()
    @IsOptional()
    description?: string;
    
    @IsNumber()
  @IsOptional()
  price?: number;

  @IsNumber()
  @IsOptional()
  duration?: number;

  @IsString()
  @IsOptional()
  category?: string;

  @IsString()
  @IsOptional()
  language?: string;

  @IsBoolean()
  @IsOptional()
  isPublished?: boolean;




  }