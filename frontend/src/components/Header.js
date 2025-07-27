import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

const HeaderContainer = styled.header`
  background-color: #2c3e50;
  color: white;
  padding: 1rem 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
`;

const Logo = styled(Link)`
  font-size: 1.5rem;
  font-weight: bold;
  color: white;
  text-decoration: none;

  &:hover {
    color: #ecf0f1;
  }
`;

const NavLinks = styled.div`
  display: flex;
  gap: 20px;
`;

const NavLink = styled(Link)`
  color: white;
  text-decoration: none;

  &:hover {
    color: #ecf0f1;
    text-decoration: underline;
  }
`;

function Header() {
  return (
    <HeaderContainer>
      <Nav>
        <Logo to="/">Summer Camp Registration</Logo>
        <NavLinks>
          <NavLink to="/">Register</NavLink>
          <NavLink to="/admin">Admin</NavLink>
        </NavLinks>
      </Nav>
    </HeaderContainer>
  );
}

export default Header;
