
import { Injectable,OnModuleInit, OnModuleDestroy,Logger } from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import { PrismaClient } from '@prisma/client'
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy{
    private readonly logger = new Logger(PrismaService.name);

    constructor(configService: ConfigService) {
        // Pass prisma client options  including the database URL from enviroment variables to the PrismaClient constructor
        super({
            datasources: {
                db: {
                    url: configService.get<string>('DATABASE_URL'),
                },
            },
            log: [
                { emit: 'stdout', level: 'query' },  // log queries to console  (optional to remove in production)
                { emit: 'stdout', level: 'info' }, // log info to console
                { emit: 'stdout', level: 'warn' }, // log warnings to console
                { emit: 'stdout', level: 'error' }, // log errors to console
            ],
        });
        console.log('DATABASE_URL', configService.get<string>('DATABASE_URL'));

    }
    // calls the PrismaClient connect method to establish a connection to the database
    async onModuleInit() {
        try {
            await this.$connect();
            this.logger.log('Database connected');
        } catch (error) {
            this.logger.error('Failed to connect to database', error.stack);
            throw new Error(`Failed to connect to database: ${error.message}`);
        }
    }


   
    // called when the application is shutting down
    async onModuleDestroy() {
        try {
            await this.$disconnect();
            this.logger.log('Database disconnected');
        } catch (error) {
            this.logger.error('Failed to disconnect from database', error.stack);
        }
    }

    // Option 1: Method to manually check connection status
    async isConnected(): Promise<boolean> {
        try {
            await this.$queryRaw`SELECT 1`;
            return true;
        
        } catch (error) {
            this.logger.warn('Database connection check failed', error.stack);
            return false;
        }
    }

    // Optional: clear database (useful for testing)
    async clearDatabase() {
        try {
            await this.$transaction([
                this.user.deleteMany(),
                this.course.deleteMany(),
                this.enrollment.deleteMany(),
            ]);
            this.logger.log('Database cleared successfully');
        } catch (error) {
            this.logger.error('Failed to clear database', error.stack);
            throw new error;
        }
        }
}





