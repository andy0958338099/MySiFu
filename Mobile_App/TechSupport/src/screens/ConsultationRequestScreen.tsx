import React, { useState, useRef, useEffect } from 'react';
import {
  ChakraProvider,
  Flex,
  Box,
  Button,
  Text,
  Avatar,
  Textarea,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Input,
  RadioGroup,
  Stack,
  Radio,
  Checkbox,
  Switch,
  useToast,
  Image,
  IconButton,
  HStack,
  VStack,
  CloseButton,
  Spinner,
} from '@chakra-ui/react';
import {
  ChevronLeft as IconChevronLeft,
  Photo as IconImage,
  FileText as IconFile,
  Star as IconStar,
  ArrowLeft,
  List
} from 'tabler-icons-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { kStyleGlobal } from '../theme/theme';
import { saveConsultation } from '../lib/consultationService';

interface LocationState {
  question?: string;
  category?: string;
  expertName?: string;
  expertSpecialty?: string;
  expertImage?: string;
}

const ConsultationRequestScreen: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  
  const { question, category, expertName, expertSpecialty, expertImage } = (location.state as LocationState) || {};
  
  const [selectedBudget, setSelectedBudget] = useState<number>(500);
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false);
  const [questionText, setQuestionText] = useState<string>(question || '');
  const [charCount, setCharCount] = useState<number>(question?.length || 0);
  const [images, setImages] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [preferredTime, setPreferredTime] = useState<string>('morning');
  const [isGuest, setIsGuest] = useState<boolean>(false);

  const imageInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // 檢查用戶是否為訪客
  useEffect(() => {
    const guestStatus = localStorage.getItem('isGuest') === 'true';
    setIsGuest(guestStatus);
    
    if (guestStatus) {
      toast({
        title: '訪客權限受限',
        description: '訪客模式無法提出諮詢需求，請登入後再試',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
      navigate('/expert-list');
    }
  }, [navigate, toast]);

  const handleQuestionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setQuestionText(text);
    setCharCount(text.length);
  };
  
  const handleBudgetChange = (value: number) => {
    setSelectedBudget(value);
  };
  
  const handleBudgetButtonClick = (amount: number) => {
    setSelectedBudget(amount);
  };
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList) return;
    
    const newImages: string[] = [];
    
    Array.from(fileList).forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            setImages(prev => [...prev, e.target!.result as string]);
          }
        };
        reader.readAsDataURL(file);
      }
    });
    
    // 清空 input 值，以便同一文件可以再次選擇
    if (imageInputRef.current) {
      imageInputRef.current.value = '';
    }
  };
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList) return;
    
    setFiles(prev => [...prev, ...Array.from(fileList)]);
    
    // 清空 input 值，以便同一文件可以再次選擇
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };
  
  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };
  
  const handleSubmit = async () => {
    // 這裡可以添加提交邏輯，包括上傳圖片和文件
    if (questionText.trim() === '') {
      toast({
        title: '請輸入問題描述',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // 創建新的諮詢記錄
      const consultationData = {
        title: questionText.length > 30 ? `${questionText.substring(0, 30)}...` : questionText,
        description: questionText,
        type: '專家諮詢',
        status: '處理中',
        solution_method: expertName ? `專家: ${expertName}` : undefined
      };
      
      // 保存到 Supabase 和 localStorage
      const { data, error } = await saveConsultation(consultationData);
      
      if (error) {
        console.error('Error saving consultation:', error);
        toast({
          title: '提交時出錯',
          description: '請稍後再試',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        setIsSubmitting(false);
        return;
      }
      
      toast({
        title: '請求已提交',
        description: '專家將在24小時內回覆您',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      navigate('/quote-confirmation', { 
        state: { 
          consultationId: Array.isArray(data) ? data[0]?.id : data?.id,
          expertName,
          expertSpecialty,
          expertImage,
          description: questionText,
          category,
          urgency: '一般'
        } 
      });
      
      // For demo purposes, also create a link to the expert view
      // In a real app, this would be a separate flow
      setTimeout(() => {
        toast({
          title: "專家視角演示",
          description: "點擊查看專家如何回應您的請求",
          status: "info",
          duration: 10000,
          isClosable: true,
          position: "bottom-right",
          render: ({ onClose }) => (
            <Box p={3} bg="blue.700" color="white" borderRadius="md" shadow="md">
              <Text fontWeight="bold" mb={2}>專家視角演示</Text>
              <Text mb={3}>點擊查看專家如何回應您的請求</Text>
              <Button 
                size="sm" 
                colorScheme="whiteAlpha" 
                onClick={() => {
                  navigate('/expert-consultation', { 
                    state: { consultationId: Array.isArray(data) ? data[0]?.id : data?.id || "1" } 
                  });
                  onClose();
                }}
              >
                查看專家視角
              </Button>
            </Box>
          )
        });
      }, 2000);
      
    } catch (error) {
      console.error('Error in handleSubmit:', error instanceof Error ? error.message : 'Unknown error');
      toast({
        title: '提交時出錯',
        description: '請稍後再試',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <ChakraProvider theme={kStyleGlobal}>
      <Flex
        direction="column"
        bg="gray.50"
        minH="100vh"
      >
        <Box
          bg="white"
          py={4}
          px={6}
          borderBottom="1px"
          borderColor="gray.100"
        >
          <Flex
            justify="space-between"
            align="center"
          >
            <Flex
              align="center"
              gap={3}
            >
              <Button
                variant="ghost"
                onClick={() => navigate(-1)}
              >
                <IconChevronLeft size={24} />
              </Button>
              <Text
                fontSize="20px"
                fontWeight="600"
              >
                諮詢請求
              </Text>
            </Flex>
            <Button
              variant="ghost"
              onClick={() => navigate('/home')}
            >
              <Text color="gray.600">取消</Text>
            </Button>
          </Flex>
        </Box>
        
        <Flex
          direction="column"
          p={6}
          gap={6}
        >
          <Box
            bg="white"
            p={6}
            borderRadius="xl"
            shadow="sm"
          >
            <Flex align="center" gap={3} mb={4}>
              <Avatar src={expertImage || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"} size="md" />
              <Box>
                <Text fontWeight="bold">{expertName || "王大明"} 專家</Text>
                <Text fontSize="sm" color="gray.500">{expertSpecialty || "心理諮詢 • 職業規劃"}</Text>
              </Box>
              <Button 
                size="sm" 
                variant="outline" 
                ml="auto"
                onClick={() => navigate(`/expert-profile/1`)}
              >
                查看資料
              </Button>
            </Flex>
            <Flex
              gap={4}
              align="center"
              mb={6}
            >
              <Flex
                direction="column"
                gap={2}
                flex={1}
              >
                <Flex
                  align="center"
                  gap={2}
                >
                  <IconStar size={16} color="orange" fill="orange" />
                  <Text fontWeight="500">4.9</Text>
                  <Text color="gray.500">(128則評價)</Text>
                </Flex>
              </Flex>
            </Flex>
          </Box>
          
          <Box
            bg="white"
            p={6}
            borderRadius="xl"
            shadow="sm"
          >
            <Text
              fontSize="16px"
              fontWeight="600"
              mb={4}
            >
              問題描述
            </Text>
            <Textarea
              placeholder="請詳細描述您的問題，以便專家更好地幫助您"
              height="120px"
              bg="gray.50"
              border="none"
              borderRadius="lg"
              p={4}
              mb={2}
              _focus={{
                bg: "gray.100"
              }}
              value={questionText}
              onChange={handleQuestionChange}
              maxLength={500}
            />
            <Flex justify="flex-end">
              <Text
                fontSize="14px"
                color="gray.500"
              >
                {charCount}/500字
              </Text>
            </Flex>
            
            {/* 顯示上傳的圖片 */}
            {images.length > 0 && (
              <Box mt={4}>
                <Text fontWeight="500" mb={2}>已上傳圖片：</Text>
                <Flex flexWrap="wrap" gap={2}>
                  {images.map((src, index) => (
                    <Box key={index} position="relative" width="80px" height="80px">
                      <Image 
                        src={src} 
                        alt={`上傳圖片 ${index + 1}`} 
                        objectFit="cover" 
                        width="100%" 
                        height="100%" 
                        borderRadius="md"
                      />
                      <CloseButton 
                        size="sm" 
                        position="absolute" 
                        top={-2} 
                        right={-2} 
                        bg="red.500" 
                        color="white"
                        onClick={() => removeImage(index)}
                      />
                    </Box>
                  ))}
                </Flex>
              </Box>
            )}
            
            {/* 顯示上傳的文件 */}
            {files.length > 0 && (
              <Box mt={4}>
                <Text fontWeight="500" mb={2}>已上傳文件：</Text>
                <VStack align="stretch" spacing={2}>
                  {files.map((file, index) => (
                    <HStack key={index} p={2} bg="gray.50" borderRadius="md" justify="space-between">
                      <HStack>
                        <IconFile size={16} />
                        <Text fontSize="sm">{file.name}</Text>
                      </HStack>
                      <IconButton
                        aria-label="移除文件"
                        icon={<CloseButton size="sm" />}
                        size="xs"
                        onClick={() => removeFile(index)}
                      />
                    </HStack>
                  ))}
                </VStack>
              </Box>
            )}
            
            <Flex
              gap={3}
              mt={4}
            >
              <input
                type="file"
                accept="image/*"
                multiple
                style={{ display: 'none' }}
                onChange={handleImageUpload}
                ref={imageInputRef}
              />
              <Button
                leftIcon={<IconImage size={18} />}
                variant="outline"
                size="sm"
                borderRadius="full"
                onClick={() => imageInputRef.current?.click()}
              >
                添加圖片
              </Button>
              
              <input
                type="file"
                multiple
                style={{ display: 'none' }}
                onChange={handleFileUpload}
                ref={fileInputRef}
              />
              <Button
                leftIcon={<IconFile size={18} />}
                variant="outline"
                size="sm"
                borderRadius="full"
                onClick={() => fileInputRef.current?.click()}
              >
                添加文件
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
              fontSize="16px"
              fontWeight="600"
              mb={6}
            >
              預算設置
            </Text>
            <Slider
              value={selectedBudget}
              min={100}
              max={3000}
              step={100}
              mb={4}
              onChange={handleBudgetChange}
              colorScheme="blue"
            >
              <SliderTrack>
                <SliderFilledTrack />
              </SliderTrack>
              <SliderThumb boxSize={6} />
            </Slider>
            <Flex
              justify="space-between"
              mb={4}
            >
              <Text color="gray.500">NT$ 100</Text>
              <Text fontWeight="600" color="blue.500">NT$ {selectedBudget}</Text>
              <Text color="gray.500">NT$ 3000</Text>
            </Flex>
            <Flex gap={3} flexWrap="wrap">
              {[300, 500, 1000, 1500, 2000, 3000].map(amount => (
                <Button
                  key={amount}
                  variant={selectedBudget === amount ? "solid" : "outline"}
                  size="sm"
                  borderRadius="full"
                  colorScheme="blue"
                  onClick={() => handleBudgetButtonClick(amount)}
                  mb={2}
                >
                  NT$ {amount}
                </Button>
              ))}
            </Flex>
          </Box>
          
          <Box
            bg="white"
            p={6}
            borderRadius="xl"
            shadow="sm"
          >
            <Text
              fontSize="16px"
              fontWeight="600"
              mb={4}
            >
              時間選擇
            </Text>
            <Flex
              direction="column"
              gap={4}
            >
              <Input
                type="date"
                bg="gray.50"
                border="none"
                borderRadius="lg"
              />
              <RadioGroup
                value={preferredTime}
                onChange={setPreferredTime}
                colorScheme="blue"
              >
                <Stack direction="row">
                  <Radio value="morning" colorScheme="blue">上午</Radio>
                  <Radio value="afternoon" colorScheme="blue">下午</Radio>
                  <Radio value="evening" colorScheme="blue">晚上</Radio>
                </Stack>
              </RadioGroup>
              <Checkbox colorScheme="blue">盡快</Checkbox>
            </Flex>
          </Box>
          
          <Box
            bg="white"
            p={6}
            borderRadius="xl"
            shadow="sm"
          >
            <Flex
              justify="space-between"
              align="center"
            >
              <Flex direction="column">
                <Text
                  fontSize="16px"
                  fontWeight="600"
                >
                  匿名諮詢
                </Text>
                <Text
                  fontSize="14px"
                  color="gray.500"
                  mt={1}
                >
                  開啟後專家將不會看到您的真實信息
                </Text>
              </Flex>
              <Switch
                isChecked={isAnonymous}
                onChange={() => setIsAnonymous(!isAnonymous)}
                colorScheme="blue"
              />
            </Flex>
          </Box>
        </Flex>
        
        <Box
          bg="white"
          p={6}
          borderTop="1px"
          borderColor="gray.100"
          mt="auto"
        >
          <Flex
            mb={4}
            justify="space-between"
            align="center"
          >
            <Button
              variant="ghost"
              leftIcon={<ArrowLeft size={20} />}
              onClick={() => navigate(-1)}
            >
              返回
            </Button>
            <Button
              variant="ghost"
              rightIcon={<List size={20} />}
              onClick={() => navigate('/expert-list')}
            >
              專家列表
            </Button>
          </Flex>
          <Button
            colorScheme="blue"
            size="lg"
            w="full"
            mt={4}
            isLoading={isSubmitting}
            loadingText="提交中..."
            onClick={handleSubmit}
          >
            提交請求
          </Button>
          <Flex gap={2} justifyContent="center" mt={2}>
            <Button
              size="sm"
              variant="outline"
              colorScheme="purple"
              onClick={() => navigate('/expert-consultation?id=demo')}
            >
              查看專家視角
            </Button>
            <Button
              size="sm"
              variant="outline"
              colorScheme="teal"
              onClick={() => navigate('/expert-consultations')}
            >
              查看專家諮詢列表
            </Button>
          </Flex>
          <Text
            fontSize="14px"
            color="gray.500"
            textAlign="center"
            mt={3}
          >
            專家將在24小時內回覆
          </Text>
        </Box>
      </Flex>
    </ChakraProvider>
  );
};

export default ConsultationRequestScreen;
