export interface Department {
  id: number;
  name: string;
  code: string;
}

export interface DepartmentsResponse {
  success: boolean;
  data: Department[];
}