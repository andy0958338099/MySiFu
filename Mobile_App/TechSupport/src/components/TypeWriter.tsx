import React, { useState, useEffect } from 'react';
import { Text } from '@chakra-ui/react';

interface TypeWriterProps {
  text: string;
  speed?: number;
}

const TypeWriter: React.FC<TypeWriterProps> = ({ text, speed = 50 }) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // 重置當文本改變時
    setDisplayText('');
    setCurrentIndex(0);
  }, [text]);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);

      return () => clearTimeout(timer);
    }
  }, [currentIndex, text, speed]);

  return (
    <Text
      whiteSpace="pre-wrap"
      lineHeight="1.8"
      letterSpacing="0.5px"
      color="blue.700"
      fontWeight="600"
      fontSize="16px"
    >
      {displayText}
    </Text>
  );
};

export default TypeWriter;
