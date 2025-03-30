import { Injectable,CanActivate,ExecutionContext,UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(private jwtService: JwtService) { }
    
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const token = request.headers.authorization?.replace(' Bearer', '');
        if (!token) {
            throw new UnauthorizedException('You are not authorized');
        }
        try {
            const playload = this.jwtService.verify(token);
            request.user = playload;
            return true;
        }
        catch (error) {
            throw new UnauthorizedException('You are not authorized');
        }
    }
}