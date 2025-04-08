'use client';

import { useState } from 'react';

type Task = {
  title: string;
  completed: boolean;
};

type Employee = {
  fullName: string;
  email: string;
  role: string;
  startDate: string;
  checklist: Task[];
};

const defaultChecklist: Task[] = [
  { title: 'Sign NDA', completed: false },
  { title: 'Submit ID card', completed: false },
  { title: 'Set up email', completed: false },
  { title: 'Complete HR orientation', completed: false },
  { title: 'Access company tools (Slack, GitHub)', completed: false },
  { title: 'Book intro meeting with manager', completed: false },
];

const AddEmployeeForm = () => {
  const [employeeInput, setEmployeeInput] = useState({
    fullName: '',
    email: '',
    role: '',
    startDate: '',
  });

  const [employees, setEmployees] = useState<Employee[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEmployeeInput((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const { fullName, email, role, startDate } = employeeInput;
    if (!fullName || !email || !role || !startDate) return;

    const newEmployee: Employee = {
      ...employeeInput,
      checklist: defaultChecklist.map((task) => ({ ...task })), // avoid reference issues
    };

    setEmployees((prev) => [...prev, newEmployee]);
    setEmployeeInput({ fullName: '', email: '', role: '', startDate: '' });
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow">
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

      {employees.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-medium mb-4">Employee List:</h3>
          {employees.map((emp, idx) => (
            <div key={idx} className="mb-6 border p-4 rounded shadow-sm bg-gray-50">
              <p><strong>Name:</strong> {emp.fullName}</p>
              <p><strong>Email:</strong> {emp.email}</p>
              <p><strong>Role:</strong> {emp.role}</p>
              <p><strong>Start Date:</strong> {emp.startDate}</p>
              <div className="mt-2">
                <p className="font-semibold">Checklist:</p>
                <ul className="list-disc list-inside text-sm mt-1">
                  {emp.checklist.map((task, i) => (
                    <li key={i} className={task.completed ? 'line-through text-green-600' : ''}>
                      {task.title}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AddEmployeeForm;
