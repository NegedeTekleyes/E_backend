import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function seed() {
    try {
        // create  student user
        const student = await prisma.user.create({
            data: {
                email: 'Student@gmail.com',
                password: 'pass123',
                name : 'Student',
                role: 'STUDENT',
            }
        })
        console.log('Created student user:', student)
        // create  instructor user
        const instructor = await prisma.user.create({
            data: {
                email: 'instructor@gmail.com',
                password: 'pass123',
                name: 'Instructor',
                role: 'INSTRUCTOR',
            }
        })
        console.log('Created instructor user:', instructor)
        // create course
        const course = await prisma.course.create({
            data: {
                title: 'Advanced Programming',
                description: 'Learn Advanced Programming course',
                price: 150,
                duration: 30,
                category: 'Programming',
                language: 'English',
                instructorId: instructor.id,
                isPublished: true,
            }
        })
        console.log('Created course:', course)
        // create enrollment
        const enrollment = await prisma.enrollment.create({
            data: {
                studentId: student.id,
                courseId: course.id,
                progress: 0,
                status: 'PENDING',
                enrolledAt: new Date(),
            }
        })

        console.log('Created enrollment:', enrollment)
        // create payment
        const payment = await prisma.payment.create({
            data: {
                userId: student.id,
                enrollmentId: enrollment.id,
                amount: course.price,
                method: 'card',
                transactionId: `TXN-${Date.now()}`,
                status: 'COMPLETED',
                createdAt: new Date(),
            }
        })
        console.log('Created payment:', payment)
    } catch (error) {
        console.error('Error seeding data:', error)

        
    }
    finally {
        await prisma.$disconnect()
    }
    
}
seed()