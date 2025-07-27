import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";

const API_URL = "http://localhost:5000/api";

const DashboardContainer = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  color: #2c3e50;
  margin-bottom: 1.5rem;
`;

const TabsContainer = styled.div`
  display: flex;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid #ddd;
`;

const Tab = styled.button`
  padding: 0.75rem 1.5rem;
  background: ${(props) => (props.active ? "#3498db" : "transparent")};
  color: ${(props) => (props.active ? "white" : "#34495e")};
  border: none;
  cursor: pointer;
  font-size: 1rem;

  &:hover {
    background: ${(props) => (props.active ? "#3498db" : "#f1f2f6")};
  }
`;

const ClassStatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
`;

const ClassCard = styled.div`
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 1rem;
  background: white;
`;

const ClassTitle = styled.h3`
  color: #2c3e50;
  margin: 0 0 0.5rem;
`;

const ProgressContainer = styled.div`
  background: #ecf0f1;
  border-radius: 10px;
  height: 10px;
  overflow: hidden;
  margin: 0.5rem 0;
`;

const ProgressBar = styled.div`
  height: 100%;
  background: ${(props) => {
    const percentage = (props.value / props.max) * 100;
    if (percentage < 60) return "#2ecc71";
    if (percentage < 80) return "#f39c12";
    return "#e74c3c";
  }};
  width: ${(props) => (props.value / props.max) * 100}%;
`;

const RegistrationTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHead = styled.thead`
  background: #f1f2f6;
`;

const TableRow = styled.tr`
  border-bottom: 1px solid #ddd;

  &:hover {
    background: #f8f9fa;
  }
`;

const TableHeader = styled.th`
  text-align: left;
  padding: 0.75rem;
`;

const TableCell = styled.td`
  padding: 0.75rem;
`;

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("stats");
  const [classes, setClasses] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [classesRes, registrationsRes] = await Promise.all([
          axios.get(`${API_URL}/classes`),
          axios.get(`${API_URL}/registrations`),
        ]);

        setClasses(classesRes.data);
        setRegistrations(registrationsRes.data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to load data:", err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading dashboard data...</div>;
  }

  return (
    <DashboardContainer>
      <Title>Admin Dashboard</Title>

      <TabsContainer>
        <Tab
          active={activeTab === "stats"}
          onClick={() => setActiveTab("stats")}
        >
          Class Statistics
        </Tab>
        <Tab
          active={activeTab === "registrations"}
          onClick={() => setActiveTab("registrations")}
        >
          Registrations
        </Tab>
      </TabsContainer>

      {activeTab === "stats" && (
        <ClassStatsContainer>
          {classes.map((cls) => (
            <ClassCard key={cls.id}>
              <ClassTitle>{cls.name}</ClassTitle>
              <p>{cls.description}</p>

              <ProgressContainer>
                <ProgressBar value={cls.enrolled} max={cls.capacity} />
              </ProgressContainer>

              <div>
                {cls.enrolled}/{cls.capacity} enrolled
              </div>

              {cls.available <= 0 && (
                <div
                  style={{
                    color: "#e74c3c",
                    fontWeight: "bold",
                    marginTop: "0.5rem",
                  }}
                >
                  Class Full
                </div>
              )}
            </ClassCard>
          ))}
        </ClassStatsContainer>
      )}

      {activeTab === "registrations" && (
        <RegistrationTable>
          <TableHead>
            <TableRow>
              <TableHeader>Registration ID</TableHeader>
              <TableHeader>Parent Name</TableHeader>
              <TableHeader>Parent Email</TableHeader>
              <TableHeader># of Students</TableHeader>
              <TableHeader>Date</TableHeader>
            </TableRow>
          </TableHead>
          <tbody>
            {registrations.map((reg) => (
              <TableRow key={reg.id}>
                <TableCell>{reg.id}</TableCell>
                <TableCell>{reg.parentInfo.name}</TableCell>
                <TableCell>{reg.parentInfo.email}</TableCell>
                <TableCell>{reg.students.length}</TableCell>
                <TableCell>
                  {new Date(reg.timestamp).toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </tbody>
        </RegistrationTable>
      )}
    </DashboardContainer>
  );
}

export default AdminDashboard;
