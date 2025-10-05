import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Play, Settings, Download, Sparkles } from 'lucide-react';
import axios from 'axios';

const GeneratorContainer = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: 600;
  color: #333;
  font-size: 1rem;
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 120px;
  padding: 1rem;
  border: 2px solid #e1e5e9;
  border-radius: 12px;
  font-size: 1rem;
  font-family: inherit;
  resize: vertical;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
  
  &::placeholder {
    color: #999;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 1rem;
  border: 2px solid #e1e5e9;
  border-radius: 12px;
  font-size: 1rem;
  font-family: inherit;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const RangeInput = styled.input`
  width: 100%;
  height: 8px;
  border-radius: 4px;
  background: #e1e5e9;
  outline: none;
  -webkit-appearance: none;
  
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #667eea;
    cursor: pointer;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  }
  
  &::-moz-range-thumb {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #667eea;
    cursor: pointer;
    border: none;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  }
`;

const RangeValue = styled.span`
  font-weight: 600;
  color: #667eea;
  font-size: 1.1rem;
`;

const Button = styled(motion.button)`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  min-height: 56px;
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const ProgressContainer = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  background: rgba(102, 126, 234, 0.1);
  border-radius: 12px;
  border: 1px solid rgba(102, 126, 234, 0.2);
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: rgba(102, 126, 234, 0.2);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 0.5rem;
`;

const ProgressFill = styled(motion.div)`
  height: 100%;
  background: linear-gradient(90deg, #667eea, #764ba2);
  border-radius: 4px;
`;

const ProgressText = styled.div`
  color: #667eea;
  font-weight: 600;
  text-align: center;
`;

const SettingsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
`;

const StyleGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const StyleOption = styled(motion.div)`
  padding: 0.75rem;
  border: 2px solid ${props => props.selected ? '#667eea' : '#e1e5e9'};
  border-radius: 8px;
  text-align: center;
  cursor: pointer;
  background: ${props => props.selected ? 'rgba(102, 126, 234, 0.1)' : 'white'};
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #667eea;
    background: rgba(102, 126, 234, 0.05);
  }
`;

const StyleName = styled.div`
  font-weight: 600;
  color: #333;
  font-size: 0.9rem;
`;

const StyleDesc = styled.div`
  color: #666;
  font-size: 0.8rem;
  margin-top: 0.25rem;
`;

function VideoGenerator({ onVideoGenerated, onGenerationStart, isGenerating, progress, message }) {
  const [prompt, setPrompt] = useState('');
  const [duration, setDuration] = useState(10);
  const [style, setStyle] = useState('animated');
  const [resolution, setResolution] = useState('1920x1080');
  const [fps, setFps] = useState(30);
  const [styles, setStyles] = useState([]);

  useEffect(() => {
    // Fetch available styles
    axios.get('/api/styles')
      .then(response => setStyles(response.data))
      .catch(error => console.error('Error fetching styles:', error));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!prompt.trim()) {
      alert('Please enter a prompt for your video');
      return;
    }

    onGenerationStart();

    try {
      const response = await axios.post('/api/generate-video', {
        prompt: prompt.trim(),
        duration,
        style,
        resolution,
        fps
      });

      const { jobId } = response.data;
      
      // Poll for completion
      const pollForCompletion = async () => {
        try {
          const statusResponse = await axios.get(`/api/video/${jobId}`);
          const { status, videoUrl, downloadUrl } = statusResponse.data;
          
          if (status === 'completed') {
            onVideoGenerated({
              jobId,
              videoUrl,
              downloadUrl,
              prompt,
              duration,
              style,
              resolution,
              fps
            });
          } else if (status === 'processing') {
            setTimeout(pollForCompletion, 2000);
          }
        } catch (error) {
          console.error('Error polling for video:', error);
        }
      };

      setTimeout(pollForCompletion, 2000);
      
    } catch (error) {
      console.error('Error generating video:', error);
      alert('Error generating video. Please try again.');
    }
  };

  return (
    <GeneratorContainer>
      <Form onSubmit={handleSubmit}>
        <InputGroup>
          <Label htmlFor="prompt">
            <Sparkles size={20} style={{ marginRight: '0.5rem', display: 'inline' }} />
            Describe your video
          </Label>
          <TextArea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter a detailed description of the video you want to create. For example: 'A beautiful sunset over mountains with birds flying across the sky'"
            disabled={isGenerating}
          />
        </InputGroup>

        <InputGroup>
          <Label>Animation Style</Label>
          <StyleGrid>
            {styles.map((styleOption) => (
              <StyleOption
                key={styleOption.id}
                selected={style === styleOption.id}
                onClick={() => setStyle(styleOption.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <StyleName>{styleOption.name}</StyleName>
                <StyleDesc>{styleOption.description}</StyleDesc>
              </StyleOption>
            ))}
          </StyleGrid>
        </InputGroup>

        <SettingsGrid>
          <InputGroup>
            <Label htmlFor="duration">
              Duration: <RangeValue>{duration}s</RangeValue>
            </Label>
            <RangeInput
              id="duration"
              type="range"
              min="5"
              max="60"
              value={duration}
              onChange={(e) => setDuration(parseInt(e.target.value))}
              disabled={isGenerating}
            />
          </InputGroup>

          <InputGroup>
            <Label htmlFor="resolution">Resolution</Label>
            <Select
              id="resolution"
              value={resolution}
              onChange={(e) => setResolution(e.target.value)}
              disabled={isGenerating}
            >
              <option value="1280x720">HD (1280x720)</option>
              <option value="1920x1080">Full HD (1920x1080)</option>
              <option value="2560x1440">2K (2560x1440)</option>
              <option value="3840x2160">4K (3840x2160)</option>
            </Select>
          </InputGroup>

          <InputGroup>
            <Label htmlFor="fps">
              FPS: <RangeValue>{fps}</RangeValue>
            </Label>
            <RangeInput
              id="fps"
              type="range"
              min="24"
              max="60"
              value={fps}
              onChange={(e) => setFps(parseInt(e.target.value))}
              disabled={isGenerating}
            />
          </InputGroup>
        </SettingsGrid>

        <Button
          type="submit"
          disabled={isGenerating || !prompt.trim()}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {isGenerating ? (
            <>
              <Settings className="animate-spin" size={20} />
              Generating...
            </>
          ) : (
            <>
              <Play size={20} />
              Generate Video
            </>
          )}
        </Button>

        {isGenerating && (
          <ProgressContainer>
            <ProgressBar>
              <ProgressFill
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </ProgressBar>
            <ProgressText>
              {message} ({Math.round(progress)}%)
            </ProgressText>
          </ProgressContainer>
        )}
      </Form>
    </GeneratorContainer>
  );
}

export default VideoGenerator;