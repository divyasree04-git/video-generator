import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster, toast } from 'react-hot-toast';
import VideoGenerator from './components/VideoGenerator';
import VideoPlayer from './components/VideoPlayer';
import Header from './components/Header';
import Footer from './components/Footer';
import Features from './components/Features';

const AppContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
`;

const MainContent = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
`;

const Title = styled(motion.h1)`
  color: white;
  font-size: 3rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
`;

const Subtitle = styled(motion.p)`
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.2rem;
  text-align: center;
  margin-bottom: 3rem;
  max-width: 600px;
`;

const ContentWrapper = styled.div`
  width: 100%;
  max-width: 1200px;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

function App() {
  const [currentVideo, setCurrentVideo] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generationMessage, setGenerationMessage] = useState('');

  useEffect(() => {
    // WebSocket connection for real-time updates
    const ws = new WebSocket('ws://localhost:8080');
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'progress') {
        setGenerationProgress(data.progress);
        setGenerationMessage(data.message);
        
        if (data.progress === 100) {
          setIsGenerating(false);
          toast.success('Video generation completed!');
        } else if (data.progress === -1) {
          setIsGenerating(false);
          toast.error(data.message);
        }
      }
    };

    return () => ws.close();
  }, []);

  const handleVideoGenerated = (videoData) => {
    setCurrentVideo(videoData);
  };

  const handleGenerationStart = () => {
    setIsGenerating(true);
    setGenerationProgress(0);
    setGenerationMessage('Starting video generation...');
  };

  return (
    <AppContainer>
      <Header />
      <MainContent>
        <Title
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Animated Video Generator
        </Title>
        <Subtitle
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Transform your text prompts into stunning animated videos. 
          Choose from multiple styles and create videos of any length.
        </Subtitle>
        
        <ContentWrapper>
          <VideoGenerator
            onVideoGenerated={handleVideoGenerated}
            onGenerationStart={handleGenerationStart}
            isGenerating={isGenerating}
            progress={generationProgress}
            message={generationMessage}
          />
          
          <AnimatePresence>
            {currentVideo && (
              <VideoPlayer
                key={currentVideo.jobId}
                videoData={currentVideo}
                onClose={() => setCurrentVideo(null)}
              />
            )}
          </AnimatePresence>
        </ContentWrapper>
        
        <Features />
      </MainContent>
      <Footer />
      <Toaster position="top-right" />
    </AppContainer>
  );
}

export default App;