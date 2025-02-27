import React, { useState } from 'react';
import {
  ChakraProvider,
  Flex,
  Box,
  Button,
  Text,
  Image,
  Grid,
  Stack,
  Avatar,
  Textarea,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Select,
  Radio,
  RadioGroup,
  Heading,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Divider,
  SimpleGrid,
  Badge
} from '@chakra-ui/react';
import { 
  Bell as IconBell,
  Book as IconBook,
  MessageCircle as IconMessageCircle,
  History as IconHistory,
  Adjustments as IconAdjustments,
  ChevronRight as IconChevronRight,
  Users as IconUsers,
  Menu as IconMenu,
  User as IconUser,
  Settings as IconSettings,
  Help as IconHelpCircle,
  Logout as IconLogOut,
  Briefcase as IconBriefcase,
  Friends as IconTeam,
  Checklist as IconProject,
  UserCheck as IconCustomer,
  Award as IconMotivation
} from 'tabler-icons-react';
import { useNavigate } from 'react-router-dom';
import { kStyleGlobal } from '../theme/theme';

const quickLinks = [
  {
    icon: "book",
    label: "知識庫",
    route: "/knowledge-base"
  },
  {
    icon: "messageCircle",
    label: "專家諮詢",
    route: "/expert-consultation"
  },
  {
    icon: "history",
    label: "歷史記錄",
    route: "/my-consultations"
  }
];

const popularQuestions = [
  {
    question: "如何提高工作效率？",
    answers: 128,
    icon: "briefcase"
  },
  {
    question: "解決團隊溝通問題",
    answers: 95,
    icon: "team"
  },
  {
    question: "專案管理最佳實踐",
    answers: 156,
    icon: "project"
  },
  {
    question: "客戶關係維護技巧",
    answers: 82,
    icon: "customer"
  },
  {
    question: "員工激勵方法",
    answers: 143,
    icon: "motivation"
  }
];

const HomeScreen: React.FC = () => {
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [inputValue, setInputValue] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState('popular');
  const [questionType, setQuestionType] = useState('全部');

  const toggleFilter = () => setIsFilterOpen(!isFilterOpen);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'book':
        return <IconBook size={24} color="#2563EB" />;
      case 'messageCircle':
        return <IconMessageCircle size={24} color="#2563EB" />;
      case 'history':
        return <IconHistory size={24} color="#2563EB" />;
      case 'briefcase':
        return <IconBriefcase size={24} color="#2563EB" />;
      case 'team':
        return <IconTeam size={24} color="#2563EB" />;
      case 'project':
        return <IconProject size={24} color="#2563EB" />;
      case 'customer':
        return <IconCustomer size={24} color="#2563EB" />;
      case 'motivation':
        return <IconMotivation size={24} color="#2563EB" />;
      default:
        return null;
    }
  };

  return (
    <Flex
      direction="column"
      bg="gray.50"
      minH="100vh"
    >
      <Box
        bg="white"
        py={4}
        px={6}
        borderBottomWidth="1px"
        borderColor="gray.100"
      >
        <Flex
          justify="space-between"
          align="center"
          mb={6}
        >
          <Flex
            align="center"
            gap={3}
          >
            <Image
              src="https://images.unsplash.com/photo-1599305445671-ac291c95aaa9"
              w="40px"
              h="40px"
              borderRadius="xl"
              objectFit="cover"
              alt="Logo"
            />
            <Text
              fontSize="24px"
              fontWeight="700"
              bgGradient="linear(135deg, #2563EB, #7C3AED)"
              bgClip="text"
            >
              我的師父
            </Text>
          </Flex>
          <Flex
            gap={4}
            align="center"
          >
            <Button
              variant="ghost"
              borderRadius="full"
              onClick={() => navigate('/notifications')}
            >
              <IconBell size={22} color={kStyleGlobal.colors.gray[600]} />
            </Button>
            <IconButton
              aria-label="Menu"
              icon={<IconMenu />}
              variant="ghost"
              mr={3}
              onClick={onOpen}
            />
            <Avatar
              size="md"
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde"
              cursor="pointer"
              onClick={() => navigate('/user-profile')}
            />
          </Flex>
        </Flex>
        <Box
          bg="white"
          borderRadius="2xl"
          p={8}
          boxShadow="0 4px 6px -1px rgba(0, 0, 0, 0.1)"
        >
          <Flex
            justify="space-between"
            align="center"
            mb={4}
          >
            <Flex align="center">
              <Text
                fontSize="24px"
                fontWeight="700"
              >
                您好，王小明
              </Text>
            </Flex>
          </Flex>
          <Text
            fontSize="26px"
            fontWeight="700"
            mb="16px"
          >
            有什麼可以幫您？
          </Text>
          <Textarea
            placeholder="詳細描述您的問題..."
            bg="gray.50"
            border="none"
            borderRadius="xl"
            p={4}
            minH="120px"
            mb={4}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            _focus={{
              bg: "white",
              boxShadow: "0 0 0 2px #2563EB"
            }}
          />
          <Button
            bg="blue.600"
            color="white"
            size="lg"
            w="100%"
            h="54px"
            borderRadius="xl"
            _hover={{
              bg: "blue.700"
            }}
            onClick={() => navigate('/question', { state: { initialQuestion: inputValue } })}
          >
            立即諮詢
          </Button>
        </Box>
      </Box>

      <Box px={6} py={8}>
        <Grid
          templateColumns="repeat(3, 1fr)"
          gap={4}
          mb={8}
        >
          {quickLinks.map(item => (
            <Box
              key={item.label}
              bg="white"
              p={6}
              borderRadius="xl"
              boxShadow="sm"
              cursor="pointer"
              onClick={() => navigate(item.route)}
              _hover={{
                transform: "translateY(-2px)",
                boxShadow: "md"
              }}
              transition="all 0.2s"
            >
              <Flex
                direction="column"
                align="center"
                gap={3}
              >
                {getIcon(item.icon)}
                <Text
                  fontWeight="600"
                  fontSize="15px"
                >
                  {item.label}
                </Text>
              </Flex>
            </Box>
          ))}
        </Grid>

        <Box
          bg="white"
          borderRadius="lg"
          p={6}
          boxShadow="sm"
        >
          <Flex
            justify="space-between"
            align="center"
            mb={6}
          >
            <Text
              fontSize="28px"
              fontWeight="800"
            >
              熱門問題
            </Text>
            <Button
              variant="ghost"
              borderRadius="full"
              onClick={toggleFilter}
            >
              <IconAdjustments size={20} />
            </Button>
          </Flex>
          <Stack spacing={4}>
            {popularQuestions.map((item, index) => (
              <Box
                key={index}
                p={5}
                borderRadius="lg"
                bg="white"
                boxShadow="sm"
                border="1px solid"
                borderColor="gray.100"
                cursor="pointer"
                onClick={() => navigate('/ai-chat')}
                _hover={{
                  boxShadow: "md",
                  borderColor: "blue.100",
                  transform: "translateY(-2px)",
                  transition: "all 0.2s ease-in-out"
                }}
              >
                <Flex
                  justify="space-between"
                  align="center"
                >
                  <Flex
                    direction="column"
                    gap={2}
                  >
                    <Flex align="center" gap={3}>
                      <Box 
                        p={2} 
                        borderRadius="md" 
                        bg="blue.50"
                      >
                        {getIcon(item.icon)}
                      </Box>
                      <Text
                        fontWeight="600"
                        fontSize="16px"
                      >
                        {item.question}
                      </Text>
                    </Flex>
                    <Text
                      fontSize="13px"
                      color="gray.500"
                    >
                      已解答 {item.answers}次
                    </Text>
                  </Flex>
                  <IconChevronRight size={18} color="#64748B" />
                </Flex>
              </Box>
            ))}
          </Stack>
        </Box>
      </Box>

      <Modal isOpen={isFilterOpen} onClose={toggleFilter}>
        <ModalOverlay />
        <ModalContent borderRadius="xl" p={0}>
          <ModalHeader borderBottomWidth="1px" borderColor="gray.100" p={4}>
            <Text fontSize="18px" fontWeight="700">
              篩選
            </Text>
          </ModalHeader>
          <ModalBody p={6}>
            <Stack spacing={6}>
              <Flex direction="column" gap={3}>
                <Text fontWeight="600">排序方式</Text>
                <Select
                  value={selectedSort}
                  onChange={(e) => setSelectedSort(e.target.value)}
                  bg="gray.50"
                  border="none"
                  borderRadius="lg"
                >
                  <option value="popular">最受歡迎</option>
                  <option value="newest">最新</option>
                  <option value="oldest">最早</option>
                </Select>
              </Flex>
              <Flex direction="column" gap={3}>
                <Text fontWeight="600">問題類型</Text>
                <RadioGroup value={questionType} onChange={setQuestionType}>
                  <Stack spacing={3}>
                    {["全部", "技術", "商業"].map(option => (
                      <Radio
                        key={option}
                        value={option}
                        borderColor="gray.300"
                      >
                        {option}
                      </Radio>
                    ))}
                  </Stack>
                </RadioGroup>
              </Flex>
            </Stack>
          </ModalBody>
          <ModalFooter borderTopWidth="1px" borderColor="gray.100" p={4}>
            <Button
              w="100%"
              h="44px"
              onClick={toggleFilter}
              bg="blue.600"
              color="white"
              _hover={{
                bg: "blue.700"
              }}
            >
              應用篩選
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Navigation Drawer */}
      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px">
            <Flex align="center" gap={3}>
              <Avatar 
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde"
                size="sm"
              />
              <Text fontWeight="bold">王小明</Text>
            </Flex>
          </DrawerHeader>

          <DrawerBody>
            <Stack spacing={4} mt={4}>
              <Button 
                leftIcon={<IconUser />} 
                justifyContent="flex-start" 
                variant="ghost"
                onClick={() => {
                  onClose();
                  navigate('/user-profile');
                }}
              >
                個人資料
              </Button>
              <Button 
                leftIcon={<IconBook />} 
                justifyContent="flex-start" 
                variant="ghost"
                onClick={() => {
                  onClose();
                  navigate('/knowledge-base');
                }}
              >
                知識庫
              </Button>
              <Button 
                leftIcon={<IconUsers />} 
                justifyContent="flex-start" 
                variant="ghost"
                onClick={() => {
                  onClose();
                  navigate('/expert-list');
                }}
              >
                專家列表
              </Button>
              <Button 
                leftIcon={<IconHistory />} 
                justifyContent="flex-start" 
                variant="ghost"
                onClick={() => {
                  onClose();
                  navigate('/my-consultations');
                }}
              >
                我的諮詢
              </Button>
              <Button 
                leftIcon={<IconSettings />} 
                justifyContent="flex-start" 
                variant="ghost"
                onClick={() => {
                  onClose();
                  navigate('/settings');
                }}
              >
                設置
              </Button>
              <Button 
                leftIcon={<IconHelpCircle />} 
                justifyContent="flex-start" 
                variant="ghost"
                onClick={() => {
                  onClose();
                  navigate('/help');
                }}
              >
                幫助中心
              </Button>
            </Stack>
          </DrawerBody>

          <DrawerFooter borderTopWidth="1px">
            <Button 
              leftIcon={<IconLogOut />} 
              colorScheme="red" 
              variant="outline" 
              w="100%"
              onClick={() => {
                onClose();
                navigate('/login');
              }}
            >
              登出
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </Flex>
  );
};

export default HomeScreen;
