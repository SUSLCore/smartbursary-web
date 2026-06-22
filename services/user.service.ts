import axiosInstance from "@/lib/axios";

export interface UserFaculty {
  id: number;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserDepartment {
  id: number;
  facultyId?: number;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserProfile {
  id: number;
  registerId: string;
  name: string;
  email: string;
  role: string;
  phone: string;
  isActive: boolean;
  mustChangePassword: boolean;
  facultyId?: number;
  departmentId?: number;
  createdAt?: string;
  updatedAt?: string;
  Faculty?: UserFaculty;
  Department?: UserDepartment;
  isEligible: boolean;
  eligibilityRecords: unknown[];
}

export interface UserProfileResponse {
  success: boolean;
  data: UserProfile;
}

export const userService = {
  async getProfile() {
    const response = await axiosInstance.get<UserProfileResponse>(
      "/api/users/profile"
    );

    return response.data;
  },
};

export default userService;
