"use client";

import { useState, useEffect } from "react";

type Task = {
  title: string;
  completed: boolean;
};

type Employee = {
  id: number;
  fullName: string;
  email: string;
  role: string;
  startDate: string;
  checklist: Task[];
};

const defaultChecklist: Task[] = [
  { title: "Sign NDA", completed: false },
  { title: "Submit ID card", completed: false },
  { title: "Set up email", completed: false },
  { title: "Complete HR orientation", completed: false },
  { title: "Access company tools (Slack, GitHub)", completed: false },
  { title: "Book intro meeting with manager", completed: false },
];

const AddEmployeeForm = () => {
  const [employeeInput, setEmployeeInput] = useState({
    fullName: "",
    email: "",
    role: "",
    startDate: "",
  });

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "All" | "Not Started" | "In Progress" | "Completed"
  >("All");

  // Load from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("employees");
    if (stored) setEmployees(JSON.parse(stored));
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("employees", JSON.stringify(employees));
  }, [employees]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEmployeeInput((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { fullName, email, role, startDate } = employeeInput;
    if (!fullName || !email || !role || !startDate) return;

    const newEmployee: Employee = {
      id: Date.now(),
      fullName,
      email,
      role,
      startDate,
      checklist: defaultChecklist.map((task) => ({ ...task })),
    };

    setEmployees((prev) => [...prev, newEmployee]);
    setEmployeeInput({ fullName: "", email: "", role: "", startDate: "" });
  };

  const toggleTask = (empId: number, taskIndex: number) => {
    setEmployees((prev) =>
      prev.map((emp) => {
        if (emp.id === empId) {
          const updatedChecklist = [...emp.checklist];
          updatedChecklist[taskIndex].completed =
            !updatedChecklist[taskIndex].completed;
          return { ...emp, checklist: updatedChecklist };
        }
        return emp;
      })
    );
  };

  const handleAddCustomTask = (empId: number, taskTitle: string) => {
    setEmployees((prev) =>
      prev.map((emp) => {
        if (emp.id === empId) {
          return {
            ...emp,
            checklist: [
              ...emp.checklist,
              { title: taskTitle, completed: false },
            ],
          };
        }
        return emp;
      })
    );
  };

  const getProgress = (checklist: Task[]) => {
    const completed = checklist.filter((t) => t.completed).length;
    const total = checklist.length;
    const percent = Math.round((completed / total) * 100);
    return { completed, total, percent };
  };

  const filterEmployees = () => {
    return employees
      .filter((emp) => {
        const { completed, total } = getProgress(emp.checklist);
        const progress =
          completed === total
            ? "Completed"
            : completed > 0
            ? "In Progress"
            : "Not Started";
        const matchesSearch = emp.fullName
          .toLowerCase()
          .includes(search.toLowerCase());
        const matchesFilter =
          filterStatus === "All" || progress === filterStatus;

        return matchesSearch && matchesFilter;
      })
      .sort(
        (a, b) =>
          new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
      );
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-semibold mb-6 text-center">Add Employee</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="fullName"
          value={employeeInput.fullName}
          onChange={handleChange}
          placeholder="Full Name"
          className="w-full border rounded p-2"
        />
        <input
          type="email"
          name="email"
          value={employeeInput.email}
          onChange={handleChange}
          placeholder="Email"
          className="w-full border rounded p-2"
        />
        <input
          type="text"
          name="role"
          value={employeeInput.role}
          onChange={handleChange}
          placeholder="Job Role / Department"
          className="w-full border rounded p-2"
        />
        <input
          type="date"
          name="startDate"
          value={employeeInput.startDate}
          onChange={handleChange}
          className="w-full border rounded p-2"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Add Employee
        </button>
      </form>

      <div className="mt-8 space-y-4">
        <input
          type="text"
          placeholder="Search by Name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border rounded p-2"
        />

        <select
          value={filterStatus}
          onChange={(e) =>
            setFilterStatus(
              e.target.value as
                | "All"
                | "Not Started"
                | "In Progress"
                | "Completed"
            )
          }
          className="w-full border rounded p-2"
        >
          <option value="All">All Status</option>
          <option value="Not Started">Not Started</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>

        <h3 className="text-lg font-medium">Employee List:</h3>
        {filterEmployees().map((emp) => {
          const { completed, total, percent } = getProgress(emp.checklist);
          const progress =
            completed === total
              ? "Completed"
              : completed > 0
              ? "In Progress"
              : "Not Started";

          return (
            <div
              key={emp.id}
              className="border p-4 rounded shadow-sm bg-gray-50"
            >
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p>
                    <strong>{emp.fullName}</strong> — {emp.role}
                  </p>
                  <p className="text-sm text-gray-500">{emp.email}</p>
                  <p className="text-sm text-gray-500">
                    Start: {emp.startDate}
                  </p>
                </div>
                <span
                  className={`text-sm font-semibold ${
                    progress === "Completed"
                      ? "text-green-600"
                      : progress === "In Progress"
                      ? "text-yellow-600"
                      : "text-red-600"
                  }`}
                >
                  {progress}
                </span>
              </div>

              <div className="mb-2">
                <div className="w-full bg-gray-200 h-2 rounded">
                  <div
                    className="bg-green-500 h-2 rounded"
                    style={{ width: `${percent}%` }}
                  />
                </div>
                <p className="text-xs mt-1 text-gray-600">
                  {percent}% Complete
                </p>
              </div>

              <ul className="space-y-2 mt-2">
                {emp.checklist.map((task, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleTask(emp.id, i)}
                    />
                    <span
                      className={
                        task.completed ? "line-through text-green-600" : ""
                      }
                    >
                      {task.title}
                    </span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() =>
                  handleAddCustomTask(
                    emp.id,
                    prompt("Enter custom task:") || ""
                  )
                }
                className="mt-4 text-blue-600"
              >
                Add Custom Task
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AddEmployeeForm;
