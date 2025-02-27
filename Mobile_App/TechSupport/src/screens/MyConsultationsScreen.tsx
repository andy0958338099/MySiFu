import React, { useState, useEffect } from 'react';
import {
  ChakraProvider,
  Flex,
  Box,
  Button,
  Text,
  Badge,
  Input,
  InputGroup,
  InputLeftElement,
  Stack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Select,
  Radio,
  RadioGroup,
  FormControl,
  FormLabel,
  Spinner,
  Center,
  useToast
} from '@chakra-ui/react';
import {
  ChevronLeft as IconChevronLeft,
  Adjustments as IconAdjustments,
  Search as IconSearch,
  CircleCheck as IconCircleCheck,
  ChevronRight as IconChevronRight,
} from 'tabler-icons-react';
import { useNavigate } from 'react-router-dom';
import { kStyleGlobal } from '../theme/theme';
import { getConsultations } from '../lib/consultationService';

interface ConsultationRecord {
  id: string;
  user_id?: string;
  title: string;
  description?: string;
  type: string;
  status: string;
  solution_method?: string;
  created_at?: string;
  updated_at?: string;
  // Legacy fields for backward compatibility
  date?: string;
  budget?: number;
  fullDescription?: string;
  expertName?: string;
  expertSpecialty?: string;
  isAnonymous?: boolean;
  images?: string[];
  files?: string[];
}

const MyConsultationsScreen: React.FC = () => {
  const navigate = useNavigate();
  const [consultations, setConsultations] = useState<ConsultationRecord[]>([]);
  const [filteredConsultations, setFilteredConsultations] = useState<ConsultationRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showFilterModal, setShowFilterModal] = useState<boolean>(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterDate, setFilterDate] = useState<string>('all');
  const [isGuest, setIsGuest] = useState<boolean>(false);
  const toast = useToast();

  // 檢查用戶是否為訪客
  useEffect(() => {
    const guestStatus = localStorage.getItem('isGuest') === 'true';
    setIsGuest(guestStatus);
    
    if (guestStatus) {
      toast({
        title: '訪客權限受限',
        description: '訪客模式無法查看諮詢記錄，請登入後再試',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
      navigate('/');
    }
  }, [navigate]);

  useEffect(() => {
    const fetchConsultations = async () => {
      setIsLoading(true);
      try {
        // Get consultations from Supabase (falls back to localStorage if needed)
        const data = await getConsultations();
        
        if (data && data.length > 0) {
          setConsultations(data);
          setFilteredConsultations(data);
        } else {
          // If no consultations found, use default examples
          const defaultConsultations = [{
            "id": "1",
            "title": "設備故障排查",
            "description": "我的電腦無法開機，已經嘗試重啟但沒有效果",
            "type": "AI對話",
            "status": "已解決",
            "created_at": "2024-01-15T00:00:00Z"
          }, {
            "id": "2",
            "title": "系統優化建議",
            "description": "我想了解如何提高我的系統性能",
            "type": "專家諮詢",
            "status": "處理中",
            "solution_method": "專家: 李工程師",
            "created_at": "2024-01-14T00:00:00Z"
          }, {
            "id": "3",
            "title": "運營問題諮詢",
            "description": "我需要關於業務流程優化的建議",
            "type": "知識庫",
            "status": "已解決",
            "created_at": "2024-01-13T00:00:00Z"
          }];
          
          setConsultations(defaultConsultations);
          setFilteredConsultations(defaultConsultations);
        }
      } catch (error) {
        console.error('Error fetching consultations:', error);
        // Use default examples if there's an error
        const defaultConsultations = [{
          "id": "1",
          "title": "設備故障排查",
          "type": "AI對話",
          "status": "已解決",
          "created_at": "2024-01-15T00:00:00Z"
        }, {
          "id": "2",
          "title": "系統優化建議",
          "type": "專家諮詢",
          "status": "處理中",
          "created_at": "2024-01-14T00:00:00Z"
        }];
        
        setConsultations(defaultConsultations);
        setFilteredConsultations(defaultConsultations);
      } finally {
        setIsLoading(false);
      }
    };

    fetchConsultations();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchQuery, filterStatus, consultations]);

  const applyFilters = () => {
    let filtered = [...consultations];
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(record => 
        record.title.toLowerCase().includes(query) || 
        (record.description && record.description.toLowerCase().includes(query))
      );
    }
    
    if (filterStatus !== 'all') {
      filtered = filtered.filter(record => record.status === filterStatus);
    }
    
    if (filterType !== 'all') {
      filtered = filtered.filter(record => record.type === filterType);
    }
    
    if (filterDate !== 'all') {
      const now = new Date();
      let dateLimit = new Date();
      
      if (filterDate === 'week') {
        dateLimit.setDate(now.getDate() - 7);
      } else if (filterDate === 'month') {
        dateLimit.setMonth(now.getMonth() - 1);
      } else if (filterDate === 'year') {
        dateLimit.setFullYear(now.getFullYear() - 1);
      }
      
      filtered = filtered.filter(record => {
        const recordDate = record.created_at ? new Date(record.created_at) : new Date();
        return recordDate >= dateLimit;
      });
    }
    
    setFilteredConsultations(filtered);
  };

  const toggleFilter = () => setShowFilterModal(!showFilterModal);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleFilterClick = (filter: string) => {
    setFilterStatus(filter);
  };

  const handleApplyFilters = () => {
    applyFilters();
    toggleFilter();
  };

  return (
    <ChakraProvider theme={kStyleGlobal}>
      <Flex
        direction="column"
        h="100vh"
        bg="gray.50"
      >
        <Flex
          px={6}
          py={4}
          bg="white"
          borderBottomWidth="1px"
          borderColor="gray.100"
          position="sticky"
          top={0}
          zIndex={10}
        >
          <Flex
            justifyContent="space-between"
            alignItems="center"
            width="100%"
          >
            <Flex
              alignItems="center"
              gap={3}
            >
              <Button
                variant="ghost"
                onClick={() => {
                  navigate(-1);
                }}
              >
                <IconChevronLeft size={24} />
              </Button>
              <Text
                fontSize="24px"
                fontWeight="bold"
                color={kStyleGlobal.colors.dark}
              >
                歷史記錄
              </Text>
            </Flex>
            <Button
              variant="ghost"
              onClick={toggleFilter}
            >
              <IconAdjustments size={22} />
            </Button>
          </Flex>
        </Flex>
        <Flex
          direction="column"
          flex={1}
          px={6}
          py={4}
          gap={6}
          overflowY="auto"
        >
          <Text
            fontSize="16px"
            color="gray.600"
          >
            查看您的問題解決歷程
          </Text>
          <InputGroup>
            <InputLeftElement
              pointerEvents="none"
              pl={4}
            >
              <IconSearch
                size={20}
                color="gray.400"
              />
            </InputLeftElement>
            <Input
              type="text"
              placeholder="搜索歷史記錄"
              pl={12}
              bg="white"
              border="1px solid"
              borderColor="gray.200"
              borderRadius="full"
              h="45px"
              value={searchQuery}
              onChange={handleSearchChange}
              _focus={{
                borderColor: "gray.300",
                boxShadow: "sm"
              }}
            />
          </InputGroup>
          <Flex
            overflowX="auto"
            css={{
              scrollbarWidth: "none",
              "::-webkit-scrollbar": {
                display: "none"
              }
            }}
          >
            <Flex gap={3}>
              {["全部", "AI對話", "知識庫", "專家諮詢"].map(filter => (
                <Button
                  key={filter}
                  bg={filter === filterType ? "black" : "white"}
                  color={filter === filterType ? "white" : "gray.600"}
                  borderRadius="full"
                  px={6}
                  py={2}
                  fontSize="sm"
                  fontWeight="medium"
                  onClick={() => setFilterType(filter)}
                  _hover={{
                    transform: "translateY(-1px)"
                  }}
                  transition="all 0.2s"
                >
                  {filter}
                </Button>
              ))}
            </Flex>
          </Flex>
          <Stack spacing={4}>
            {isLoading ? (
              <Center py={10}>
                <Spinner size="xl" />
              </Center>
            ) : filteredConsultations.length > 0 ? (
              filteredConsultations.map((record, index) => (
                <Box
                  key={record.id || index}
                  bg="white"
                  p={5}
                  borderRadius="xl"
                  boxShadow="sm"
                  onClick={() => {
                    navigate("/ai-chat");
                  }}
                  cursor="pointer"
                  transition="all 0.2s"
                  _hover={{
                    transform: "translateY(-2px)",
                    boxShadow: "md"
                  }}
                >
                  <Flex
                    justifyContent="space-between"
                    mb={3}
                  >
                    <Text
                      color="gray.500"
                      fontSize="14px"
                    >
                      {record.created_at ? new Date(record.created_at).toLocaleDateString() : record.date}
                    </Text>
                    <Badge
                      colorScheme={record.status === "已解決" ? "green" : "orange"}
                      borderRadius="full"
                      px={3}
                      py={1}
                    >
                      {record.status}
                    </Badge>
                  </Flex>
                  <Text
                    fontSize="18px"
                    fontWeight="600"
                    mb="12px"
                    color={kStyleGlobal.colors.dark}
                  >
                    {record.title}
                  </Text>
                  <Flex
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Flex
                      alignItems="center"
                      gap={2}
                    >
                      <IconCircleCheck
                        size={18}
                        color="gray.500"
                      />
                      <Text
                        fontSize="14px"
                        color="gray.600"
                      >
                        {record.type}
                      </Text>
                    </Flex>
                    <IconChevronRight
                      size={20}
                      color="gray.400"
                    />
                  </Flex>
                </Box>
              ))
            ) : (
              <Box
                textAlign="center"
                py={10}
              >
                <Text
                  color="gray.500"
                  fontSize="md"
                >
                  沒有找到符合條件的記錄
                </Text>
              </Box>
            )}
          </Stack>
        </Flex>
        <Modal
          isOpen={showFilterModal}
          onClose={toggleFilter}
        >
          <ModalOverlay />
          <ModalContent
            borderRadius="2xl"
            mx={4}
          >
            <ModalHeader
              borderBottomWidth="1px"
              borderColor="gray.100"
              pb={4}
            >
              <Text
                fontSize="20px"
                fontWeight="bold"
                color={kStyleGlobal.colors.dark}
              >
                篩選條件
              </Text>
            </ModalHeader>
            <ModalBody py={6}>
              <Stack spacing={6}>
                <FormControl>
                  <FormLabel
                    fontWeight="medium"
                  >
                    時間範圍
                  </FormLabel>
                  <Select
                    bg="gray.50"
                    borderRadius="lg"
                    h="45px"
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                  >
                    <option value="all">全部時間</option>
                    <option value="week">最近一週</option>
                    <option value="month">最近一個月</option>
                    <option value="year">最近一年</option>
                  </Select>
                </FormControl>
                <FormControl>
                  <FormLabel
                    fontWeight="medium"
                  >
                    解決方式
                  </FormLabel>
                  <RadioGroup 
                    value={filterType}
                    onChange={(value) => setFilterType(value)}
                  >
                    <Stack spacing={3}>
                      <Radio value="all">全部</Radio>
                      <Radio value="ai">AI對話</Radio>
                      <Radio value="expert">專家諮詢</Radio>
                      <Radio value="kb">知識庫</Radio>
                    </Stack>
                  </RadioGroup>
                </FormControl>
              </Stack>
            </ModalBody>
            <ModalFooter
              borderTopWidth="1px"
              borderColor="gray.100"
              pt={4}
            >
              <Button
                variant="ghost"
                mr={3}
                onClick={toggleFilter}
              >
                取消
              </Button>
              <Button
                bg="black"
                color="white"
                onClick={handleApplyFilters}
                _hover={{
                  bg: "gray.800"
                }}
              >
                確定
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Flex>
    </ChakraProvider>
  );
};

export default MyConsultationsScreen;
