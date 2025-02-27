import React, { useState, useEffect } from 'react';
import {
  ChakraProvider,
  Box,
  Flex,
  Text,
  Input,
  InputGroup,
  InputLeftElement,
  Button,
  Avatar,
  Badge,
  Stack,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Radio,
  RadioGroup,
  Select,
  RangeSlider,
  RangeSliderTrack,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  useDisclosure,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  CloseButton
} from '@chakra-ui/react';
import {
  ChevronLeft,
  Search,
  Adjustments,
  Star,
  Clock
} from 'tabler-icons-react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';

interface Expert {
  id: string;
  name: string;
  title: string;
  rating: string;
  reviews: string;
  image: string;
  description: string;
  responseTime: string;
  isOnline: boolean;
  category: string;
}

const ExpertListScreen: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  // Get category from URL query parameter
  const queryParams = new URLSearchParams(location.search);
  const categoryFromUrl = queryParams.get('category');
  
  const [selectedFilter, setSelectedFilter] = useState<string>("全部");
  const [selectedLevel, setSelectedLevel] = useState<string>("初級");
  const [selectedSort, setSelectedSort] = useState<string>("評分");
  const [priceRange, setPriceRange] = useState<[number, number]>([200, 800]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>(categoryFromUrl || "全部");
  const [filteredExperts, setFilteredExperts] = useState<Expert[]>([]);
  const [isGuest, setIsGuest] = useState<boolean>(false);
  const [showGuestAlert, setShowGuestAlert] = useState<boolean>(false);

  // Sample expert data
  const experts: Expert[] = [
    // 技術專家
    {
      id: "1",
      name: "王教授",
      title: "人工智能與機器學習專家",
      rating: "4.9",
      reviews: "328",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
      description: "專注於機器學習算法研究，擁有15年產業經驗。曾任職於多家知名科技公司，現任大學教授。",
      responseTime: "30分鐘",
      isOnline: true,
      category: "技術"
    },
    {
      id: "2",
      name: "李博士",
      title: "數據科學專家",
      rating: "4.8",
      reviews: "256",
      image: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5",
      description: "擅長大數據分析與預測模型建立，具有豐富的企業咨詢經驗。",
      responseTime: "45分鐘",
      isOnline: true,
      category: "商業"
    },
    {
      id: "3",
      name: "張教授",
      title: "深度學習研究員",
      rating: "4.7",
      reviews: "198",
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7",
      description: "專精於電腦視覺與自然語言處理，參與多個國際研究項目。",
      responseTime: "25分鐘",
      isOnline: false,
      category: "技術"
    },
    {
      id: "4",
      name: "陳師傅",
      title: "資深水電維修專家",
      rating: "4.9",
      reviews: "412",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
      description: "擁有25年水電維修經驗，專精於各類家庭水電問題診斷與修復。",
      responseTime: "15分鐘",
      isOnline: true,
      category: "居家水電"
    },
    {
      id: "5",
      name: "林師傅",
      title: "水管漏水專家",
      rating: "4.7",
      reviews: "287",
      image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d",
      description: "專門處理複雜水管漏水問題，擅長非侵入性檢測與修復技術。",
      responseTime: "20分鐘",
      isOnline: true,
      category: "居家水電"
    },
    {
      id: "6",
      name: "黃技師",
      title: "電路系統專家",
      rating: "4.8",
      reviews: "176",
      image: "https://images.unsplash.com/photo-1542909168-82c3e7fdca5c",
      description: "專精於家庭與商業電路系統診斷、維修與升級，持有高級電工證照。",
      responseTime: "30分鐘",
      isOnline: false,
      category: "居家水電"
    },
    // 商業專家
    {
      id: "7",
      name: "周顧問",
      title: "企業戰略顧問",
      rating: "4.9",
      reviews: "342",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a",
      description: "前跨國企業高管，擅長企業轉型、市場擴張策略與投資分析。",
      responseTime: "35分鐘",
      isOnline: true,
      category: "商業"
    },
    {
      id: "8",
      name: "吳經理",
      title: "行銷與品牌專家",
      rating: "4.8",
      reviews: "215",
      image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e",
      description: "擁有15年品牌行銷經驗，專注於數位行銷策略與品牌建設。",
      responseTime: "25分鐘",
      isOnline: true,
      category: "商業"
    },
    {
      id: "9",
      name: "趙分析師",
      title: "財務分析專家",
      rating: "4.7",
      reviews: "189",
      image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f",
      description: "特許金融分析師，專精於投資組合管理、風險評估與財務規劃。",
      responseTime: "40分鐘",
      isOnline: false,
      category: "商業"
    },
    // 醫療專家
    {
      id: "10",
      name: "楊醫師",
      title: "家庭醫學專科醫師",
      rating: "4.9",
      reviews: "456",
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2",
      description: "擁有20年臨床經驗，專注於家庭健康管理與慢性疾病預防。",
      responseTime: "30分鐘",
      isOnline: true,
      category: "醫療"
    },
    {
      id: "11",
      name: "林營養師",
      title: "臨床營養專家",
      rating: "4.8",
      reviews: "267",
      image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f",
      description: "專精於營養評估、飲食規劃與慢性疾病的營養管理。",
      responseTime: "25分鐘",
      isOnline: true,
      category: "醫療"
    },
    {
      id: "12",
      name: "陳心理師",
      title: "臨床心理專家",
      rating: "4.9",
      reviews: "312",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2",
      description: "擁有豐富的心理諮詢經驗，專注於壓力管理、情緒調節與人際關係。",
      responseTime: "35分鐘",
      isOnline: false,
      category: "醫療"
    },
    // 教育專家
    {
      id: "13",
      name: "劉教授",
      title: "教育心理學專家",
      rating: "4.8",
      reviews: "289",
      image: "https://images.unsplash.com/photo-1580894732444-8ecded7900cd",
      description: "研究學習動機與教學方法，擅長個性化學習策略設計。",
      responseTime: "40分鐘",
      isOnline: true,
      category: "教育"
    },
    {
      id: "14",
      name: "張老師",
      title: "資優教育顧問",
      rating: "4.7",
      reviews: "176",
      image: "https://images.unsplash.com/photo-1544717305-2782549b5136",
      description: "專注於資優兒童教育與潛能開發，提供個性化學習計劃。",
      responseTime: "30分鐘",
      isOnline: true,
      category: "教育"
    },
    {
      id: "15",
      name: "王輔導員",
      title: "學習障礙專家",
      rating: "4.9",
      reviews: "234",
      image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04",
      description: "專精於學習障礙診斷與輔導，提供個性化學習支持策略。",
      responseTime: "25分鐘",
      isOnline: false,
      category: "教育"
    },
    // 生活專家
    {
      id: "16",
      name: "李顧問",
      title: "生活整理專家",
      rating: "4.8",
      reviews: "345",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
      description: "專精於空間整理與生活效率提升，提供實用的家居整理方案。",
      responseTime: "20分鐘",
      isOnline: true,
      category: "生活"
    },
    {
      id: "17",
      name: "陳廚師",
      title: "家庭烹飪顧問",
      rating: "4.9",
      reviews: "412",
      image: "https://images.unsplash.com/photo-1566554273541-37a9ca77b91f",
      description: "專業廚師，擅長教授簡易家常菜與健康飲食規劃。",
      responseTime: "30分鐘",
      isOnline: true,
      category: "生活"
    },
    {
      id: "18",
      name: "黃教練",
      title: "健身與健康顧問",
      rating: "4.7",
      reviews: "267",
      image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438",
      description: "專業健身教練，提供個性化運動計劃與健康生活指導。",
      responseTime: "25分鐘",
      isOnline: false,
      category: "生活"
    },
    // 創意專家
    {
      id: "19",
      name: "吳設計師",
      title: "平面設計專家",
      rating: "4.9",
      reviews: "378",
      image: "https://images.unsplash.com/photo-1573497019236-61938a5c8acb",
      description: "擁有豐富的品牌視覺設計經驗，專注於品牌識別與包裝設計。",
      responseTime: "35分鐘",
      isOnline: true,
      category: "創意"
    },
    {
      id: "20",
      name: "林攝影師",
      title: "商業攝影顧問",
      rating: "4.8",
      reviews: "256",
      image: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604",
      description: "專業產品與人像攝影師，提供攝影技巧與設備選購建議。",
      responseTime: "30分鐘",
      isOnline: true,
      category: "創意"
    },
    {
      id: "21",
      name: "張導演",
      title: "影片製作專家",
      rating: "4.7",
      reviews: "189",
      image: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce",
      description: "專精於短視頻製作與剪輯，提供內容創作與製作技巧指導。",
      responseTime: "40分鐘",
      isOnline: false,
      category: "創意"
    },
    // 居家水電專家 (已有3位，再增加1位)
    {
      id: "22",
      name: "劉工程師",
      title: "智能家居系統專家",
      rating: "4.9",
      reviews: "198",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
      description: "專精於智能家居系統安裝與整合，提供家庭自動化解決方案。",
      responseTime: "35分鐘",
      isOnline: true,
      category: "居家水電"
    }
  ];

  // Filter categories
  const filterCategories = ["全部", "評分最高", "回覆最快", "價格最低", "諮詢次數最多"];
  
  // Expert categories
  const expertCategories = ["全部", "技術", "商業", "醫療", "教育", "生活", "創意", "居家水電"];
  
  // Expert level options
  const expertLevels = ["初級", "中級", "高級"];
  
  // Sort options
  const sortOptions = ["評分", "價格", "回覆速度"];

  // Handle expert card click
  const handleExpertClick = (expertId: string) => {
    navigate(`/expert-profile/${expertId}`);
  };

  // Handle consultation button click
  const handleConsultationClick = (e: React.MouseEvent, expertId: string) => {
    e.stopPropagation();
    if (isGuest) {
      // 訪客模式下提示用戶登入
      navigate('/login', { 
        state: { 
          message: '請登入後再提出諮詢需求' 
        } 
      });
      return;
    }
    navigate(`/consultation-request?expert=${expertId}`);
  };

  // Animation variants for cards
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut"
      }
    })
  };

  useEffect(() => {
    // 檢查用戶是否為訪客
    const guestStatus = localStorage.getItem('isGuest') === 'true';
    setIsGuest(guestStatus);
    setShowGuestAlert(guestStatus);
  }, []);

  useEffect(() => {
    // 從 URL 參數中獲取類別
    const params = new URLSearchParams(location.search);
    const categoryParam = params.get('category');
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [location]);

  useEffect(() => {
    // 根據搜索和類別過濾專家
    let result = experts;
    
    if (selectedCategory) {
      result = result.filter(expert => expert.category === selectedCategory);
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(expert => 
        expert.name.toLowerCase().includes(query) || 
        expert.title.toLowerCase().includes(query) || 
        expert.description.toLowerCase().includes(query)
      );
    }
    
    setFilteredExperts(result);
  }, [searchQuery, selectedCategory]);

  return (
    <Flex
      direction="column"
      bg="gray.50"
      minH="100vh"
    >
      {/* Header Section */}
      <Box
        bg="white"
        p={4}
        borderBottomWidth="1px"
        borderColor="gray.100"
        position="sticky"
        top={0}
        zIndex={10}
      >
        <Flex
          justifyContent="space-between"
          alignItems="center"
          mb={4}
        >
          <Flex
            alignItems="center"
            gap={3}
          >
            <IconButton
              aria-label="Back"
              variant="ghost"
              icon={<ChevronLeft size={24} />}
              onClick={() => navigate(-1)}
            />
            <Text
              fontSize="22px"
              fontWeight="bold"
            >
              專家列表
            </Text>
          </Flex>
          <IconButton
            aria-label="Filter"
            variant="ghost"
            icon={<Adjustments size={22} />}
            onClick={onOpen}
          />
        </Flex>

        {/* Search Bar */}
        <InputGroup mb={4}>
          <InputLeftElement
            pointerEvents="none"
            pl={4}
          >
            <Search
              size={20}
              color="gray.400"
            />
          </InputLeftElement>
          <Input
            placeholder="搜索專家"
            pl={12}
            bg="gray.50"
            border="none"
            borderRadius="xl"
            h="45px"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </InputGroup>

        {/* Filter Categories */}
        <Flex
          overflowX="auto"
          css={{
            scrollbarWidth: "none",
            "&::-webkit-scrollbar": {
              display: "none"
            }
          }}
        >
          <Flex
            gap={3}
            pb={2}
          >
            {filterCategories.map((filter) => (
              <Button
                key={filter}
                bg={filter === selectedFilter ? "black" : "white"}
                color={filter === selectedFilter ? "white" : "gray.600"}
                px={6}
                py={2}
                borderRadius="full"
                fontSize="sm"
                fontWeight="medium"
                boxShadow="sm"
                _hover={{
                  transform: "translateY(-1px)"
                }}
                transition="all 0.2s"
                onClick={() => setSelectedFilter(filter)}
              >
                {filter}
              </Button>
            ))}
          </Flex>
        </Flex>
        
        {/* Expert Categories */}
        <Flex
          overflowX="auto"
          mt={3}
          css={{
            scrollbarWidth: "none",
            "&::-webkit-scrollbar": {
              display: "none"
            }
          }}
        >
          <Flex
            gap={3}
            pb={2}
          >
            {expertCategories.map((category) => (
              <Button
                key={category}
                bg={category === selectedCategory ? "blue.500" : "white"}
                color={category === selectedCategory ? "white" : "gray.600"}
                px={6}
                py={2}
                borderRadius="full"
                fontSize="sm"
                fontWeight="medium"
                boxShadow="sm"
                _hover={{
                  transform: "translateY(-1px)"
                }}
                transition="all 0.2s"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </Flex>
        </Flex>
      </Box>

      {/* Guest Alert */}
      {showGuestAlert && (
        <Alert status="info" mb={4}>
          <AlertIcon />
          <Box flex="1">
            <AlertTitle>訪客模式</AlertTitle>
            <AlertDescription display="block">
              您正在以訪客身份瀏覽。訪客無法提出諮詢需求，請登入以獲得完整功能。
            </AlertDescription>
          </Box>
          <CloseButton 
            position="absolute" 
            right="8px" 
            top="8px" 
            onClick={() => setShowGuestAlert(false)}
          />
        </Alert>
      )}

      {/* Expert List */}
      <Box
        p={4}
        flex={1}
      >
        {filteredExperts.length === 0 ? (
          <Flex 
            direction="column" 
            align="center" 
            justify="center" 
            mt={10}
            p={6}
            bg="white"
            borderRadius="xl"
            boxShadow="sm"
          >
            <Text fontSize="xl" fontWeight="bold" mb={2}>沒有找到符合條件的專家</Text>
            <Text color="gray.500" textAlign="center">
              請嘗試調整您的搜索條件或選擇不同的類別
            </Text>
          </Flex>
        ) : (
          <Stack spacing={4}>
            {filteredExperts.map((expert, index) => (
              <Box
                as={motion.div}
                key={expert.id}
                bg="white"
                borderRadius="2xl"
                p={4}
                boxShadow="sm"
                onClick={() => handleExpertClick(expert.id)}
                cursor="pointer"
                transition="all 0.2s"
                _hover={{
                  transform: "translateY(-2px)",
                  boxShadow: "md"
                }}
                custom={index}
                initial="hidden"
                animate="visible"
                variants={cardVariants}
              >
                <Flex gap={4}>
                  <Avatar
                    size="xl"
                    src={expert.image}
                    borderRadius="2xl"
                  />
                  <Flex
                    flex={1}
                    direction="column"
                    gap={2}
                  >
                    <Flex
                      justify="space-between"
                      align="center"
                    >
                      <Flex direction="column">
                        <Text
                          fontSize="18px"
                          fontWeight="bold"
                        >
                          {expert.name}
                        </Text>
                        <Text
                          fontSize="14px"
                          color="gray.600"
                        >
                          {expert.title}
                        </Text>
                      </Flex>
                      {expert.isOnline && (
                        <Badge
                          colorScheme="green"
                          variant="subtle"
                          borderRadius="full"
                          px={3}
                        >
                          在線
                        </Badge>
                      )}
                    </Flex>

                    {/* Rating Section */}
                    <Flex
                      align="center"
                      gap={2}
                    >
                      <Flex
                        align="center"
                        bg="yellow.50"
                        px={2}
                        py={1}
                        borderRadius="full"
                      >
                        <Star
                          size={14}
                          color="orange"
                          style={{
                            marginRight: "4px"
                          }}
                        />
                        <Text
                          fontWeight="medium"
                          fontSize="14px"
                        >
                          {expert.rating}
                        </Text>
                      </Flex>
                      <Text
                        color="gray.500"
                        fontSize="14px"
                      >
                        ({expert.reviews}次評價)
                      </Text>
                    </Flex>

                    {/* Description */}
                    <Text
                      fontSize="14px"
                      color="gray.600"
                      lineHeight="1.4"
                    >
                      {expert.description}
                    </Text>

                    {/* Footer Section */}
                    <Flex
                      justify="space-between"
                      align="center"
                      mt={2}
                    >
                      <Flex
                        align="center"
                        gap={2}
                      >
                        <Clock
                          size={16}
                          color="gray.400"
                        />
                        <Text
                          fontSize="14px"
                          color="gray.500"
                        >
                          平均回覆時間: {expert.responseTime}
                        </Text>
                      </Flex>
                      <Button
                        bg="black"
                        color="white"
                        size="sm"
                        px={6}
                        borderRadius="full"
                        onClick={(e) => handleConsultationClick(e, expert.id)}
                        _hover={{
                          transform: "translateY(-1px)"
                        }}
                      >
                        諮詢
                      </Button>
                    </Flex>
                  </Flex>
                </Flex>
              </Box>
            ))}
          </Stack>
        )}
      </Box>

      {/* Filter Modal */}
      <Modal
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent
          borderRadius="2xl"
          p={6}
        >
          <ModalHeader px={0}>
            <Text
              fontSize="20px"
              fontWeight="bold"
            >
              篩選條件
            </Text>
          </ModalHeader>
          <ModalBody px={0}>
            <Stack spacing={6}>
              {/* Expert Level */}
              <Flex direction="column">
                <Text
                  fontWeight="semibold"
                  mb={3}
                >
                  專家等級
                </Text>
                <RadioGroup 
                  defaultValue={selectedLevel}
                  onChange={setSelectedLevel}
                >
                  <Stack spacing={3}>
                    {expertLevels.map((level) => (
                      <Radio
                        key={level}
                        value={level}
                        colorScheme="blackAlpha"
                      >
                        {level}
                      </Radio>
                    ))}
                  </Stack>
                </RadioGroup>
              </Flex>

              {/* Sort Method */}
              <Flex direction="column">
                <Text
                  fontWeight="semibold"
                  mb={3}
                >
                  排序方式
                </Text>
                <Select
                  bg="gray.50"
                  border="none"
                  borderRadius="xl"
                  value={selectedSort}
                  onChange={(e) => setSelectedSort(e.target.value)}
                >
                  {sortOptions.map((option) => (
                    <option
                      key={option}
                      value={option}
                    >
                      {option}
                    </option>
                  ))}
                </Select>
              </Flex>

              {/* Price Range */}
              <Flex direction="column">
                <Text
                  fontWeight="semibold"
                  mb={3}
                >
                  價格範圍
                </Text>
                <RangeSlider
                  defaultValue={priceRange}
                  min={0}
                  max={1000}
                  step={100}
                  onChange={(val) => setPriceRange(val as [number, number])}
                >
                  <RangeSliderTrack bg="gray.200">
                    <RangeSliderFilledTrack bg="black" />
                  </RangeSliderTrack>
                  <RangeSliderThumb
                    index={0}
                    bg="white"
                    boxShadow="md"
                  />
                  <RangeSliderThumb
                    index={1}
                    bg="white"
                    boxShadow="md"
                  />
                </RangeSlider>
                <Flex justify="space-between" mt={2}>
                  <Text fontSize="sm" color="gray.500">NT$ {priceRange[0]}</Text>
                  <Text fontSize="sm" color="gray.500">NT$ {priceRange[1]}</Text>
                </Flex>
              </Flex>
            </Stack>
          </ModalBody>
          <ModalFooter px={0}>
            <Button
              w="full"
              bg="black"
              color="white"
              borderRadius="xl"
              h="45px"
              onClick={onClose}
              _hover={{
                transform: "translateY(-1px)"
              }}
            >
              應用篩選
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
};

export default ExpertListScreen;
