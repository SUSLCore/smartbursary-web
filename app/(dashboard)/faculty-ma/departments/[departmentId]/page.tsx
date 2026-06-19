import { redirect } from "next/navigation";

export default async function DepartmentRedirect({
  params,
}: {
  params: Promise<{ departmentId: string }>;
}) {
  const { departmentId } = await params;

  redirect(`/faculty-ma/upload-bursary-list/departments/${departmentId}`);
}
