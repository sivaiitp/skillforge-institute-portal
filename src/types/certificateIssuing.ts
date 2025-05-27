
export interface User {
  id: string;
  full_name: string;
  email: string;
  role: string;
}

export interface EnrolledCourse {
  id: string;
  title: string;
  enrollment_date: string;
  has_certificate: boolean;
}
