import React, { useState, useEffect, useCallback } from 'react';
import {
  Flex,
  Box,
  Button,
  Text,
  Avatar,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Select,
  useDisclosure,
  Spinner,
  useToast,
  HStack,
  Tag,
  TagLabel,
  TagLeftIcon,
  UnorderedList,
  ListItem,
  Grid
} from '@chakra-ui/react';
import {
  ArrowLeft as IconArrowLeft,
  Adjustments as IconAdjustments,
  Code as IconCode,
  Businessplan as IconBusinessplan,
  Stethoscope as IconStethoscope,
  School as IconSchool,
  Puzzle as IconPuzzle,
  Bulb as IconBulb,
  Video as IconVideo
} from 'tabler-icons-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { generateAnswer } from '../services/chatService';

interface LocationState {
  question?: string;
  category?: string;
}

const QuestionAnswerScreen: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  const { question, category: initialCategory } = (location.state as LocationState) || {};
  
  const [selectedCategory, setSelectedCategory] = useState(initialCategory || '技術');
  const [answer, setAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [videoLinks, setVideoLinks] = useState<{title: string, videoId: string}[]>([]);
  
  const categories = [
    { icon: 'code', label: '技術' },
    { icon: 'businessplan', label: '商業' },
    { icon: 'stethoscope', label: '醫療' },
    { icon: 'school', label: '教育' },
    { icon: 'puzzle', label: '生活' },
    { icon: 'bulb', label: '創意' }
  ];
  
  const experts = [
    {
      name: '張教授',
      specialty: '技術專家',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    },
    {
      name: '李博士',
      specialty: '商業顧問',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    },
    {
      name: '王醫生',
      specialty: '醫療專家',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    }
  ];
  
  const handleGoBack = () => {
    navigate(-1);
  };
  
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    
    // 如果已經有問題，則重新生成答案
    if (question) {
      fetchAnswer(question, category);
    }
  };
  
  // 模擬獲取相關YouTube影片
  const fetchRelatedVideos = useCallback(async (q: string, cat: string) => {
    // 在實際應用中，這裡應該調用YouTube API或後端服務來獲取相關影片
    // 現在我們使用模擬數據
    
    try {
      // 根據問題和類別生成模擬影片數據
      const mockVideos = [
        {
          title: `${cat}相關: ${q.substring(0, 20)}...`,
          videoId: 'dQw4w9WgXcQ' // 示例YouTube影片ID
        },
        {
          title: `${cat}進階: ${q.substring(0, 15)}...`,
          videoId: 'jNQXAC9IVRw' // 示例YouTube影片ID
        }
      ];
      
      setVideoLinks(mockVideos);
    } catch (error) {
      console.error('Error fetching videos:', error);
    }
  }, []);
  
  const fetchAnswer = useCallback(async (q: string, cat: string) => {
    if (!q) {
      toast({
        title: '請輸入問題',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    setIsLoading(true);
    try {
      const result = await generateAnswer(q, cat);
      setAnswer(result);
      
      // 同時獲取相關影片
      fetchRelatedVideos(q, cat);
    } catch (error) {
      console.error('Error fetching answer:', error);
      toast({
        title: '獲取答案失敗',
        description: '請稍後再試',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast, fetchRelatedVideos]);
  
  // 將答案轉換為條列式
  const formatAnswer = (text: string) => {
    if (!text) return [];
    
    // 簡單的分段處理，每段作為一個要點
    const paragraphs = text.split('\n\n').filter(p => p.trim().length > 0);
    
    // 如果沒有明顯的段落，嘗試按句子分割
    if (paragraphs.length <= 1) {
      const sentences = text.split(/[.!?。！？]/).filter(s => s.trim().length > 0);
      return sentences.map(s => s.trim());
    }
    
    return paragraphs.map(p => p.trim());
  };

  // 初始加載時獲取答案
  useEffect(() => {
    if (question) {
      fetchAnswer(question, selectedCategory);
    }
  }, [question, selectedCategory, fetchAnswer]);
  
  const renderCategoryIcon = (icon: string) => {
    switch (icon) {
      case 'code':
        return <IconCode size={24} />;
      case 'businessplan':
        return <IconBusinessplan size={24} />;
      case 'stethoscope':
        return <IconStethoscope size={24} />;
      case 'school':
        return <IconSchool size={24} />;
      case 'puzzle':
        return <IconPuzzle size={24} />;
      case 'bulb':
        return <IconBulb size={24} />;
      default:
        return null;
    }
  };
  
  const handleExpertConsultation = (expert: any) => {
    navigate('/consultation-request', {
      state: {
        question: question,
        category: selectedCategory,
        expertName: expert.name,
        expertSpecialty: expert.specialty,
        expertImage: expert.image
      }
    });
  };
  
  return (
    <Flex
      direction="column"
      h="100vh"
      bg="gray.50"
    >
      <Flex
        justify="space-between"
        align="center"
        p={4}
        bg="white"
        borderBottomWidth="1px"
        borderColor="gray.100"
        position="sticky"
        top={0}
        zIndex={10}
      >
        <Button
          variant="ghost"
          onClick={handleGoBack}
        >
          <IconArrowLeft size={24} />
        </Button>
        <Text
          fontSize="20px"
          fontWeight="600"
        >
          問題解答
        </Text>
        <Button
          variant="ghost"
          onClick={onOpen}
        >
          <IconAdjustments size={24} />
        </Button>
      </Flex>
      
      <Box
        flex={1}
        overflowY="auto"
      >
        <Flex
          direction="column"
          gap={6}
          p={4}
        >
          <Box>
            <Text fontSize="16px" fontWeight="600" mb={2}>問題類別</Text>
            <HStack spacing={2} overflowX="auto" py={1}>
              {categories.map(item => (
                <Tag 
                  key={item.label}
                  size="lg"
                  variant="subtle"
                  colorScheme={selectedCategory === item.label ? "blue" : "gray"}
                  cursor="pointer"
                  onClick={() => handleCategoryChange(item.label)}
                >
                  <TagLeftIcon as={() => renderCategoryIcon(item.icon)} />
                  <TagLabel>{item.label}</TagLabel>
                </Tag>
              ))}
            </HStack>
          </Box>
          
          {question && (
            <Box
              bg="white"
              p={4}
              borderRadius="xl"
              shadow="sm"
            >
              <Text
                fontSize="16px"
                fontWeight="600"
                mb="8px"
              >
                您的問題
              </Text>
              <Box
                p={3}
                bg="gray.50"
                borderRadius="lg"
                fontSize="15px"
              >
                {question}
              </Box>
            </Box>
          )}
          
          <Box
            bg="white"
            p={4}
            borderRadius="xl"
            shadow="sm"
          >
            <Text
              fontSize="16px"
              fontWeight="600"
              mb="8px"
            >
              解答重點
            </Text>
            {isLoading ? (
              <Flex
                justify="center"
                align="center"
                minHeight="100px"
                p={4}
                bg="gray.50"
                borderRadius="lg"
              >
                <Spinner color="blue.500" size="lg" />
              </Flex>
            ) : (
              <Box
                p={3}
                bg="gray.50"
                borderRadius="lg"
              >
                <UnorderedList spacing={2}>
                  {formatAnswer(answer).map((point, index) => (
                    <ListItem key={index}>{point}</ListItem>
                  ))}
                </UnorderedList>
                {!answer && <Text color="gray.500">AI將為您提供簡潔的要點解答...</Text>}
              </Box>
            )}
          </Box>
          
          <Box
            bg="white"
            borderRadius="xl"
            p={4}
            shadow="sm"
          >
            <Text
              fontSize="16px"
              fontWeight="600"
              mb="8px"
            >
              影片解說
            </Text>
            <Grid
              templateColumns="repeat(2, 1fr)"
              gap={4}
            >
              {videoLinks.length > 0 ? (
                videoLinks.map((video, index) => (
                  <Box
                    key={index}
                    borderRadius="lg"
                    overflow="hidden"
                  >
                    <Box
                      as="iframe"
                      src={`https://www.youtube.com/embed/${video.videoId}`}
                      width="100%"
                      height="160px"
                      borderRadius="lg"
                      allowFullScreen
                      title={video.title}
                    />
                    <Text
                      mt={2}
                      fontSize="14px"
                      fontWeight="500"
                      noOfLines={2}
                    >
                      {video.title}
                    </Text>
                  </Box>
                ))
              ) : (
                <>
                  <Box
                    bg="gray.100"
                    h="160px"
                    borderRadius="lg"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <IconVideo size={40} />
                  </Box>
                  <Box
                    bg="gray.100"
                    h="160px"
                    borderRadius="lg"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <IconVideo size={40} />
                  </Box>
                </>
              )}
            </Grid>
          </Box>
          
          <Box
            bg="white"
            p={4}
            borderRadius="xl"
            shadow="sm"
          >
            <Text
              fontSize="16px"
              fontWeight="600"
              mb="8px"
            >
              專家諮詢
            </Text>
            <Grid
              templateColumns="repeat(3, 1fr)"
              gap={4}
            >
              {experts.map(expert => (
                <Flex
                  key={expert.name}
                  direction="column"
                  align="center"
                  bg="gray.50"
                  p={4}
                  borderRadius="lg"
                  cursor="pointer"
                  _hover={{
                    bg: "gray.100"
                  }}
                  onClick={() => handleExpertConsultation(expert)}
                >
                  <Avatar
                    src={expert.image}
                    size="lg"
                    mb={2}
                  />
                  <Text
                    fontWeight="500"
                    mb="4px"
                  >
                    {expert.name}
                  </Text>
                  <Text
                    fontSize="14px"
                    color="gray.600"
                  >
                    {expert.specialty}
                  </Text>
                </Flex>
              ))}
            </Grid>
          </Box>
        </Flex>
      </Box>
      
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent
          borderRadius="xl"
          p={4}
        >
          <ModalHeader>
            <Text
              fontSize="20px"
              fontWeight="600"
            >
              篩選設置
            </Text>
          </ModalHeader>
          <ModalBody>
            <Flex
              direction="column"
              gap={4}
            >
              <Flex
                direction="column"
                gap={2}
              >
                <Text
                  fontWeight="500"
                >
                  問題難度
                </Text>
                <Select
                  bg="gray.50"
                  borderRadius="lg"
                  h="45px"
                  defaultValue="basic"
                >
                  <option value="basic">基礎</option>
                  <option value="intermediate">進階</option>
                  <option value="advanced">高級</option>
                </Select>
              </Flex>
            </Flex>
          </ModalBody>
          <ModalFooter>
            <Button
              onClick={onClose}
              bg="blue.500"
              color="white"
              w="100%"
              h="45px"
              borderRadius="xl"
              _hover={{
                bg: "blue.600"
              }}
            >
              確認
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
};

export default QuestionAnswerScreen;
