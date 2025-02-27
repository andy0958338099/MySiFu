import React, { useState, useEffect } from 'react';
import {
  ChakraProvider,
  Flex,
  Text,
  Avatar,
  Card,
  Divider,
  Badge,
  Button,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Box,
  Heading,
  Stack,
  useToast,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatGroup,
  SimpleGrid,
  Icon,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Input,
  InputGroup,
  InputLeftElement
} from '@chakra-ui/react';
import {
  Calendar as IconCalendar,
  Search as IconSearch,
  Filter as IconFilter,
  Check as IconCheck,
  Clock as IconClock,
  CurrencyDollar as IconCurrencyDollar,
  DotsVertical as IconDotsVertical,
  ChevronDown as IconChevronDown,
  Star as IconStar,
  User as IconUser
} from 'tabler-icons-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { kStyleGlobal } from '../theme/theme';
import { getExpertConsultations } from '../lib/expertService';

interface Consultation {
  id: string;
  title: string;
  description: string;
  type: string;
  status: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  priority: string;
  user_name: string;
  complexity?: number;
  estimated_time?: string;
  suggested_price?: string;
}

const ExpertConsultationListScreen: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();
  
  // State variables
  const [pendingConsultations, setPendingConsultations] = useState<Consultation[]>([]);
  const [activeConsultations, setActiveConsultations] = useState<Consultation[]>([]);
  const [completedConsultations, setCompletedConsultations] = useState<Consultation[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterType, setFilterType] = useState<string>('all');
  
  // Mock data for demonstration
  const mockConsultations: Consultation[] = [
    {
      id: "1",
      title: "浴室水管漏水",
      description: "浴室水管漏水，天花板有滲水痕跡，需要專業師傅檢查並維修。希望能在本週內完成修繕工程。",
      type: "水電維修",
      status: "pending",
      user_id: "user123",
      created_at: "2025-02-27T14:30:00Z",
      updated_at: "2025-02-27T14:30:00Z",
      priority: "緊急",
      user_name: "林小姐"
    },
    {
      id: "2",
      title: "冷氣不製冷",
      description: "冷氣開機後吹出的風不冷，可能需要加冷媒或檢查是否有其他問題。",
      type: "冷氣維修",
      status: "active",
      user_id: "user456",
      created_at: "2025-02-26T10:15:00Z",
      updated_at: "2025-02-27T09:20:00Z",
      priority: "一般",
      user_name: "張先生",
      complexity: 3,
      estimated_time: "2-3小時",
      suggested_price: "2,500元"
    },
    {
      id: "3",
      title: "廚房電器故障",
      description: "烤箱無法正常加熱，使用時有異響，希望能檢查並維修。",
      type: "家電維修",
      status: "active",
      user_id: "user789",
      created_at: "2025-02-25T16:45:00Z",
      updated_at: "2025-02-26T11:30:00Z",
      priority: "一般",
      user_name: "王太太",
      complexity: 2,
      estimated_time: "1小時",
      suggested_price: "1,800元"
    },
    {
      id: "4",
      title: "客廳燈具更換",
      description: "希望更換客廳的吊燈，需要專業電工協助安裝新燈具。",
      type: "電器安裝",
      status: "completed",
      user_id: "user101",
      created_at: "2025-02-23T09:00:00Z",
      updated_at: "2025-02-24T14:15:00Z",
      priority: "一般",
      user_name: "李先生",
      complexity: 1,
      estimated_time: "1小時",
      suggested_price: "1,200元"
    },
    {
      id: "5",
      title: "浴室排水管堵塞",
      description: "浴室排水管堵塞，水排不出去，需要專業疏通。",
      type: "水電維修",
      status: "completed",
      user_id: "user202",
      created_at: "2025-02-22T13:20:00Z",
      updated_at: "2025-02-23T10:45:00Z",
      priority: "緊急",
      user_name: "陳小姐",
      complexity: 2,
      estimated_time: "1-2小時",
      suggested_price: "1,500元"
    }
  ];
  
  // Load consultations
  useEffect(() => {
    const fetchConsultations = async () => {
      try {
        setIsLoading(true);
        
        // In a real app, fetch from database
        // const data = await getExpertConsultations();
        
        // For demo, use mock data
        const data = mockConsultations;
        
        // Filter consultations by status
        setPendingConsultations(data.filter(c => c.status === 'pending'));
        setActiveConsultations(data.filter(c => c.status === 'active'));
        setCompletedConsultations(data.filter(c => c.status === 'completed'));
      } catch (error) {
        console.error('Error fetching consultations:', error);
        toast({
          title: "載入失敗",
          description: "無法載入諮詢列表",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchConsultations();
  }, [toast]);
  
  // Filter consultations based on search query and type
  const filterConsultations = (consultations: Consultation[]) => {
    return consultations.filter(c => {
      const matchesSearch = searchQuery === '' || 
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.user_name.toLowerCase().includes(searchQuery.toLowerCase());
        
      const matchesType = filterType === 'all' || c.type === filterType;
      
      return matchesSearch && matchesType;
    });
  };
  
  // Navigate to consultation detail
  const handleViewConsultation = (consultationId: string) => {
    navigate(`/expert-consultation?id=${consultationId}`);
  };
  
  // Navigate to expert profile
  const handleViewExpertProfile = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate('/expert-profile/1');
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-TW', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Render consultation card
  const renderConsultationCard = (consultation: Consultation) => {
    return (
      <motion.div
        key={consultation.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        whileHover={{ y: -5 }}
      >
        <Card
          p={4}
          shadow="md"
          borderRadius="lg"
          cursor="pointer"
          onClick={() => handleViewConsultation(consultation.id)}
          _hover={{ shadow: 'lg' }}
        >
          <Flex direction="column" gap={3}>
            <Flex justify="space-between" align="center">
              <Flex align="center" gap={3}>
                <Avatar size="sm" name={consultation.user_name} />
                <Text fontWeight="bold">{consultation.title}</Text>
              </Flex>
              <Menu>
                <MenuButton as={Button} variant="ghost" size="sm">
                  <IconDotsVertical size={16} />
                </MenuButton>
                <MenuList>
                  <MenuItem onClick={(e) => {
                    e.stopPropagation();
                    handleViewConsultation(consultation.id);
                  }}>
                    查看詳情
                  </MenuItem>
                  {consultation.status === 'active' && (
                    <MenuItem onClick={(e) => {
                      e.stopPropagation();
                      // Handle mark as completed
                      toast({
                        title: "標記為已完成",
                        status: "success",
                        duration: 3000,
                      });
                    }}>
                      標記為已完成
                    </MenuItem>
                  )}
                </MenuList>
              </Menu>
            </Flex>
            
            <Flex gap={2} wrap="wrap">
              <Badge colorScheme="blue">{consultation.type}</Badge>
              <Badge colorScheme={
                consultation.priority === '緊急' ? 'red' : 
                consultation.priority === '高' ? 'orange' : 
                consultation.priority === '中' ? 'yellow' : 'green'
              }>
                {consultation.priority}
              </Badge>
              {consultation.status === 'pending' && <Badge colorScheme="purple">待處理</Badge>}
              {consultation.status === 'active' && <Badge colorScheme="green">進行中</Badge>}
              {consultation.status === 'completed' && <Badge colorScheme="gray">已完成</Badge>}
            </Flex>
            
            <Text noOfLines={2} fontSize="sm" color="gray.600">
              {consultation.description}
            </Text>
            
            <Divider />
            
            <Flex justify="space-between" align="center" fontSize="xs" color="gray.500">
              <Flex align="center" gap={1}>
                <IconCalendar size={14} />
                <Text>{formatDate(consultation.created_at)}</Text>
              </Flex>
              
              <Flex align="center" gap={1}>
                <Text>{consultation.user_name}</Text>
              </Flex>
            </Flex>
            
            {(consultation.status === 'active' || consultation.status === 'completed') && (
              <>
                <Divider />
                <SimpleGrid columns={3} spacing={2}>
                  <Stat size="sm">
                    <StatLabel fontSize="xs">難度</StatLabel>
                    <Flex align="center" color="yellow.400">
                      {Array(5).fill("").map((_, i) => (
                        <IconStar 
                          key={i} 
                          size={12} 
                          fill={i < (consultation.complexity || 0) ? 'currentColor' : 'none'}
                          color={i < (consultation.complexity || 0) ? 'currentColor' : 'gray.300'}
                        />
                      ))}
                    </Flex>
                  </Stat>
                  <Stat size="sm">
                    <StatLabel fontSize="xs">工期</StatLabel>
                    <StatNumber fontSize="sm">{consultation.estimated_time || '-'}</StatNumber>
                  </Stat>
                  <Stat size="sm">
                    <StatLabel fontSize="xs">報價</StatLabel>
                    <StatNumber fontSize="sm">{consultation.suggested_price || '-'}</StatNumber>
                  </Stat>
                </SimpleGrid>
              </>
            )}
          </Flex>
        </Card>
      </motion.div>
    );
  };
  
  // Statistics
  const totalConsultations = pendingConsultations.length + activeConsultations.length + completedConsultations.length;
  const completionRate = totalConsultations > 0 
    ? Math.round((completedConsultations.length / totalConsultations) * 100) 
    : 0;
  
  return (
    <ChakraProvider theme={kStyleGlobal}>
      <Flex direction="column" h="100vh" bg="gray.50">
        <Box bg="white" p={4} shadow="sm">
          <Flex justify="space-between" align="center" mb={4}>
            <Heading size="lg">專家諮詢管理</Heading>
            <Flex gap={2}>
              <Button 
                colorScheme="teal" 
                leftIcon={<IconUser />}
                onClick={handleViewExpertProfile}
              >
                查看專家資料
              </Button>
              <Button 
                colorScheme="blue" 
                leftIcon={<IconCheck />}
                onClick={() => navigate('/home')}
              >
                返回首頁
              </Button>
            </Flex>
          </Flex>
          
          <SimpleGrid columns={{ base: 1, md: 4 }} spacing={4} mb={6}>
            <Card p={4} borderRadius="lg" bg="blue.50">
              <Stat>
                <StatLabel>總諮詢數</StatLabel>
                <StatNumber>{totalConsultations}</StatNumber>
                <StatHelpText>所有諮詢請求</StatHelpText>
              </Stat>
            </Card>
            <Card p={4} borderRadius="lg" bg="purple.50">
              <Stat>
                <StatLabel>待處理</StatLabel>
                <StatNumber>{pendingConsultations.length}</StatNumber>
                <StatHelpText>等待回應的請求</StatHelpText>
              </Stat>
            </Card>
            <Card p={4} borderRadius="lg" bg="green.50">
              <Stat>
                <StatLabel>進行中</StatLabel>
                <StatNumber>{activeConsultations.length}</StatNumber>
                <StatHelpText>已接受的請求</StatHelpText>
              </Stat>
            </Card>
            <Card p={4} borderRadius="lg" bg="gray.50">
              <Stat>
                <StatLabel>完成率</StatLabel>
                <StatNumber>{completionRate}%</StatNumber>
                <StatHelpText>已完成 {completedConsultations.length} 個請求</StatHelpText>
              </Stat>
            </Card>
          </SimpleGrid>
          
          <Flex gap={4} mb={4}>
            <InputGroup maxW="300px">
              <InputLeftElement pointerEvents="none">
                <IconSearch size={18} color="gray.300" />
              </InputLeftElement>
              <Input 
                placeholder="搜尋諮詢..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </InputGroup>
            
            <Menu>
              <MenuButton as={Button} rightIcon={<IconChevronDown />} variant="outline">
                <Flex align="center" gap={2}>
                  <IconFilter size={18} />
                  <Text>類型: {filterType === 'all' ? '全部' : filterType}</Text>
                </Flex>
              </MenuButton>
              <MenuList>
                <MenuItem onClick={() => setFilterType('all')}>全部</MenuItem>
                <MenuItem onClick={() => setFilterType('水電維修')}>水電維修</MenuItem>
                <MenuItem onClick={() => setFilterType('冷氣維修')}>冷氣維修</MenuItem>
                <MenuItem onClick={() => setFilterType('家電維修')}>家電維修</MenuItem>
                <MenuItem onClick={() => setFilterType('電器安裝')}>電器安裝</MenuItem>
              </MenuList>
            </Menu>
          </Flex>
        </Box>
        
        <Box p={4} flex="1" overflowY="auto">
          <Tabs variant="enclosed" colorScheme="blue">
            <TabList>
              <Tab>待處理 ({filterConsultations(pendingConsultations).length})</Tab>
              <Tab>進行中 ({filterConsultations(activeConsultations).length})</Tab>
              <Tab>已完成 ({filterConsultations(completedConsultations).length})</Tab>
            </TabList>
            
            <TabPanels>
              <TabPanel>
                {isLoading ? (
                  <Flex justify="center" p={8}>
                    <Text>載入中...</Text>
                  </Flex>
                ) : filterConsultations(pendingConsultations).length === 0 ? (
                  <Flex justify="center" p={8}>
                    <Text color="gray.500">沒有待處理的諮詢</Text>
                  </Flex>
                ) : (
                  <Stack spacing={4}>
                    {filterConsultations(pendingConsultations).map(consultation => 
                      renderConsultationCard(consultation)
                    )}
                  </Stack>
                )}
              </TabPanel>
              
              <TabPanel>
                {isLoading ? (
                  <Flex justify="center" p={8}>
                    <Text>載入中...</Text>
                  </Flex>
                ) : filterConsultations(activeConsultations).length === 0 ? (
                  <Flex justify="center" p={8}>
                    <Text color="gray.500">沒有進行中的諮詢</Text>
                  </Flex>
                ) : (
                  <Stack spacing={4}>
                    {filterConsultations(activeConsultations).map(consultation => 
                      renderConsultationCard(consultation)
                    )}
                  </Stack>
                )}
              </TabPanel>
              
              <TabPanel>
                {isLoading ? (
                  <Flex justify="center" p={8}>
                    <Text>載入中...</Text>
                  </Flex>
                ) : filterConsultations(completedConsultations).length === 0 ? (
                  <Flex justify="center" p={8}>
                    <Text color="gray.500">沒有已完成的諮詢</Text>
                  </Flex>
                ) : (
                  <Stack spacing={4}>
                    {filterConsultations(completedConsultations).map(consultation => 
                      renderConsultationCard(consultation)
                    )}
                  </Stack>
                )}
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </Flex>
    </ChakraProvider>
  );
};

export default ExpertConsultationListScreen;
