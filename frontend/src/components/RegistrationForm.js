import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";

import StudentForm from "./StudentForm";

const API_URL = "http://localhost:5000/api";

const FormContainer = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const FormTitle = styled.h1`
  color: #2c3e50;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const Section = styled.div`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h2`
  color: #34495e;
  font-size: 1.5rem;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #ecf0f1;
`;

const FormField = styled.div`
  margin-bottom: 1rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #3498db;
    box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
  }
`;

const StudentsContainer = styled.div`
  margin-top: 1rem;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  background: ${(props) => (props.primary ? "#3498db" : "#ecf0f1")};
  color: ${(props) => (props.primary ? "white" : "#34495e")};
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: ${(props) => (props.primary ? "#2980b9" : "#dfe6e9")};
  }

  &:disabled {
    background: #bdc3c7;
    cursor: not-allowed;
  }
`;

const SubmitButton = styled(Button)`
  background: #27ae60;

  &:hover {
    background: #2ecc71;
  }

  &:disabled {
    background: #bdc3c7;
  }
`;

const ErrorMessage = styled.div`
  color: #e74c3c;
  padding: 0.75rem;
  background: #fadbd8;
  border-radius: 4px;
  margin-bottom: 1rem;
`;

function RegistrationForm() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const [parentInfo, setParentInfo] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [students, setStudents] = useState([
    {
      id: Date.now(),
      name: "",
      age: "",
      allergies: "",
      medicalNotes: "",
      classSelections: [],
    },
  ]);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await axios.get(`${API_URL}/classes`);
        setClasses(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load available classes. Please try again later.");
        setLoading(false);
      }
    };

    fetchClasses();
  }, []);

  const handleParentInfoChange = (e) => {
    const { name, value } = e.target;
    setParentInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleStudentChange = (id, updatedStudent) => {
    setStudents((prev) =>
      prev.map((student) => (student.id === id ? updatedStudent : student)),
    );
  };

  const addStudent = () => {
    setStudents((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: "",
        age: "",
        allergies: "",
        medicalNotes: "",
        classSelections: [],
      },
    ]);
  };

  const removeStudent = (id) => {
    setStudents((prev) => prev.filter((student) => student.id !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setError(null);
      const response = await axios.post(`${API_URL}/register`, {
        parentInfo,
        students,
      });

      if (response.data.success) {
        navigate(`/success/${response.data.registrationId}`);
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed. Please try again.",
      );
    }
  };

  const isFormValid = () => {
    if (!parentInfo.name || !parentInfo.email || !parentInfo.phone) {
      return false;
    }

    for (const student of students) {
      if (
        !student.name ||
        !student.age ||
        student.classSelections.length !== 3
      ) {
        return false;
      }
    }

    return true;
  };

  if (loading) {
    return <div>Loading class information...</div>;
  }

  return (
    <FormContainer>
      <FormTitle>Summer Camp Registration</FormTitle>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      <form onSubmit={handleSubmit}>
        <Section>
          <SectionTitle>Parent/Guardian Information</SectionTitle>
          <FormField>
            <Label htmlFor="parentName">Full Name</Label>
            <Input
              id="parentName"
              name="name"
              value={parentInfo.name}
              onChange={handleParentInfoChange}
              required
            />
          </FormField>

          <FormField>
            <Label htmlFor="parentEmail">Email</Label>
            <Input
              id="parentEmail"
              name="email"
              type="email"
              value={parentInfo.email}
              onChange={handleParentInfoChange}
              required
            />
          </FormField>

          <FormField>
            <Label htmlFor="parentPhone">Phone Number</Label>
            <Input
              id="parentPhone"
              name="phone"
              type="tel"
              value={parentInfo.phone}
              onChange={handleParentInfoChange}
              required
            />
          </FormField>
        </Section>

        <Section>
          <SectionTitle>Student Information</SectionTitle>
          <StudentsContainer>
            {students.map((student) => (
              <StudentForm
                key={student.id}
                student={student}
                classes={classes}
                onChange={(updatedStudent) =>
                  handleStudentChange(student.id, updatedStudent)
                }
                onRemove={() => removeStudent(student.id)}
                isRemoveDisabled={students.length === 1}
              />
            ))}
          </StudentsContainer>

          <ButtonContainer>
            <Button type="button" onClick={addStudent}>
              Add Another Student
            </Button>
          </ButtonContainer>
        </Section>

        <SubmitButton type="submit" disabled={!isFormValid()} primary>
          Complete Registration
        </SubmitButton>
      </form>
    </FormContainer>
  );
}

export default RegistrationForm;
