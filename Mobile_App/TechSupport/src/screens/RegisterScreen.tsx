import React, { useState, FormEvent } from 'react';
import {
  ChakraProvider,
  Box,
  Flex,
  Button,
  Input,
  InputGroup,
  InputLeftElement,
  Progress,
  Text,
  Checkbox,
  useToast,
  RadioGroup,
  Radio,
  Stack,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Lock,
  BrandGoogle,
  BrandFacebook,
  BrandInstagram,
  Calendar
} from 'tabler-icons-react';
import { kStyleGlobal } from '../theme/theme';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

interface FormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
  userType: 'user' | 'expert';
  birthYear: string;
}

interface PasswordStrength {
  score: number;
  message: string;
}

const RegisterScreen: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();
  
  const [formData, setFormData] = useState<FormData>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
    userType: 'user',
    birthYear: ''
  });

  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    message: ''
  });
  
  const [ageError, setAgeError] = useState('');

  const checkPasswordStrength = (password: string) => {
    let score = 0;
    if (password.length >= 8) score += 25;
    if (password.match(/[A-Z]/)) score += 25;
    if (password.match(/[0-9]/)) score += 25;
    if (password.match(/[^A-Za-z0-9]/)) score += 25;

    let message = '';
    if (score >= 75) message = '強';
    else if (score >= 50) message = '中';
    else message = '弱';

    setPasswordStrength({ score, message });
  };

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (field === 'password' && typeof value === 'string') {
      checkPasswordStrength(value);
    }
    
    // 清除年齡錯誤提示（如果有）
    if (field === 'birthYear') {
      setAgeError('');
    }
  };

  const validateAge = (): boolean => {
    if (formData.userType === 'expert') {
      const birthYear = parseInt(formData.birthYear);
      const currentYear = new Date().getFullYear();
      
      if (!formData.birthYear || isNaN(birthYear)) {
        setAgeError('請輸入出生年份');
        return false;
      }
      
      const age = currentYear - birthYear;
      
      if (age < 12) {
        setAgeError('專家用戶必須年滿12歲');
        return false;
      }
    }
    return true;
  };

  const handleRegister = async () => {
    if (!formData.agreeToTerms) {
      toast({
        title: '請同意用戶協議和隱私政策',
        status: 'error',
        duration: 3000,
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: '密碼不匹配',
        status: 'error',
        duration: 3000,
      });
      return;
    }
    
    // 驗證年齡（如果是專家用戶）
    if (!validateAge()) {
      return;
    }

    try {
      const { error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            username: formData.username,
            user_type: formData.userType,
            birth_year: formData.birthYear ? parseInt(formData.birthYear) : null
          }
        }
      });

      if (error) throw error;

      toast({
        title: '註冊成功',
        description: formData.userType === 'expert' ? '您已註冊為專家用戶' : '您已註冊為普通用戶',
        status: 'success',
        duration: 3000,
      });
      navigate('/');
    } catch (error) {
      toast({
        title: '註冊失敗',
        description: error instanceof Error ? error.message : '未知錯誤',
        status: 'error',
        duration: 3000,
      });
    }
  };
  
  const handleGoogleSignUp = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + '/onboarding'
        }
      });
      
      if (error) throw error;
    } catch (error) {
      toast({
        title: 'Google 註冊失敗',
        description: error instanceof Error ? error.message : '未知錯誤',
        status: 'error',
        duration: 3000,
      });
    }
  };
  
  const handleFacebookSignUp = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'facebook',
        options: {
          redirectTo: window.location.origin + '/onboarding'
        }
      });
      
      if (error) throw error;
    } catch (error) {
      toast({
        title: 'Facebook 註冊失敗',
        description: error instanceof Error ? error.message : '未知錯誤',
        status: 'error',
        duration: 3000,
      });
    }
  };
  
  const handleInstagramSignUp = async () => {
    // 注意：Supabase 目前不直接支持 Instagram 登錄
    // 這裡可以使用其他第三方服務或自定義實現
    toast({
      title: '功能開發中',
      description: 'Instagram 登錄功能即將推出',
      status: 'info',
      duration: 3000,
    });
  };

  return (
    <ChakraProvider theme={kStyleGlobal}>
      <Flex
        direction="column"
        minH="100vh"
        bg="gray.50"
      >
        <Box
          px={6}
          py={8}
          bg="white"
        >
          <Flex
            align="center"
            mb={8}
          >
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              mr={3}
            >
              <ArrowLeft
                size={24}
                color={kStyleGlobal.colors.gray[700]}
              />
            </Button>
            <Text
              fontSize="24px"
              fontWeight="700"
              color={kStyleGlobal.colors.gray[900]}
            >
              註冊
            </Text>
          </Flex>

          <form onSubmit={(e: FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            handleRegister();
          }}>
            <Flex direction="column" gap={6}>
              {/* User Type Selection */}
              <Flex direction="column" gap={2}>
                <Text
                  fontSize="14px"
                  fontWeight="600"
                  color={kStyleGlobal.colors.gray[700]}
                >
                  用戶類型
                </Text>
                <RadioGroup 
                  value={formData.userType} 
                  onChange={(value) => handleInputChange('userType', value as 'user' | 'expert')}
                >
                  <Stack direction="row" spacing={5}>
                    <Radio value="user" colorScheme="blue">普通用戶</Radio>
                    <Radio value="expert" colorScheme="green">專家用戶</Radio>
                  </Stack>
                </RadioGroup>
                <Text fontSize="12px" color="gray.500" mt={1}>
                  {formData.userType === 'user' 
                    ? '普通用戶可以提出諮詢請求' 
                    : '專家用戶可以接受諮詢請求（需年滿12歲）'}
                </Text>
              </Flex>

              {/* Birth Year Input (for experts) */}
              {(formData.userType === 'expert') && (
                <FormControl isInvalid={!!ageError}>
                  <FormLabel
                    fontSize="14px"
                    fontWeight="600"
                    color={kStyleGlobal.colors.gray[700]}
                  >
                    出生年份
                  </FormLabel>
                  <InputGroup>
                    <InputLeftElement
                      pointerEvents="none"
                      children={<Calendar size={20} color="gray.400" />}
                    />
                    <Input
                      type="number"
                      placeholder="例如：2000"
                      bg="gray.50"
                      border="none"
                      h="54px"
                      fontSize="md"
                      pl={12}
                      value={formData.birthYear}
                      onChange={(e) => handleInputChange('birthYear', e.target.value)}
                    />
                  </InputGroup>
                  {ageError && <FormErrorMessage>{ageError}</FormErrorMessage>}
                </FormControl>
              )}

              {/* Username Input */}
              <Flex direction="column" gap={2}>
                <Text
                  fontSize="14px"
                  fontWeight="600"
                  color={kStyleGlobal.colors.gray[700]}
                >
                  用戶名
                </Text>
                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                    children={<User size={20} color="gray.400" />}
                  />
                  <Input
                    type="text"
                    placeholder="請輸入用戶名"
                    bg="gray.50"
                    border="none"
                    h="54px"
                    fontSize="md"
                    pl={12}
                    value={formData.username}
                    onChange={(e) => handleInputChange('username', e.target.value)}
                  />
                </InputGroup>
              </Flex>

              {/* Email Input */}
              <Flex direction="column" gap={2}>
                <Text
                  fontSize="14px"
                  fontWeight="600"
                  color={kStyleGlobal.colors.gray[700]}
                >
                  電子郵箱
                </Text>
                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                    children={<Mail size={20} color="gray.400" />}
                  />
                  <Input
                    type="email"
                    placeholder="請輸入電子郵箱"
                    bg="gray.50"
                    border="none"
                    h="54px"
                    fontSize="md"
                    pl={12}
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                  />
                </InputGroup>
              </Flex>

              {/* Password Input */}
              <Flex direction="column" gap={2}>
                <Text
                  fontSize="14px"
                  fontWeight="600"
                  color={kStyleGlobal.colors.gray[700]}
                >
                  密碼
                </Text>
                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                    children={<Lock size={20} color="gray.400" />}
                  />
                  <Input
                    type="password"
                    placeholder="至少8位字符"
                    bg="gray.50"
                    border="none"
                    h="54px"
                    fontSize="md"
                    pl={12}
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                  />
                </InputGroup>
                <Progress
                  value={passwordStrength.score}
                  size="xs"
                  colorScheme={passwordStrength.score >= 75 ? "green" : passwordStrength.score >= 50 ? "yellow" : "red"}
                  borderRadius="full"
                  mt={2}
                />
                <Text
                  fontSize="12px"
                  color={passwordStrength.score >= 75 ? "green.500" : passwordStrength.score >= 50 ? "yellow.500" : "red.500"}
                  mt="4px"
                >
                  密碼強度：{passwordStrength.message}
                </Text>
              </Flex>

              {/* Confirm Password Input */}
              <Flex direction="column" gap={2}>
                <Text
                  fontSize="14px"
                  fontWeight="600"
                  color={kStyleGlobal.colors.gray[700]}
                >
                  確認密碼
                </Text>
                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                    children={<Lock size={20} color="gray.400" />}
                  />
                  <Input
                    type="password"
                    placeholder="請再次輸入密碼"
                    bg="gray.50"
                    border="none"
                    h="54px"
                    fontSize="md"
                    pl={12}
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  />
                </InputGroup>
              </Flex>

              {/* Terms Checkbox */}
              <Checkbox
                colorScheme="gray"
                size="md"
                mt={2}
                isChecked={formData.agreeToTerms}
                onChange={(e) => handleInputChange('agreeToTerms', e.target.checked)}
              >
                <Flex align="center" gap={1}>
                  <Text fontSize="14px" color={kStyleGlobal.colors.gray[600]}>
                    我已閱讀並同意
                  </Text>
                  <Text
                    fontSize="14px"
                    color="blue.500"
                    textDecoration="underline"
                    cursor="pointer"
                  >
                    用戶協議
                  </Text>
                  <Text fontSize="14px" color={kStyleGlobal.colors.gray[600]}>
                    和
                  </Text>
                  <Text
                    fontSize="14px"
                    color="blue.500"
                    textDecoration="underline"
                    cursor="pointer"
                  >
                    隱私政策
                  </Text>
                </Flex>
              </Checkbox>

              {/* Register Button */}
              <Button
                bg="black"
                color="white"
                size="lg"
                h="54px"
                fontSize="md"
                fontWeight="600"
                _hover={{
                  bg: "gray.800"
                }}
                mt={4}
                onClick={handleRegister}
              >
                註冊
              </Button>

              {/* Social Login Section */}
              <Flex
                direction="column"
                align="center"
                mt={8}
                gap={6}
              >
                <Text
                  fontSize="14px"
                  color={kStyleGlobal.colors.gray[500]}
                >
                  或通過社交媒體帳號直接註冊
                </Text>
                <Flex gap={4}>
                  <Button
                    variant="outline"
                    borderRadius="full"
                    w="50px"
                    h="50px"
                    borderColor="red.400"
                    bg="white"
                    _hover={{
                      bg: "red.50"
                    }}
                    onClick={handleGoogleSignUp}
                  >
                    <BrandGoogle size={24} color="#DB4437" />
                  </Button>
                  <Button
                    variant="outline"
                    borderRadius="full"
                    w="50px"
                    h="50px"
                    borderColor="blue.500"
                    bg="white"
                    _hover={{
                      bg: "blue.50"
                    }}
                    onClick={handleFacebookSignUp}
                  >
                    <BrandFacebook size={24} color="#4267B2" />
                  </Button>
                  <Button
                    variant="outline"
                    borderRadius="full"
                    w="50px"
                    h="50px"
                    borderColor="purple.500"
                    bg="white"
                    _hover={{
                      bg: "purple.50"
                    }}
                    onClick={handleInstagramSignUp}
                  >
                    <BrandInstagram size={24} color="#C13584" />
                  </Button>
                </Flex>

                {/* Login Link */}
                <Flex
                  align="center"
                  gap={1}
                  mt={4}
                >
                  <Text
                    fontSize="14px"
                    color={kStyleGlobal.colors.gray[600]}
                  >
                    已有帳號？
                  </Text>
                  <Button
                    variant="link"
                    color="blue.500"
                    fontWeight="600"
                    onClick={() => navigate('/login')}
                  >
                    立即登錄
                  </Button>
                </Flex>
              </Flex>
            </Flex>
          </form>
        </Box>
      </Flex>
    </ChakraProvider>
  );
};

export default RegisterScreen;
