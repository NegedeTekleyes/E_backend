import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<any>();
    const authHeader = request.headers['authorization'] || request.headers['Authorization'];
    const token = authHeader?.replace('Bearer ', '').trim();

    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      const payload = this.jwtService.verify(token, { secret: process.env.JWT_SECRET });
      request.user = payload;
      return true;
    } catch (error) {
      console.error('JWT Verification Error:', error.message);
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}