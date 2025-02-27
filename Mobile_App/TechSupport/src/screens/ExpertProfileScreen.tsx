import React from 'react';
import {
  ChakraProvider,
  Flex,
  Box,
  Text,
  Button,
  Avatar,
  Tag,
  Stack,
  useToast,
  IconButton
} from '@chakra-ui/react';
import { 
  ArrowLeft, 
  Star, 
  Certificate, 
  Tool, 
  Building, 
  ChevronRight,
  List
} from 'tabler-icons-react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { kStyleGlobal } from '../theme/theme';

interface ExpertProfileProps {
  id?: string;
}

interface ExpertData {
  id: string;
  name: string;
  avatar: string;
  specialties: string[];
  rating: number;
  completedJobs: number;
  bio: string;
  certifications: {
    icon: React.ReactNode;
    text: string;
    bgColor: string;
    iconColor: string;
  }[];
  reviews: {
    username: string;
    avatar: string;
    date: string;
    rating: number;
    comment: string;
  }[];
  basePrice: string;
}

const ExpertProfileScreen: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams<{ id: string }>();
  const toast = useToast();
  
  // Get expert ID from params or location state
  const expertId = params.id || (location.state as ExpertProfileProps)?.id || '1';
  
  // Mock data for the expert
  const expertData: ExpertData = {
    id: expertId,
    name: '李師傅',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
    specialties: ['水電維修', '居家修繕'],
    rating: 4.8,
    completedJobs: 156,
    bio: '擁有15年水電維修經驗，專精於漏水維修、管線更換、電路檢修等。曾服務多家知名建設公司，現為獨立接案維修師傅。',
    certifications: [
      {
        icon: <Certificate size={20} />,
        text: '甲級水電技術士證照 #A12345',
        bgColor: 'blue.50',
        iconColor: 'blue.500'
      },
      {
        icon: <Tool size={20} />,
        text: '專業修繕技師認證',
        bgColor: 'purple.50',
        iconColor: 'purple.500'
      },
      {
        icon: <Building size={20} />,
        text: '建築物室內配管專業技師',
        bgColor: 'orange.50',
        iconColor: 'orange.500'
      }
    ],
    reviews: [
      {
        username: '匿名用戶',
        avatar: 'https://images.unsplash.com/photo-1500000000001',
        date: '2023/12/01',
        rating: 4,
        comment: '維修速度快，態度親切，價格合理，很專業的師傅。'
      },
      {
        username: '匿名用戶',
        avatar: 'https://images.unsplash.com/photo-1500000000002',
        date: '2023/11/15',
        rating: 5,
        comment: '很仔細地檢查問題，解決了困擾我很久的漏水問題，非常感謝！'
      },
      {
        username: '匿名用戶',
        avatar: 'https://images.unsplash.com/photo-1500000000003',
        date: '2023/10/28',
        rating: 4,
        comment: '準時到達，服務態度好，修繕效果佳。'
      }
    ],
    basePrice: 'NT$ 800起'
  };
  
  const handleBooking = () => {
    navigate('/consultation-request', { 
      state: { 
        expertId: expertData.id,
        expertName: expertData.name,
        expertSpecialty: expertData.specialties[0],
        expertImage: expertData.avatar
      } 
    });
  };
  
  const handleViewAllReviews = () => {
    toast({
      title: "功能開發中",
      description: "查看全部評價功能即將推出",
      status: "info",
      duration: 3000,
      isClosable: true,
    });
  };
  
  return (
    <ChakraProvider theme={kStyleGlobal}>
      <Flex
        direction={"column"}
        bg={"gray.50"}
        minH={"100vh"}
      >
        <Flex
          p={4}
          align="center"
          bg="white"
          position="sticky"
          top={0}
          zIndex={10}
          borderBottom={"1px"}
          borderColor={"gray.100"}
        >
          <Flex align="center">
            <IconButton
              aria-label="Back"
              variant="ghost"
              icon={<ArrowLeft size={20} />}
              onClick={() => navigate(-1)}
            />
            <IconButton
              aria-label="Expert List"
              variant="ghost"
              icon={<List size={20} />}
              onClick={() => navigate('/expert-list')}
            />
            <Text
              fontSize={kStyleGlobal.fontSizes.xl}
              fontWeight={kStyleGlobal.fontWeights.bold}
              ml={3}
            >
              專家資料
            </Text>
          </Flex>
        </Flex>
        
        <Flex
          direction={"column"}
          px={6}
          py={6}
          gap={6}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Flex gap={5}>
              <Avatar
                size={"2xl"}
                src={expertData.avatar}
                borderRadius={"2xl"}
                shadow={"md"}
              />
              <Flex
                direction={"column"}
                justify={"center"}
                gap={3}
              >
                <Text
                  fontSize={kStyleGlobal.fontSizes["2xl"]}
                  fontWeight={kStyleGlobal.fontWeights.bold}
                >
                  {expertData.name}
                </Text>
                <Flex gap={2}>
                  {expertData.specialties.map((specialty, index) => (
                    <Tag
                      key={index}
                      size={"md"}
                      bg={index === 0 ? "blue.50" : "green.50"}
                      color={index === 0 ? "blue.600" : "green.600"}
                      borderRadius={"full"}
                    >
                      {specialty}
                    </Tag>
                  ))}
                </Flex>
                <Flex
                  alignItems={"center"}
                  gap={2}
                >
                  <Star
                    size={20}
                    fill="currentColor"
                    color={kStyleGlobal.colors.orange[400]}
                  />
                  <Text
                    fontWeight={kStyleGlobal.fontWeights.semibold}
                  >
                    {expertData.rating}
                  </Text>
                  <Text
                    color={kStyleGlobal.colors.gray[400]}
                  >
                    •
                  </Text>
                  <Text
                    color={kStyleGlobal.colors.gray[600]}
                  >
                    已完成維修：{expertData.completedJobs}次
                  </Text>
                </Flex>
              </Flex>
            </Flex>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Box
              bg={"white"}
              p={6}
              borderRadius={"2xl"}
              shadow={"sm"}
            >
              <Text
                fontSize={kStyleGlobal.fontSizes.lg}
                fontWeight={kStyleGlobal.fontWeights.bold}
                mb={4}
              >
                專家簡介
              </Text>
              <Text
                lineHeight="tall"
                color={kStyleGlobal.colors.gray[600]}
              >
                {expertData.bio}
              </Text>
            </Box>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Box
              bg={"white"}
              p={6}
              borderRadius={"2xl"}
              shadow={"sm"}
            >
              <Text
                fontSize={kStyleGlobal.fontSizes.lg}
                fontWeight={kStyleGlobal.fontWeights.bold}
                mb={6}
              >
                專業資質
              </Text>
              <Stack spacing={4}>
                {expertData.certifications.map((cert, index) => (
                  <Flex
                    key={index}
                    alignItems={"center"}
                    gap={3}
                  >
                    <Box
                      p={2}
                      bg={cert.bgColor}
                      borderRadius={"lg"}
                    >
                      {React.cloneElement(cert.icon as React.ReactElement, {
                        color: kStyleGlobal.colors[cert.iconColor.split('.')[0]][parseInt(cert.iconColor.split('.')[1])]
                      })}
                    </Box>
                    <Text>{cert.text}</Text>
                  </Flex>
                ))}
              </Stack>
            </Box>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Box
              bg={"white"}
              p={6}
              borderRadius={"2xl"}
              shadow={"sm"}
            >
              <Flex
                justify={"space-between"}
                align={"center"}
                mb={6}
              >
                <Text
                  fontSize={kStyleGlobal.fontSizes.lg}
                  fontWeight={kStyleGlobal.fontWeights.bold}
                >
                  用戶評價
                </Text>
                <Button
                  variant={"ghost"}
                  size={"sm"}
                  rightIcon={<ChevronRight size={16} />}
                  onClick={handleViewAllReviews}
                >
                  <Text
                    color={kStyleGlobal.colors.blue[500]}
                  >
                    查看全部
                  </Text>
                </Button>
              </Flex>
              <Stack spacing={6}>
                {expertData.reviews.map((review, index) => (
                  <Box
                    key={index}
                    pb={6}
                    borderBottom={index !== expertData.reviews.length - 1 ? "1px" : "none"}
                    borderColor={"gray.100"}
                  >
                    <Flex
                      justify={"space-between"}
                      align={"center"}
                      mb={3}
                    >
                      <Flex
                        align={"center"}
                        gap={3}
                      >
                        <Avatar
                          size={"sm"}
                          src={review.avatar}
                        />
                        <Text
                          fontWeight={kStyleGlobal.fontWeights.medium}
                        >
                          {review.username}
                        </Text>
                      </Flex>
                      <Text
                        fontSize={kStyleGlobal.fontSizes.sm}
                        color={kStyleGlobal.colors.gray[500]}
                      >
                        {review.date}
                      </Text>
                    </Flex>
                    <Flex
                      gap={1}
                      mb={3}
                    >
                      {Array(5).fill("1").map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          fill={i < review.rating ? "currentColor" : "none"}
                          color={i < review.rating ? kStyleGlobal.colors.orange[400] : kStyleGlobal.colors.gray[200]}
                        />
                      ))}
                    </Flex>
                    <Text
                      color={kStyleGlobal.colors.gray[600]}
                    >
                      {review.comment}
                    </Text>
                  </Box>
                ))}
              </Stack>
            </Box>
          </motion.div>
        </Flex>
        
        <Box
          position={"sticky"}
          bottom={0}
          bg={"white"}
          p={6}
          borderTop={"1px"}
          borderColor={"gray.100"}
          shadow={"lg"}
        >
          <Flex
            justify={"space-between"}
            align={"center"}
          >
            <Flex
              direction={"column"}
              gap={1}
            >
              <Text
                color={kStyleGlobal.colors.gray[600]}
              >
                基本檢修費
              </Text>
              <Text
                fontSize={kStyleGlobal.fontSizes.xl}
                fontWeight={kStyleGlobal.fontWeights.bold}
                color={kStyleGlobal.colors.blue[600]}
              >
                {expertData.basePrice}
              </Text>
            </Flex>
            <Button
              size={"lg"}
              bg={"black"}
              color={"white"}
              px={8}
              _hover={{
                bg: "gray.800"
              }}
              onClick={handleBooking}
            >
              立即預約
            </Button>
          </Flex>
        </Box>
      </Flex>
    </ChakraProvider>
  );
};

export default ExpertProfileScreen;
