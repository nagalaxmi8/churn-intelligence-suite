import React from "react";

export default function DynamicForm({ fields, setFormData }) {

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div>
      {fields.map((f) => (
        <input
          key={f}
          name={f}
          placeholder={f}
          onChange={handleChange}
        />
      ))}
    </div>
  );
}