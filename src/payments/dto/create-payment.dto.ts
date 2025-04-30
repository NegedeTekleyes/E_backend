import { IsInt, IsNumber, isString, IsString } from "class-validator";


export class createPaymentDto{
    @IsInt()
    enrollmentId: number;

    @IsNumber()
    amount: number

    @IsString()
    method: string;
}