import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';


@Injectable()
export class EmailService {
    private transporter: nodemailer.Transporter;
    constructor(private configService: ConfigService) {
        
        
    // intialize Nodemailer transporter with environment variables
       
        const emailUser = this.configService.get<string>('EMAIL_USER');
        const emailPassword = this.configService.get<string>('EMAIL_PASSWORD');

        if (!emailUser || !emailPassword) {
            throw new Error('Email credentials (EMAIL_USER and EMAIL_PASSWORD) must be set in .env');
        }
        this.transporter = nodemailer.createTransport({
            host: this.configService.get<string>('EMAIL_HOST', 'smtp.gmail.com'),
            port: this.configService.get<number>('EMAIL_PORT', 587),
            secure: false,
            auth: {
               user: emailUser,
                pass: emailPassword,
            },
        });
    }

    // send verification email
    async sendVerificationEmail(email: string, token: string, language: string) {
        const verificationUrl = `${this.configService.get<string>('BASE_URL', 'http://localhost:3000')}auth/verify?token=${token}`;
        
        // multi-language email templates
        const templates = {
            en: {
                subject: 'Verify your email',
                html: `
                <h2>Welcome to the E-Learning Platform!</h2>
                    <p>Please verify your email by clicking  the link below:</p>
                    <a href="${verificationUrl}">Verify email</a>
                    <p>If you didn't register on our platform, please ignore this email.</p>
                `,
            },
            am: {
                subject: 'ኢ-ሜልዎን ያረጋግጡ',
                html: `
          <h2>ወደ ኢ-ማማር መድረክ እንኳን ደህና መጡ!</h2>
          <p>ኢ-ሜልዎን ለማረጋገጥ እባክዎ ከዚህ በታች ያለውን አገናኝ ይጫኑ፡</p>
          <a href="${verificationUrl}">ኢሜል አረጋግጥ</a>
          <p>እርስዎ ካልተመዘገቡ፣ ይህን ኢሜል ችላ ይበሉ።</p>
        `,
            },
        };
        const template = templates[language] || templates.en;  // default to English

        try {
            await this.transporter.sendMail({
                from: `"E-Learning Platform" <${this.configService.get<string>('EMAIL_USER')}>`,
                to: email,
                subject: template.subject,
                html: template.html,
            });
            console.log(`Verification email sent to ${email}`);
            return {success: true, message: 'Verification email sent successfully' };
        } catch (error) {
            console.error(`Failed to send verification email to ${email}: ${error.message}`);
            return { success: false, message: 'Failed to send verification email' };
        }
    }

    // generic email for sending other email (e.g notifications)
    async sendEmail(email: string, subject: string, html: string) {
        try {
            await this.transporter.sendMail({
                from: `"E-Learning Platform" <${this.configService.get<string>('EMAIL_USER')}>`,
                to: email,
                subject,
                html,
            });
            console.log(`Email sent to ${email}`);
            return {success: true, message: 'Email sent successfully' };
        } catch (error) {
            console.error(`Failed to send email to ${email}: ${error.message}`);
            return { success: false, message: 'Failed to send email' };
        }
            
    }   

    }