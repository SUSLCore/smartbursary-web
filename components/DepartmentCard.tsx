import { Department } from "@/types/department.types";

interface Props {
  department: Department;
  onClick: () => void;
}

export default function DepartmentCard({
  department,
  onClick,
}: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="
        w-full
        rounded-xl
        border
        p-5
        text-left
        hover:bg-gray-50
        transition
      "
    >
      <h3 className="font-semibold text-lg">
        {department.name}
      </h3>

      <p className="text-sm text-gray-500">
        {department.code}
      </p>
    </button>
  );
}
