import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";

const API_URL = "http://localhost:5000/api";

const ListContainer = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  color: #2c3e50;
  margin-bottom: 1.5rem;
`;

const RegistrationItem = styled.div`
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  background: #f8f9fa;
`;

const RegistrationHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #ddd;
`;

const RegistrationId = styled.div`
  font-weight: bold;
  color: #3498db;
`;

const RegistrationDate = styled.div`
  color: #7f8c8d;
  font-size: 0.9rem;
`;

const ParentInfo = styled.div`
  margin-bottom: 1rem;
`;

const StudentsContainer = styled.div`
  margin-top: 1rem;
`;

const StudentCard = styled.div`
  background: white;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const StudentName = styled.h4`
  color: #2c3e50;
  margin: 0 0 0.5rem;
`;

const ClassesList = styled.ul`
  margin: 0.5rem 0;
  padding-left: 1.5rem;
`;

function RegistrationList() {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        const response = await axios.get(`${API_URL}/registrations`);
        setRegistrations(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to load registrations:", err);
        setLoading(false);
      }
    };

    fetchRegistrations();
  }, []);

  if (loading) {
    return <div>Loading registrations...</div>;
  }

  if (registrations.length === 0) {
    return (
      <ListContainer>
        <Title>Registrations</Title>
        <p>No registrations found.</p>
      </ListContainer>
    );
  }

  return (
    <ListContainer>
      <Title>All Registrations</Title>

      {registrations.map((registration) => (
        <RegistrationItem key={registration.id}>
          <RegistrationHeader>
            <RegistrationId>Registration ID: {registration.id}</RegistrationId>
            <RegistrationDate>
              {new Date(registration.timestamp).toLocaleString()}
            </RegistrationDate>
          </RegistrationHeader>

          <ParentInfo>
            <h3>Parent Information</h3>
            <p>
              <strong>Name:</strong> {registration.parentInfo.name}
            </p>
            <p>
              <strong>Email:</strong> {registration.parentInfo.email}
            </p>
            <p>
              <strong>Phone:</strong> {registration.parentInfo.phone}
            </p>
          </ParentInfo>

          <StudentsContainer>
            <h3>Students ({registration.students.length})</h3>

            {registration.students.map((student, index) => (
              <StudentCard key={index}>
                <StudentName>
                  {student.name} (Age {student.age})
                </StudentName>

                {student.allergies && (
                  <p>
                    <strong>Allergies:</strong> {student.allergies}
                  </p>
                )}

                <div>
                  <strong>Classes:</strong>
                  <ClassesList>
                    {student.classSelections.map((classId, idx) => (
                      <li key={idx}>Class ID: {classId}</li>
                    ))}
                  </ClassesList>
                </div>
              </StudentCard>
            ))}
          </StudentsContainer>
        </RegistrationItem>
      ))}
    </ListContainer>
  );
}

export default RegistrationList;
