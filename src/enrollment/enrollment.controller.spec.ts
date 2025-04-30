import { Test, TestingModule } from '@nestjs/testing';
import { EnrollmentController } from './enrollment.controller';


// mock the service
const mockEnrollmentService ={
  createEnrollment: jest.fn(),
  updateEnrollmentProgress:jest.fn(),
  getStudentEnrollments: jest.fn(),
}
describe('EnrollmentController', () => {
  let controller: EnrollmentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EnrollmentController],
      providers: [
        {
          provide: EnrollmentService,
          useValue: mockEnrollmentService,
        },
      ],
    })
    .overrideGuard(JwtAuthGuard)
    .useValue({canActivate: ()=> true})
    .compile();

    controller = module.get<EnrollmentController>(EnrollmentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createEnrollment', () => {
    it('should create an enrollment', async () => {
      const mockReq = {user: {id:1, role: UserRole.STUDENT}}
      const mockResult = {id: 1, courseId 1, studentId: 1}
      mockEnrollmentService.createEnrollment.mockResolvedValue(mockResult)

      const result = await controller.createEnrollment(1, mockReq)
      expect(result).toEqual(mockResult)
      expect(mockEnrollemntService.createEnrollment).toHaveBeenCalledWith(
        1,1,UserRole.STUDENT,
      )
    })
  })
  describe('updateEnrollment',() => {
    it('should update enrollment progress', async ()=>{
      const mockResult ={id:1,progress: 50}
      mockEnrollemntService.updateEnrollmentProgress.mockResolvedValue(mockResult)

      const result = await controller.updateProgress('1', 50)
      expect(result).toEqual(mockResult)
      expect(mockEnrollmentService.updateEnrollmentProgress).toHaveBeenCalledWith(1,50)
    })
  })
  describe('getMyEnrollments', () => {
    it('should return student enrollments', async () => {
      const mockReq = { user: { id: 1 } };
      const mockResult = [{ id: 1, courseId: 1 }];
      mockEnrollmentService.getStudentEnrollments.mockResolvedValue(mockResult);

      const result = await controller.getMyEnrollments(mockReq);
      expect(result).toEqual(mockResult);
      expect(mockEnrollmentService.getStudentEnrollments).toHaveBeenCalledWith(1);
    });
  });
});
