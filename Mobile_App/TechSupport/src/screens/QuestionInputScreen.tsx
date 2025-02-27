import React, { useState } from 'react';
import {
  Flex,
  Box,
  Button,
  Text,
  Textarea,
  RadioGroup,
  Radio,
  useToast
} from '@chakra-ui/react';
import {
  ArrowLeft as IconArrowLeft,
  Microphone as IconMicrophone,
  Star as IconStar,
  Clock as IconClock,
  QuestionMark as IconQuestionMark
} from 'tabler-icons-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { kStyleGlobal } from '../theme/theme';

interface LocationState {
  initialQuestion?: string;
}

const QuestionInputScreen: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const { initialQuestion } = (location.state as LocationState) || {};

  const [question, setQuestion] = useState(initialQuestion || '');
  const [selectedCategory, setSelectedCategory] = useState('居家水電');
  const categories = ['居家水電', '家庭作業', '其他類別'];
  const commonQuestions = [
    '馬桶堵塞如何處理？',
    '數學作業解題技巧',
    '如何選擇適合的維修工具？'
  ];

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleStartAnswer = () => {
    if (!question.trim()) {
      toast({
        title: '請輸入問題',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    // 導航到問題解答頁面
    navigate('/answer', {
      state: {
        question,
        category: selectedCategory
      }
    });
  };

  const handleSelectCommonQuestion = (q: string) => {
    setQuestion(q);
  };

  return (
    <Flex
      direction="column"
      bg="gray.50"
      minH="100vh"
    >
      <Box
        bg="white"
        p={4}
        borderBottomWidth="1px"
        borderColor="gray.100"
      >
        <Flex
          align="center"
          gap={3}
        >
          <IconArrowLeft
            size={24}
            color="gray.700"
            onClick={handleGoBack}
            style={{ cursor: 'pointer' }}
          />
          <Text
            fontSize="22px"
            fontWeight="600"
            color="gray.900"
          >
            輸入您的問題
          </Text>
        </Flex>
      </Box>
      <Flex
        direction="column"
        p={4}
        gap={6}
      >
        <Box
          bg="white"
          p={6}
          borderRadius="xl"
          shadow="sm"
        >
          <Text
            fontSize="15px"
            color="gray.600"
            mb="12px"
          >
            請詳細描述您的問題，以獲得最準確的解答
          </Text>
          <Textarea
            placeholder="例如：如何修理漏水的水龍頭？"
            height="180px"
            bg="gray.50"
            border="none"
            borderRadius="lg"
            p={4}
            _focus={{
              bg: "gray.50",
              boxShadow: "none"
            }}
            maxLength={500}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
          <Flex
            justify="flex-end"
            mt={2}
          >
            <Text
              fontSize="13px"
              color="gray.500"
            >
              {question.length}/500字
            </Text>
          </Flex>
        </Box>
        <Box
          bg="white"
          p={6}
          borderRadius="xl"
          shadow="sm"
        >
          <Text
            fontSize="17px"
            fontWeight="600"
            mb="16px"
          >
            選擇問題類別
          </Text>
          <RadioGroup
            value={selectedCategory}
            onChange={setSelectedCategory}
          >
            <Flex
              wrap="wrap"
              gap={4}
            >
              {categories.map(category => (
                <Radio
                  key={category}
                  value={category}
                  borderColor="gray.300"
                >
                  <Text fontSize="15px">{category}</Text>
                </Radio>
              ))}
            </Flex>
          </RadioGroup>
        </Box>
        <Box
          bg="white"
          p={6}
          borderRadius="xl"
          shadow="sm"
        >
          <Text
            fontSize="17px"
            fontWeight="600"
            mb="16px"
          >
            快捷功能
          </Text>
          <Flex
            gap={3}
            wrap="wrap"
          >
            <Button
              leftIcon={<IconMicrophone />}
              bg="gray.50"
              color="gray.700"
              size="md"
              px={6}
              _hover={{
                bg: "gray.100"
              }}
            >
              語音輸入
            </Button>
            <Button
              leftIcon={<IconStar />}
              bg="gray.50"
              color="gray.700"
              size="md"
              px={6}
              _hover={{
                bg: "gray.100"
              }}
            >
              熱門問題
            </Button>
            <Button
              leftIcon={<IconClock />}
              bg="gray.50"
              color="gray.700"
              size="md"
              px={6}
              _hover={{
                bg: "gray.100"
              }}
            >
              歷史記錄
            </Button>
          </Flex>
        </Box>
        <Box
          bg="white"
          p={6}
          borderRadius="xl"
          shadow="sm"
        >
          <Text
            fontSize="17px"
            fontWeight="600"
            mb="16px"
          >
            常見問題
          </Text>
          <Flex
            direction="column"
            gap={3}
          >
            {commonQuestions.map((q, i) => (
              <Flex
                key={i}
                align="center"
                p={4}
                bg="gray.50"
                borderRadius="lg"
                cursor="pointer"
                transition="all 0.2s"
                _hover={{
                  bg: "gray.100"
                }}
                onClick={() => handleSelectCommonQuestion(q)}
              >
                <IconQuestionMark
                  size={20}
                  style={{
                    marginRight: "12px",
                    color: kStyleGlobal.colors.primary[500]
                  }}
                />
                <Text
                  fontSize="15px"
                  color="gray.700"
                >
                  {q}
                </Text>
              </Flex>
            ))}
          </Flex>
        </Box>
      </Flex>
      <Box
        position="sticky"
        bottom={0}
        p={4}
        bg="white"
        borderTopWidth="1px"
        borderColor="gray.100"
      >
        <Button
          size="lg"
          w="100%"
          bg="black"
          color="white"
          h="56px"
          fontSize="17px"
          fontWeight="600"
          _hover={{
            bg: "gray.800"
          }}
          onClick={handleStartAnswer}
        >
          開始解答
        </Button>
      </Box>
    </Flex>
  );
};

export default QuestionInputScreen;
