import React from "react";
import styled from "styled-components";

const FooterContainer = styled.footer`
  background-color: #2c3e50;
  color: white;
  padding: 1rem 2rem;
  text-align: center;
  margin-top: auto;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

function Footer() {
  return (
    <FooterContainer>
      <FooterContent>
        <p>
          &copy; {new Date().getFullYear()} Summer Camp Registration. All rights
          reserved.
        </p>
      </FooterContent>
    </FooterContainer>
  );
}

export default Footer;
