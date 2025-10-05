import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Video, Sparkles } from 'lucide-react';

const HeaderContainer = styled.header`
  padding: 1rem 2rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Logo = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: white;
  font-size: 1.5rem;
  font-weight: bold;
`;

const Nav = styled.nav`
  display: flex;
  gap: 2rem;
  align-items: center;
`;

const NavLink = styled(motion.a)`
  color: rgba(255, 255, 255, 0.9);
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
  
  &:hover {
    color: white;
  }
`;

const FeatureBadge = styled(motion.div)`
  background: rgba(255, 255, 255, 0.2);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  color: white;
  font-size: 0.9rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

function Header() {
  return (
    <HeaderContainer>
      <HeaderContent>
        <Logo
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Video size={32} />
          VideoGen AI
        </Logo>
        
        <Nav>
          <NavLink
            href="#features"
            whileHover={{ scale: 1.05 }}
          >
            Features
          </NavLink>
          <NavLink
            href="#how-it-works"
            whileHover={{ scale: 1.05 }}
          >
            How it Works
          </NavLink>
          <NavLink
            href="#examples"
            whileHover={{ scale: 1.05 }}
          >
            Examples
          </NavLink>
          
          <FeatureBadge
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Sparkles size={16} />
            AI Powered
          </FeatureBadge>
        </Nav>
      </HeaderContent>
    </HeaderContainer>
  );
}

export default Header;