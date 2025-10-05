import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Heart, Github, Twitter, Mail } from 'lucide-react';

const FooterContainer = styled.footer`
  background: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);
  padding: 2rem;
  margin-top: auto;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
`;

const FooterText = styled.p`
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 1rem;
  font-size: 0.9rem;
`;

const SocialLinks = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const SocialLink = styled(motion.a)`
  color: rgba(255, 255, 255, 0.7);
  transition: all 0.3s ease;
  
  &:hover {
    color: white;
  }
`;

const Copyright = styled.p`
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.8rem;
  margin: 0;
`;

function Footer() {
  return (
    <FooterContainer>
      <FooterContent>
        <FooterText>
          Made with <Heart size={16} style={{ color: '#ff6b6b', display: 'inline' }} /> by the VideoGen AI team
        </FooterText>
        
        <SocialLinks>
          <SocialLink
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          >
            <Github size={20} />
          </SocialLink>
          <SocialLink
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          >
            <Twitter size={20} />
          </SocialLink>
          <SocialLink
            href="mailto:contact@videogen.ai"
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          >
            <Mail size={20} />
          </SocialLink>
        </SocialLinks>
        
        <Copyright>
          © 2024 VideoGen AI. All rights reserved.
        </Copyright>
      </FooterContent>
    </FooterContainer>
  );
}

export default Footer;