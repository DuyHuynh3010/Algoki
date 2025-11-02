export interface IntructorResponsive {
  data: {
    auditInfo: {
      createdAt: string;
      deletedAt: string;
      updatedAt: string;
    };
    bio: string;
    cvUrl: string;
    expertise: string;
    isVerified: boolean;
    ratingAverage: string;
    totalReviews: string;
    userId: string;
  };
}
interface AuditInfo {
  _createdAt: string;
  _updatedAt: string;
  _deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface LearnerProfile {
  data: {
    id: string;
    userId: string;
    bio: string | null;
    dateOfBirth: string | null;
    educationLevel: string | null;
    interests: string | null;
    gender: "male" | "female" | "other"; // assuming possible values
    totalCoursesEnrolled: number;
    totalCoursesInProgress: number;
    totalCoursesCompleted: number;
    auditInfo: AuditInfo;
    phoneNumber: string;
    skill: string
  };
}

export interface InstructorProfile {
  data: {
    id: string
    userId: string
    bio: string
    cvUrl: string
    expertise: string
    ratingAverage: string
    totalReviews: number
    totalStudents: number
    totalCourses: number
    isVerified: boolean
    auditInfo: AuditInfoInstructor
    totalMoney: number
    totalPrices: number
    phoneNumber: string
    skill: string
  }
}

export interface AuditInfoInstructor {
  createdAt: string
  updatedAt: string
  deletedAt: any
}

