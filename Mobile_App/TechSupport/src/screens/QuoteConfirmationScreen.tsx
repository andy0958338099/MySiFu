import React from 'react';
import {
  Box,
  Flex,
  Text,
  Button,
  VStack,
  Heading,
  useColorModeValue,
  Container,
  Divider
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { CircleCheck } from 'tabler-icons-react';

const QuoteConfirmationScreen: React.FC = () => {
  const navigate = useNavigate();
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBgColor = useColorModeValue('white', 'gray.800');

  return (
    <Box bg={bgColor} minH="100vh" py={10}>
      <Container maxW="container.md">
        <VStack spacing={8} align="center" justify="center">
          <Box
            bg={cardBgColor}
            p={8}
            borderRadius="xl"
            shadow="md"
            w="full"
            textAlign="center"
          >
            <CircleCheck
              size={80}
              color="green"
              style={{ margin: '0 auto', marginBottom: '24px' }}
            />
            
            <Heading size="lg" mb={4}>
              諮詢請求已提交成功！
            </Heading>
            
            <Text fontSize="md" mb={6} color="gray.600">
              我們已收到您的諮詢請求，專家將在24小時內回覆您。
              您可以在「我的諮詢」頁面查看請求狀態。
            </Text>
            
            <Divider my={6} />
            
            <Box p={4} bg="gray.50" borderRadius="md" mb={6}>
              <Text fontWeight="bold" mb={2}>
                請求詳情
              </Text>
              <Flex justify="space-between" mb={2}>
                <Text color="gray.600">諮詢類型：</Text>
                <Text fontWeight="medium">專家諮詢</Text>
              </Flex>
              <Flex justify="space-between" mb={2}>
                <Text color="gray.600">預算：</Text>
                <Text fontWeight="medium">NT$ 500</Text>
              </Flex>
              <Flex justify="space-between">
                <Text color="gray.600">預計回覆時間：</Text>
                <Text fontWeight="medium">24小時內</Text>
              </Flex>
            </Box>
            
            <VStack spacing={4}>
              <Button
                colorScheme="blue"
                size="lg"
                w="full"
                onClick={() => navigate('/my-consultations')}
              >
                查看我的諮詢
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                w="full"
                onClick={() => navigate('/')}
              >
                返回首頁
              </Button>
            </VStack>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
};

export default QuoteConfirmationScreen;
