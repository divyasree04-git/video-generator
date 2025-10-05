import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { X, Download, Play, Pause, RotateCcw, Share2 } from 'lucide-react';
import ReactPlayer from 'react-player';

const PlayerContainer = styled(motion.div)`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  position: relative;
`;

const CloseButton = styled(motion.button)`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(0, 0, 0, 0.1);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #666;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(0, 0, 0, 0.2);
    color: #333;
  }
`;

const VideoWrapper = styled.div`
  position: relative;
  width: 100%;
  max-width: 800px;
  margin: 0 auto 2rem;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
`;

const VideoInfo = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const VideoTitle = styled.h3`
  color: #333;
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const VideoDetails = styled.div`
  color: #666;
  font-size: 0.9rem;
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
`;

const DetailItem = styled.span`
  background: rgba(102, 126, 234, 0.1);
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  color: #667eea;
  font-weight: 500;
`;

const Controls = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
`;

const ControlButton = styled(motion.button)`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
  }
`;

const SecondaryButton = styled(motion.button)`
  background: white;
  color: #667eea;
  border: 2px solid #667eea;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  
  &:hover {
    background: #667eea;
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(102, 126, 234, 0.2);
  }
`;

const ShareContainer = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  background: rgba(102, 126, 234, 0.05);
  border-radius: 12px;
  border: 1px solid rgba(102, 126, 234, 0.1);
`;

const ShareInput = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e1e5e9;
  border-radius: 8px;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
`;

const ShareLabel = styled.label`
  display: block;
  color: #333;
  font-weight: 600;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
`;

function VideoPlayer({ videoData, onClose }) {
  const [playing, setPlaying] = useState(false);
  const [shareUrl, setShareUrl] = useState('');

  const handleDownload = () => {
    window.open(videoData.downloadUrl, '_blank');
  };

  const handleShare = () => {
    const url = `${window.location.origin}${videoData.videoUrl}`;
    setShareUrl(url);
    
    if (navigator.share) {
      navigator.share({
        title: 'Check out my animated video!',
        text: `Created with Animated Video Generator: ${videoData.prompt}`,
        url: url
      });
    } else {
      navigator.clipboard.writeText(url).then(() => {
        alert('Video URL copied to clipboard!');
      });
    }
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      alert('Video URL copied to clipboard!');
    });
  };

  return (
    <PlayerContainer
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      transition={{ duration: 0.5 }}
    >
      <CloseButton
        onClick={onClose}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <X size={20} />
      </CloseButton>

      <VideoInfo>
        <VideoTitle>Your Generated Video</VideoTitle>
        <VideoDetails>
          <DetailItem>{videoData.style}</DetailItem>
          <DetailItem>{videoData.duration}s</DetailItem>
          <DetailItem>{videoData.resolution}</DetailItem>
          <DetailItem>{videoData.fps} FPS</DetailItem>
        </VideoDetails>
      </VideoInfo>

      <VideoWrapper>
        <ReactPlayer
          url={videoData.videoUrl}
          width="100%"
          height="auto"
          playing={playing}
          controls={true}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
        />
      </VideoWrapper>

      <Controls>
        <ControlButton
          onClick={handleDownload}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Download size={20} />
          Download Video
        </ControlButton>

        <SecondaryButton
          onClick={handleShare}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Share2 size={20} />
          Share Video
        </SecondaryButton>
      </Controls>

      {shareUrl && (
        <ShareContainer>
          <ShareLabel>Share this video:</ShareLabel>
          <ShareInput
            value={shareUrl}
            readOnly
            onClick={(e) => e.target.select()}
          />
          <SecondaryButton
            onClick={handleCopyUrl}
            style={{ marginTop: '0.5rem' }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Copy URL
          </SecondaryButton>
        </ShareContainer>
      )}
    </PlayerContainer>
  );
}

export default VideoPlayer;