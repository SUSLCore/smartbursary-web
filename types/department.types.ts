export interface Department {
  id: number;
  name: string;
  code?: string;
  facultyId?: number;
  Faculty?: {
    id: number;
    name: string;
  };
}

export interface DepartmentsResponse {
  success: boolean;
  data: Department[];
}
