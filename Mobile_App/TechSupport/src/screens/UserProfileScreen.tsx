import React, { useState } from 'react';
import {
  Box,
  Flex,
  Text,
  Avatar,
  IconButton,
  Input,
  Button,
  FormControl,
  Select,
  RadioGroup,
  Radio,
  Stack,
  Grid,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  useDisclosure
} from '@chakra-ui/react';
import {
  ChevronLeft,
  Edit,
  ChevronRight
} from 'tabler-icons-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { kStyleGlobal } from '../theme/theme';

interface UserData {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  stats: {
    solvedProblems: number;
    expertConsultations: number;
    satisfactionRating: number;
  }
}

const UserProfileScreen: React.FC = () => {
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [currentLanguage, setCurrentLanguage] = useState<string>("中文");
  const [notificationSetting, setNotificationSetting] = useState<string>("all");
  
  // Sample user data
  const [userData, setUserData] = useState<UserData>({
    id: "12345678",
    name: "王小明",
    email: "wang@example.com",
    phone: "+886 912 345 678",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde",
    stats: {
      solvedProblems: 23,
      expertConsultations: 12,
      satisfactionRating: 4.8
    }
  });

  // Form state for the edit modal
  const [formData, setFormData] = useState({
    name: userData.name,
    email: userData.email
  });

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle form submission
  const handleSubmit = () => {
    setUserData({
      ...userData,
      name: formData.name,
      email: formData.email
    });
    onClose();
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <Flex
      direction="column"
      bg="gray.50"
      minH="100vh"
    >
      {/* Header */}
      <Flex
        bg="white"
        px={6}
        py={4}
        position="sticky"
        top={0}
        zIndex={10}
        borderBottom="1px"
        borderColor="gray.100"
      >
        <Flex
          alignItems="center"
          gap={4}
        >
          <ChevronLeft
            size={24}
            color={kStyleGlobal.colors.gray[700]}
            cursor="pointer"
            onClick={() => navigate('/home')}
          />
          <Text
            fontSize="20px"
            fontWeight="600"
            color="gray.900"
          >
            個人資料
          </Text>
        </Flex>
      </Flex>

      {/* Content */}
      <Flex
        direction="column"
        gap={5}
        p={6}
        as={motion.div}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Profile Card */}
        <Box
          bg="white"
          borderRadius="2xl"
          p={6}
          shadow="sm"
          as={motion.div}
          variants={itemVariants}
        >
          <Flex
            direction="column"
            alignItems="center"
            gap={4}
          >
            <Box position="relative">
              <Avatar
                size="2xl"
                src={userData.avatar}
                border="4px"
                borderColor="white"
                shadow="lg"
              />
              <IconButton
                aria-label="Edit profile"
                icon={<Edit size={16} />}
                position="absolute"
                bottom={0}
                right={0}
                bg="white"
                shadow="md"
                size="sm"
                borderRadius="full"
                onClick={onOpen}
              />
            </Box>
            <Flex
              direction="column"
              alignItems="center"
              gap={1}
            >
              <Text
                fontSize="24px"
                fontWeight="700"
                color="gray.900"
              >
                {userData.name}
              </Text>
              <Text
                color="gray.500"
                fontSize="14px"
              >
                ID: {userData.id}
              </Text>
            </Flex>
          </Flex>
        </Box>

        {/* Contact Information */}
        <Box
          bg="white"
          borderRadius="2xl"
          p={6}
          shadow="sm"
          as={motion.div}
          variants={itemVariants}
        >
          <Flex
            direction="column"
            gap={5}
          >
            <Text
              fontSize="18px"
              fontWeight="600"
              color="gray.900"
            >
              聯繫信息
            </Text>
            <FormControl>
              <Flex
                alignItems="center"
                justifyContent="space-between"
                mb={2}
              >
                <Text
                  color="gray.600"
                  fontSize="14px"
                >
                  電子郵件
                </Text>
                <Edit
                  size={18}
                  color={kStyleGlobal.colors.gray[400]}
                  cursor="pointer"
                  onClick={onOpen}
                />
              </Flex>
              <Input
                value={userData.email}
                isReadOnly={true}
                bg="gray.50"
                borderRadius="lg"
                fontSize="15px"
                height="45px"
              />
            </FormControl>
            <FormControl>
              <Flex
                alignItems="center"
                justifyContent="space-between"
                mb={2}
              >
                <Text
                  color="gray.600"
                  fontSize="14px"
                >
                  手機號碼
                </Text>
                <Edit
                  size={18}
                  color={kStyleGlobal.colors.gray[400]}
                  cursor="pointer"
                  onClick={onOpen}
                />
              </Flex>
              <Input
                value={userData.phone}
                isReadOnly={true}
                bg="gray.50"
                borderRadius="lg"
                fontSize="15px"
                height="45px"
              />
            </FormControl>
          </Flex>
        </Box>

        {/* Account Settings */}
        <Box
          bg="white"
          borderRadius="2xl"
          p={6}
          shadow="sm"
          as={motion.div}
          variants={itemVariants}
        >
          <Flex
            direction="column"
            gap={5}
          >
            <Text
              fontSize="18px"
              fontWeight="600"
              color="gray.900"
            >
              帳戶設置
            </Text>
            <Flex
              alignItems="center"
              justifyContent="space-between"
              py={2}
              cursor="pointer"
              onClick={() => navigate('/settings')}
            >
              <Text
                color="gray.700"
              >
                更改密碼
              </Text>
              <ChevronRight
                size={20}
                color={kStyleGlobal.colors.gray[400]}
              />
            </Flex>
            <Flex
              direction="column"
              gap={2}
            >
              <Text
                color="gray.600"
                fontSize="14px"
              >
                語言設置
              </Text>
              <Select
                value={currentLanguage}
                onChange={(e) => setCurrentLanguage(e.target.value)}
                bg="gray.50"
                height="45px"
                borderRadius="lg"
              >
                <option value="中文">中文</option>
                <option value="English">English</option>
              </Select>
            </Flex>
            <Flex
              direction="column"
              gap={3}
            >
              <Text
                color="gray.600"
                fontSize="14px"
              >
                通知設置
              </Text>
              <RadioGroup 
                defaultValue={notificationSetting}
                onChange={setNotificationSetting}
              >
                <Stack spacing={4}>
                  <Radio value="all">
                    <Text
                      color="gray.700"
                    >
                      接收所有通知
                    </Text>
                  </Radio>
                  <Radio value="important">
                    <Text
                      color="gray.700"
                    >
                      僅重要通知
                    </Text>
                  </Radio>
                  <Radio value="none">
                    <Text
                      color="gray.700"
                    >
                      關閉通知
                    </Text>
                  </Radio>
                </Stack>
              </RadioGroup>
            </Flex>
          </Flex>
        </Box>

        {/* Usage Statistics */}
        <Box
          bg="white"
          borderRadius="2xl"
          p={6}
          shadow="sm"
          as={motion.div}
          variants={itemVariants}
        >
          <Flex
            direction="column"
            gap={5}
          >
            <Text
              fontSize="18px"
              fontWeight="600"
              color="gray.900"
            >
              使用統計
            </Text>
            <Grid
              templateColumns="repeat(3, 1fr)"
              gap={4}
            >
              <Box
                bg="gray.50"
                p={4}
                borderRadius="xl"
                textAlign="center"
              >
                <Text
                  fontSize="24px"
                  fontWeight="700"
                  color="gray.900"
                >
                  {userData.stats.solvedProblems}
                </Text>
                <Text
                  fontSize="13px"
                  color="gray.500"
                  mt="4px"
                >
                  已解決問題
                </Text>
              </Box>
              <Box
                bg="gray.50"
                p={4}
                borderRadius="xl"
                textAlign="center"
              >
                <Text
                  fontSize="24px"
                  fontWeight="700"
                  color="gray.900"
                >
                  {userData.stats.expertConsultations}
                </Text>
                <Text
                  fontSize="13px"
                  color="gray.500"
                  mt="4px"
                >
                  專家諮詢
                </Text>
              </Box>
              <Box
                bg="gray.50"
                p={4}
                borderRadius="xl"
                textAlign="center"
              >
                <Text
                  fontSize="24px"
                  fontWeight="700"
                  color="gray.900"
                >
                  {userData.stats.satisfactionRating}
                </Text>
                <Text
                  fontSize="13px"
                  color="gray.500"
                  mt="4px"
                >
                  滿意度評分
                </Text>
              </Box>
            </Grid>
          </Flex>
        </Box>

        {/* Logout Button */}
        <Button
          variant="outline"
          colorScheme="red"
          size="lg"
          borderRadius="xl"
          height="50px"
          mt={2}
          onClick={() => navigate('/login')}
          as={motion.button}
          variants={itemVariants}
        >
          登出
        </Button>
      </Flex>

      {/* Edit Profile Modal */}
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        isCentered
      >
        <ModalOverlay />
        <ModalContent
          borderRadius="2xl"
          p={4}
        >
          <ModalHeader>
            <Text
              fontSize="18px"
              fontWeight="600"
            >
              編輯資料
            </Text>
          </ModalHeader>
          <ModalBody>
            <FormControl mb={4}>
              <Text
                color="gray.600"
                fontSize="14px"
                mb="8px"
              >
                姓名
              </Text>
              <Input
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                borderRadius="lg"
                height="45px"
              />
            </FormControl>
            <FormControl>
              <Text
                color="gray.600"
                fontSize="14px"
                mb="8px"
              >
                電子郵件
              </Text>
              <Input
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                borderRadius="lg"
                height="45px"
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="ghost"
              onClick={onClose}
              mr={3}
            >
              取消
            </Button>
            <Button
              colorScheme="blue"
              borderRadius="lg"
              px={6}
              onClick={handleSubmit}
            >
              保存
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
};

export default UserProfileScreen;
