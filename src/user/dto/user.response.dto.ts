import { UserRole } from '../user.constants';
import { DateTime } from 'luxon';
export class UserResponseDto {
    id: number;
    email: string;
    role: UserRole;
    name ?: string;
    phone ?: string;
    isVerified: boolean;
    createdAt: DateTime;
    updatedAt: DateTime;

}