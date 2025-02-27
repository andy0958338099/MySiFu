import React, { useState, useEffect } from 'react';
import {
  ChakraProvider,
  Flex,
  Box,
  Text,
  Button,
  Stack,
  FormControl,
  FormLabel,
  Input,
  Select,
  Checkbox,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  useToast,
  Progress
} from '@chakra-ui/react';
import {
  Robot as IconRobot,
  BrandYoutube as IconBrandYoutube,
  Map as IconMap,
  ChevronUp as IconChevronUp,
  ChevronDown as IconChevronDown
} from 'tabler-icons-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { kStyleGlobal } from '../theme/theme';

const AdminScreen: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();
  
  // 狀態管理
  const [lastUpdateTime, setLastUpdateTime] = useState<string>("2024-01-10 15:30");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [chatbotExpanded, setChatbotExpanded] = useState<boolean>(true);
  const [youtubeExpanded, setYoutubeExpanded] = useState<boolean>(false);
  const [mapsExpanded, setMapsExpanded] = useState<boolean>(false);
  
  // API 設定
  const [chatbotApiKey, setChatbotApiKey] = useState<string>("sk-itosKfcHEAlse5TYEB2BTUBSMtNO6jAvAykWAgeBjBxlDjJR");
  const [chatbotApiUrl, setChatbotApiUrl] = useState<string>("https://tbnx.plus7.plus/v1/chat/completions");
  const [chatbotModel, setChatbotModel] = useState<string>("deepseek-reasoner");
  const [youtubeApiKey, setYoutubeApiKey] = useState<string>("");
  const [youtubeQuota, setYoutubeQuota] = useState<number>(10000);
  const [mapsApiKey, setMapsApiKey] = useState<string>("");
  const [mapsFeatures, setMapsFeatures] = useState({
    directions: true,
    places: true,
    geocoding: false,
    staticMaps: true
  });
  
  // 使用量數據
  const usageData = [30, 40, 35, 50, 49, 60, 70];
  const categories = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  
  // 檢查管理員權限並加載保存的設定
  useEffect(() => {
    // 檢查管理員權限
    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    if (!isAdmin) {
      toast({
        title: "權限不足",
        description: "您需要管理員權限才能訪問此頁面",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      navigate('/login');
      return;
    }
    
    // 加載保存的設定
    const savedChatbotApiKey = localStorage.getItem('chatbotApiKey');
    const savedChatbotApiUrl = localStorage.getItem('chatbotApiUrl');
    const savedChatbotModel = localStorage.getItem('chatbotModel');
    const savedYoutubeApiKey = localStorage.getItem('youtubeApiKey');
    const savedMapsApiKey = localStorage.getItem('mapsApiKey');
    const savedMapsFeatures = localStorage.getItem('mapsFeatures');
    
    if (savedChatbotApiKey) setChatbotApiKey(savedChatbotApiKey);
    if (savedChatbotApiUrl) setChatbotApiUrl(savedChatbotApiUrl);
    if (savedChatbotModel) setChatbotModel(savedChatbotModel);
    if (savedYoutubeApiKey) setYoutubeApiKey(savedYoutubeApiKey);
    if (savedMapsApiKey) setMapsApiKey(savedMapsApiKey);
    if (savedMapsFeatures) {
      try {
        setMapsFeatures(JSON.parse(savedMapsFeatures));
      } catch (e) {
        console.error('Error parsing saved maps features:', e);
      }
    }
  }, [navigate, toast]);
  
  // 保存所有設定
  const handleSave = () => {
    setIsLoading(true);
    
    // 模擬保存操作
    setTimeout(() => {
      setIsLoading(false);
      setLastUpdateTime(new Date().toLocaleString());
      
      // 保存到本地存儲
      localStorage.setItem('chatbotApiKey', chatbotApiKey);
      localStorage.setItem('chatbotApiUrl', chatbotApiUrl);
      localStorage.setItem('chatbotModel', chatbotModel);
      localStorage.setItem('youtubeApiKey', youtubeApiKey);
      localStorage.setItem('mapsApiKey', mapsApiKey);
      localStorage.setItem('mapsFeatures', JSON.stringify(mapsFeatures));
      
      // 顯示成功提示
      toast({
        title: "設定已保存",
        description: "所有API設定已成功更新",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      
      // 顯示成功動畫
      toast({
        title: "🎉 更新成功",
        status: "success",
        duration: 2000,
        isClosable: true,
        position: "top"
      });
    }, 1500);
  };
  
  // 測試YouTube連接
  const testYoutubeConnection = () => {
    setIsLoading(true);
    
    // 模擬API測試
    setTimeout(() => {
      setIsLoading(false);
      
      if (youtubeApiKey) {
        toast({
          title: "連接成功",
          description: "YouTube API連接測試通過",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        toast({
          title: "連接失敗",
          description: "請輸入有效的API密鑰",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    }, 2000);
  };
  
  // 更新地圖功能
  const updateMapFeature = (feature: string, value: boolean) => {
    setMapsFeatures(prev => ({
      ...prev,
      [feature]: value
    }));
  };
  
  // 簡易圖表元件
  const SimpleChart = ({ data }: { data: number[] }) => {
    const max = Math.max(...data);
    
    return (
      <Box>
        <Flex h="150px" align="flex-end" gap={2}>
          {data.map((value, index) => (
            <Flex 
              key={index} 
              direction="column" 
              align="center" 
              flex={1}
            >
              <Box 
                h={`${(value / max) * 100}%`} 
                w="100%" 
                bg="blue.400" 
                borderRadius="md"
              />
              <Text fontSize="xs" mt={1} color="gray.500">
                {categories[index]}
              </Text>
            </Flex>
          ))}
        </Flex>
      </Box>
    );
  };
  
  return (
    <ChakraProvider theme={kStyleGlobal}>
      <Flex
        direction="column"
        bg="gray.50"
        minH="100vh"
        p={6}
        gap={6}
      >
        <Flex
          justify="space-between"
          align="center"
          mb={6}
        >
          <Text
            fontSize="2xl"
            fontWeight="bold"
          >
            API 元件管理
          </Text>
          <Text
            color="gray.500"
          >
            上次更新: {lastUpdateTime}
          </Text>
        </Flex>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Accordion allowToggle>
            <AccordionItem>
              <AccordionButton
                onClick={() => setChatbotExpanded(!chatbotExpanded)}
              >
                <Flex
                  flex={1}
                  align="center"
                  gap={2}
                >
                  <IconRobot size={24} />
                  <Text>聊天機器人 API 設置</Text>
                </Flex>
                {chatbotExpanded ? (
                  <IconChevronUp size={24} />
                ) : (
                  <IconChevronDown size={24} />
                )}
              </AccordionButton>
              <AccordionPanel>
                <Stack spacing={4}>
                  <FormControl>
                    <FormLabel>API KEY</FormLabel>
                    <Input
                      type="password"
                      value={chatbotApiKey}
                      onChange={(e) => setChatbotApiKey(e.target.value)}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>API URL</FormLabel>
                    <Input
                      value={chatbotApiUrl}
                      onChange={(e) => setChatbotApiUrl(e.target.value)}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>模型選擇</FormLabel>
                    <Select
                      value={chatbotModel}
                      onChange={(e) => setChatbotModel(e.target.value)}
                    >
                      <option value="deepseek-reasoner">DeepSeek Reasoner</option>
                      <option value="gpt-4">GPT-4</option>
                      <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                    </Select>
                  </FormControl>
                </Stack>
              </AccordionPanel>
            </AccordionItem>
            
            <AccordionItem>
              <AccordionButton
                onClick={() => setYoutubeExpanded(!youtubeExpanded)}
              >
                <Flex
                  flex={1}
                  align="center"
                  gap={2}
                >
                  <IconBrandYoutube size={24} />
                  <Text>YouTube Data API 設置</Text>
                </Flex>
                {youtubeExpanded ? (
                  <IconChevronUp size={24} />
                ) : (
                  <IconChevronDown size={24} />
                )}
              </AccordionButton>
              <AccordionPanel>
                <Stack spacing={4}>
                  <FormControl>
                    <FormLabel>API 密鑰</FormLabel>
                    <Input
                      type="password"
                      value={youtubeApiKey}
                      onChange={(e) => setYoutubeApiKey(e.target.value)}
                    />
                  </FormControl>
                  <Flex
                    justify="space-between"
                    align="center"
                  >
                    <Text color="gray.600">
                      每日配額: {youtubeQuota}
                    </Text>
                    <Button
                      onClick={testYoutubeConnection}
                      isLoading={isLoading}
                    >
                      測試連接
                    </Button>
                  </Flex>
                </Stack>
              </AccordionPanel>
            </AccordionItem>
            
            <AccordionItem>
              <AccordionButton
                onClick={() => setMapsExpanded(!mapsExpanded)}
              >
                <Flex
                  flex={1}
                  align="center"
                  gap={2}
                >
                  <IconMap size={24} />
                  <Text>Google Maps API 設置</Text>
                </Flex>
                {mapsExpanded ? (
                  <IconChevronUp size={24} />
                ) : (
                  <IconChevronDown size={24} />
                )}
              </AccordionButton>
              <AccordionPanel>
                <Stack spacing={4}>
                  <FormControl>
                    <FormLabel>API 密鑰</FormLabel>
                    <Input
                      type="password"
                      value={mapsApiKey}
                      onChange={(e) => setMapsApiKey(e.target.value)}
                    />
                  </FormControl>
                  <Box>
                    <Text
                      fontWeight="bold"
                      mb={2}
                    >
                      已啟用的功能
                    </Text>
                    <Stack spacing={2}>
                      <Checkbox
                        isChecked={mapsFeatures.directions}
                        onChange={(e) => updateMapFeature('directions', e.target.checked)}
                      >
                        路線規劃
                      </Checkbox>
                      <Checkbox
                        isChecked={mapsFeatures.places}
                        onChange={(e) => updateMapFeature('places', e.target.checked)}
                      >
                        地點搜尋
                      </Checkbox>
                      <Checkbox
                        isChecked={mapsFeatures.geocoding}
                        onChange={(e) => updateMapFeature('geocoding', e.target.checked)}
                      >
                        地理編碼
                      </Checkbox>
                      <Checkbox
                        isChecked={mapsFeatures.staticMaps}
                        onChange={(e) => updateMapFeature('staticMaps', e.target.checked)}
                      >
                        靜態地圖
                      </Checkbox>
                    </Stack>
                  </Box>
                  <Box mt={4}>
                    <Text
                      fontWeight="bold"
                      mb={4}
                    >
                      使用量統計
                    </Text>
                    <SimpleChart data={usageData} />
                  </Box>
                </Stack>
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
        </motion.div>
        
        <Flex
          justify="center"
          mt={6}
        >
          <Button
            size="lg"
            colorScheme="blue"
            onClick={handleSave}
            isLoading={isLoading}
          >
            全部保存
          </Button>
        </Flex>
      </Flex>
    </ChakraProvider>
  );
};

export default AdminScreen;
