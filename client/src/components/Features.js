import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  Video, 
  Download, 
  Settings, 
  Share2, 
  Zap, 
  Palette, 
  Clock, 
  Monitor 
} from 'lucide-react';

const FeaturesContainer = styled.section`
  padding: 4rem 2rem;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  margin: 2rem 0;
`;

const FeaturesTitle = styled.h2`
  color: white;
  font-size: 2.5rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 3rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const FeatureCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 2rem;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.15);
    transform: translateY(-5px);
  }
`;

const FeatureIcon = styled.div`
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);
`;

const FeatureTitle = styled.h3`
  color: white;
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
`;

const FeatureDescription = styled.p`
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
  font-size: 1rem;
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
`;

const StatItem = styled(motion.div)`
  text-align: center;
  color: white;
`;

const StatNumber = styled.div`
  font-size: 3rem;
  font-weight: bold;
  color: #667eea;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.8);
`;

function Features() {
  const features = [
    {
      icon: <Video size={40} />,
      title: 'Multiple Styles',
      description: 'Choose from 8 different animation styles including 3D, motion graphics, whiteboard, and more.'
    },
    {
      icon: <Clock size={40} />,
      title: 'Custom Duration',
      description: 'Generate videos from 5 seconds to 60 seconds with precise control over timing.'
    },
    {
      icon: <Monitor size={40} />,
      title: 'High Quality',
      description: 'Support for HD, Full HD, 2K, and 4K resolutions with up to 60 FPS.'
    },
    {
      icon: <Zap size={40} />,
      title: 'Real-time Progress',
      description: 'Watch your video being generated with live progress updates and status messages.'
    },
    {
      icon: <Download size={40} />,
      title: 'Instant Download',
      description: 'Download your generated videos immediately in MP4 format with high quality.'
    },
    {
      icon: <Share2 size={40} />,
      title: 'Easy Sharing',
      description: 'Share your videos with others through direct links or social media integration.'
    },
    {
      icon: <Settings size={40} />,
      title: 'Customizable',
      description: 'Fine-tune your videos with custom FPS, resolution, and animation parameters.'
    },
    {
      icon: <Palette size={40} />,
      title: 'AI Powered',
      description: 'Advanced AI algorithms create smooth, professional animations from your text prompts.'
    }
  ];

  const stats = [
    { number: '8+', label: 'Animation Styles' },
    { number: '4K', label: 'Max Resolution' },
    { number: '60s', label: 'Max Duration' },
    { number: '60', label: 'Max FPS' }
  ];

  return (
    <FeaturesContainer id="features">
      <FeaturesTitle>Powerful Features</FeaturesTitle>
      
      <FeaturesGrid>
        {features.map((feature, index) => (
          <FeatureCard
            key={index}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
          >
            <FeatureIcon>
              {feature.icon}
            </FeatureIcon>
            <FeatureTitle>{feature.title}</FeatureTitle>
            <FeatureDescription>{feature.description}</FeatureDescription>
          </FeatureCard>
        ))}
      </FeaturesGrid>

      <StatsContainer>
        {stats.map((stat, index) => (
          <StatItem
            key={index}
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <StatNumber>{stat.number}</StatNumber>
            <StatLabel>{stat.label}</StatLabel>
          </StatItem>
        ))}
      </StatsContainer>
    </FeaturesContainer>
  );
}

export default Features;