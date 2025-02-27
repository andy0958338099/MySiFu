import React, { useState, useEffect } from 'react';
import {
  ChakraProvider,
  Box,
  Flex,
  Button,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Stack,
  Text,
  Image,
  Checkbox,
  useToast,
  Divider
} from '@chakra-ui/react';
import { 
  Mail as IconMail,
  Lock as IconLock,
  Eye as IconEye,
  EyeOff as IconEyeOff,
  BrandGoogle as IconBrandGoogle,
  BrandFacebook as IconBrandFacebook,
  BrandApple as IconBrandApple,
  User as IconUser
} from 'tabler-icons-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { kStyleGlobal } from '../theme/theme';
import { supabase } from '../lib/supabase';

const LoginScreen: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: true,
    isAdminLogin: false
  });

  // 顯示從其他頁面傳來的消息
  useEffect(() => {
    const state = location.state as any;
    if (state?.message) {
      toast({
        title: '需要登入',
        description: state.message,
        status: 'info',
        duration: 5000,
        isClosable: true,
      });
    }
  }, [location, toast]);

  const handleLogin = async () => {
    try {
      const { error, data } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) throw error;

      // 檢查是否為管理員登入
      if (formData.isAdminLogin) {
        // 這裡可以添加實際的管理員權限檢查邏輯
        // 目前僅使用特定郵箱作為示例
        const adminEmails = ['admin@example.com', 'admin@sifu.com', 'johnyarcher2100@yahoo.com.tw'];
        
        if (adminEmails.includes(formData.email)) {
          localStorage.setItem('isAdmin', 'true');
          localStorage.setItem('isGuest', 'false');
          
          toast({
            title: '管理員登入成功',
            status: 'success',
            duration: 3000,
          });
          
          navigate('/admin');
        } else {
          toast({
            title: '管理員權限不足',
            description: '您沒有管理員權限',
            status: 'error',
            duration: 3000,
          });
        }
      } else {
        localStorage.setItem('isAdmin', 'false');
        localStorage.setItem('isGuest', 'false');
        
        toast({
          title: '登入成功',
          status: 'success',
          duration: 3000,
        });
        
        navigate('/onboarding');
      }
    } catch (error) {
      toast({
        title: '登入失敗',
        description: error instanceof Error ? error.message : '未知錯誤',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const handleGuestLogin = () => {
    // 設置訪客狀態
    localStorage.setItem('isGuest', 'true');
    localStorage.setItem('isAdmin', 'false');
    
    toast({
      title: '訪客登入成功',
      description: '您可以瀏覽內容，但無法提出諮詢需求',
      status: 'success',
      duration: 3000,
    });
    
    navigate('/onboarding');
  };

  return (
    <Flex
      direction="column"
      minH="100vh"
      bg="gray.50"
      p={6}
    >
      <Flex
        direction="column"
        maxW="440px"
        mx="auto"
        w="100%"
      >
        <Flex
          justify="center"
          mb={10}
        >
          <Image
            src="https://images.unsplash.com/photo-1614027164847-1b28cfe1df60"
            h="48px"
            objectFit="contain"
            alt="Logo"
          />
        </Flex>
        <Box
          bg="white"
          borderRadius="2xl"
          p={8}
          boxShadow="0 4px 6px rgba(0, 0, 0, 0.05)"
          mb={6}
        >
          <Text
            fontSize="24px"
            fontWeight="700"
            textAlign="center"
            mb="32px"
          >
            登入
          </Text>
          <Stack spacing={6}>
            <InputGroup>
              <InputLeftElement
                pointerEvents="none"
                pl={4}
              >
                <IconMail size={20} color="gray" />
              </InputLeftElement>
              <Input
                pl={12}
                placeholder="電子郵件"
                size="lg"
                bg="gray.50"
                border="none"
                borderRadius="xl"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              />
            </InputGroup>
            <InputGroup>
              <InputLeftElement
                pointerEvents="none"
                pl={4}
              >
                <IconLock size={20} color="gray" />
              </InputLeftElement>
              <Input
                pl={12}
                type={showPassword ? "text" : "password"}
                placeholder="密碼"
                size="lg"
                bg="gray.50"
                border="none"
                borderRadius="xl"
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
              />
              <InputRightElement pr={4}>
                <Button
                  variant="ghost"
                  onClick={() => setShowPassword(!showPassword)}
                  size="sm"
                >
                  {showPassword ? <IconEyeOff size={20} color="gray" /> : <IconEye size={20} color="gray" />}
                </Button>
              </InputRightElement>
            </InputGroup>
            <Flex
              justify="space-between"
              align="center"
            >
              <Checkbox
                colorScheme="blue"
                isChecked={formData.rememberMe}
                onChange={(e) => setFormData(prev => ({ ...prev, rememberMe: e.target.checked }))}
              >
                <Text fontSize="14px">記住我</Text>
              </Checkbox>
              <Button
                variant="ghost"
                color="blue.500"
                onClick={() => navigate('/reset-password')}
              >
                <Text fontSize="14px">忘記密碼？</Text>
              </Button>
            </Flex>
            <Checkbox
              colorScheme="blue"
              isChecked={formData.isAdminLogin}
              onChange={(e) => setFormData(prev => ({ ...prev, isAdminLogin: e.target.checked }))}
              mb={4}
            >
              <Text fontSize="14px">管理員登入</Text>
            </Checkbox>
            <Button
              bg="black"
              color="white"
              size="lg"
              h="54px"
              _hover={{
                bg: "gray.800"
              }}
              onClick={handleLogin}
            >
              登入
            </Button>
            <Divider />
            <Button
              bg="gray.200"
              color="gray.600"
              size="lg"
              h="54px"
              _hover={{
                bg: "gray.300"
              }}
              onClick={handleGuestLogin}
            >
              訪客登入
            </Button>
          </Stack>
        </Box>
        <Box
          bg="white"
          borderRadius="2xl"
          p={8}
          boxShadow="0 4px 6px rgba(0, 0, 0, 0.05)"
        >
          <Text
            textAlign="center"
            mb="24px"
            color="gray.600"
          >
            或使用以下方式繼續
          </Text>
          <Flex
            gap={4}
            justify="center"
          >
            <Button
              variant="outline"
              w="full"
              h="54px"
              borderColor="gray.200"
              _hover={{
                bg: "gray.50"
              }}
            >
              <IconBrandGoogle size={20} />
            </Button>
            <Button
              variant="outline"
              w="full"
              h="54px"
              borderColor="gray.200"
              _hover={{
                bg: "gray.50"
              }}
            >
              <IconBrandApple size={20} />
            </Button>
            <Button
              variant="outline"
              w="full"
              h="54px"
              borderColor="gray.200"
              _hover={{
                bg: "gray.50"
              }}
            >
              <IconBrandFacebook size={20} />
            </Button>
          </Flex>
        </Box>
        <Flex
          justify="center"
          mt={6}
          gap={1}
        >
          <Text color="gray.600">
            還沒有帳號？
          </Text>
          <Button
            variant="link"
            color="blue.500"
            fontWeight="semibold"
            onClick={() => navigate('/register')}
          >
            註冊
          </Button>
        </Flex>
        <Text
          fontSize="12px"
          color="gray.500"
          textAlign="center"
          mt="24px"
        >
          登入即表示您同意我們的服務條款和隱私政策
        </Text>
      </Flex>
    </Flex>
  );
};

export default LoginScreen;
