'use client';

import { useState } from 'react';

type Employee = {
  fullName: string;
  email: string;
  role: string;
  startDate: string;
};

const AddEmployeeForm = () => {
  const [employee, setEmployee] = useState<Employee>({
    fullName: '',
    email: '',
    role: '',
    startDate: '',
  });

  const [employees, setEmployees] = useState<Employee[]>([]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setEmployee((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Simple validation
    if (!employee.fullName || !employee.email || !employee.role || !employee.startDate) return;

    setEmployees((prev) => [...prev, employee]);
    console.log('Employee Added:', employee);

    // Clear form
    setEmployee({
      fullName: '',
      email: '',
      role: '',
      startDate: '',
    });
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-semibold mb-6 text-center">Add Employee</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="fullName"
          value={employee.fullName}
          onChange={handleChange}
          placeholder="Full Name"
          className="w-full border border-gray-300 rounded p-2"
        />

        <input
          type="email"
          name="email"
          value={employee.email}
          onChange={handleChange}
          placeholder="Email"
          className="w-full border border-gray-300 rounded p-2"
        />

        <input
          type="text"
          name="role"
          value={employee.role}
          onChange={handleChange}
          placeholder="Job Role / Department"
          className="w-full border border-gray-300 rounded p-2"
        />

        <input
          type="date"
          name="startDate"
          value={employee.startDate}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded p-2"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Add Employee
        </button>
      </form>

      {employees.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-2">Employee List:</h3>
          <ul className="space-y-2">
            {employees.map((emp, index) => (
              <li
                key={index}
                className="border p-3 rounded shadow-sm bg-gray-50 text-sm"
              >
                <p><strong>Name:</strong> {emp.fullName}</p>
                <p><strong>Email:</strong> {emp.email}</p>
                <p><strong>Role:</strong> {emp.role}</p>
                <p><strong>Start Date:</strong> {emp.startDate}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AddEmployeeForm;
