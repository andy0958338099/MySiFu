import React, { useState, useEffect } from 'react';
import {
  ChakraProvider,
  Flex,
  Text,
  Card,
  CardBody,
  Divider,
  Badge,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  useToast,
  Box,
  Spacer
} from '@chakra-ui/react';
import { Star, Check, ArrowLeft, List } from 'tabler-icons-react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { kStyleGlobal } from '../theme/theme';
import { supabase } from '../lib/supabase';
import { saveExpertResponse, acceptConsultation, getConsultationById } from '../lib/expertService';
import confetti from 'canvas-confetti';

interface ConsultationRequest {
  id: string;
  title: string;
  description: string;
  type: string;
  status: string;
  user_id: string;
  created_at: string;
  priority: string;
  user_name: string;
}

const ExpertConsultationScreen: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  
  // State variables
  const [complexity, setComplexity] = useState<number>(0);
  const [estimatedTime, setEstimatedTime] = useState<string>("");
  const [suggestedPrice, setSuggestedPrice] = useState<string>("");
  const [userBudget, setUserBudget] = useState<string>("");
  const [analysis, setAnalysis] = useState<string>("");
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [consultationRequest, setConsultationRequest] = useState<ConsultationRequest | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // Template options
  const templates = [
    {
      "title": "基本評估",
      "content": "我已經初步評估您的居家修繕需求，這是一個需要專業處理的案例。我會根據多年維修經驗為您提供最佳解決方案。"
    },
    {
      "title": "需要更多信息",
      "content": "您的修繕需求很明確，為了提供更精準的報價，我需要一些額外照片或資訊。請問您能否提供損壞部位的更多細節照片？"
    },
    {
      "title": "複雜問題",
      "content": "這是一個較為複雜的修繕工程，需要深入評估和多方面考慮。建議安排現場勘查，以便制定完整的維修方案。"
    }
  ];

  // Load consultation data
  useEffect(() => {
    const fetchConsultation = async () => {
      try {
        setIsLoading(true);
        // Get consultation ID from URL params or location state
        const consultationId = new URLSearchParams(location.search).get('id') || 
                              (location.state as any)?.consultationId || "1";
        
        // In a real app, fetch from database
        // For demo, we'll use mock data if no ID is provided
        if (consultationId === "1") {
          setConsultationRequest({
            id: "1",
            title: "浴室水管漏水",
            description: "浴室水管漏水，天花板有滲水痕跡，需要專業師傅檢查並維修。希望能在本週內完成修繕工程。",
            type: "水電維修",
            status: "pending",
            user_id: "user123",
            created_at: "2025-02-27T14:30:00Z",
            priority: "緊急",
            user_name: "林小姐"
          });
        } else {
          // Fetch real data from Supabase
          const data = await getConsultationById(consultationId);
          if (data) {
            setConsultationRequest({
              id: data.id,
              title: data.title,
              description: data.description,
              type: data.type,
              status: data.status,
              user_id: data.user_id,
              created_at: data.created_at,
              priority: data.priority || "一般",
              user_name: data.profiles?.full_name || "用戶"
            });
          }
        }
      } catch (error) {
        console.error('Error fetching consultation:', error);
        toast({
          title: "載入失敗",
          description: "無法載入諮詢請求",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchConsultation();
  }, [location, toast]);

  // Function to handle template selection
  const handleTemplateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value;
    const template = templates.find(t => t.content === selected);
    if (template) {
      setSelectedTemplate(template.content);
    }
  };

  // Function to save the expert's response
  const saveResponse = async () => {
    try {
      if (!consultationRequest) {
        throw new Error("No consultation request found");
      }
      
      if (!complexity || !estimatedTime || !suggestedPrice || !selectedTemplate) {
        toast({
          title: "資料不完整",
          description: "請填寫所有必要欄位",
          status: "warning",
          duration: 5000,
          isClosable: true,
        });
        return;
      }
      
      // Save to database
      await saveExpertResponse({
        consultation_id: consultationRequest.id,
        complexity,
        estimated_time: estimatedTime,
        suggested_price: suggestedPrice,
        response_message: selectedTemplate,
        status: "responded"
      });
      
      toast({
        title: "報價已發送",
        description: "您的專業評估和報價已成功發送給客戶",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error saving response:', error);
      toast({
        title: "發送失敗",
        description: "請稍後再試",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  // Function to accept the consultation
  const handleAcceptCase = async () => {
    try {
      if (!consultationRequest) {
        throw new Error("No consultation request found");
      }
      
      // Accept the consultation
      await acceptConsultation(consultationRequest.id);
      
      // Trigger confetti effect
      triggerConfetti();
      
      toast({
        title: "案件已接受",
        description: "您已成功接受此案件",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error accepting case:', error);
      toast({
        title: "接受失敗",
        description: "請稍後再試",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  // Function to trigger confetti effect
  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  return (
    <ChakraProvider theme={kStyleGlobal}>
      <Flex
        direction={"column"}
        h={"100vh"}
        bg={"gray.50"}
        p={4}
        gap={4}
      >
        <Flex justifyContent="space-between" alignItems="center" mb={2}>
          <Button 
            leftIcon={<ArrowLeft />} 
            variant="ghost" 
            onClick={() => navigate(-1)}
          >
            返回
          </Button>
          <Button 
            rightIcon={<List />} 
            colorScheme="blue" 
            variant="outline"
            onClick={() => navigate('/expert-consultations')}
          >
            查看所有諮詢
          </Button>
        </Flex>
        {consultationRequest && (
          <>
            <motion.div
              initial={{
                opacity: 0,
                y: -20
              }}
              animate={{
                opacity: 1,
                y: 0
              }}
              transition={{
                duration: 0.5
              }}
            >
              <Card
                p={6}
                shadow={"md"}
                borderRadius={"xl"}
              >
                <Flex
                  direction={"column"}
                  gap={4}
                >
                  <Flex
                    alignItems={"center"}
                    gap={4}
                  >
                    <Flex direction={"column"}>
                      <Text
                        fontSize={"xl"}
                        fontWeight={"bold"}
                      >
                        修繕需求摘要
                      </Text>
                      <Text
                        color={"gray.500"}
                        fontSize={"sm"}
                      >
                        {consultationRequest.user_name}
                      </Text>
                    </Flex>
                  </Flex>
                  <Divider />
                  <Flex
                    gap={4}
                    wrap={"wrap"}
                  >
                    <Badge colorScheme={"orange"}>
                      {consultationRequest.type}
                    </Badge>
                    <Badge colorScheme={"red"}>
                      優先級：{consultationRequest.priority}
                    </Badge>
                  </Flex>
                  <Text
                    color={"gray.600"}
                  >
                    {consultationRequest.description}
                  </Text>
                </Flex>
              </Card>
            </motion.div>
            <motion.div
              initial={{
                opacity: 0,
                y: 20
              }}
              animate={{
                opacity: 1,
                y: 0
              }}
              transition={{
                duration: 0.5,
                delay: 0.2
              }}
            >
              <Card
                p={6}
                shadow={"md"}
                borderRadius={"xl"}
              >
                <Flex
                  direction={"column"}
                  gap={6}
                >
                  <Flex
                    alignItems={"center"}
                    gap={4}
                  >
                    <Flex direction={"column"}>
                      <Text
                        fontSize={"xl"}
                        fontWeight={"bold"}
                      >
                        專業評估
                      </Text>
                      <Text
                        color={"gray.500"}
                        fontSize={"sm"}
                      >
                        請提供您的專業意見
                      </Text>
                    </Flex>
                  </Flex>
                  <Flex
                    direction={"column"}
                    gap={4}
                  >
                    <Text>維修難度</Text>
                    <Flex gap={2}>
                      {Array(5).fill("1").map((_, i) => (
                        <Button
                          key={i}
                          onClick={() => {
                            setComplexity(i + 1);
                          }}
                          variant={"ghost"}
                          color={i < complexity ? "yellow.400" : "gray.300"}
                        >
                          <Star size={24} />
                        </Button>
                      ))}
                    </Flex>
                  </Flex>
                  <Flex gap={4}>
                    <FormControl flex={1}>
                      <FormLabel>
                        預估工期
                      </FormLabel>
                      <Input
                        placeholder={"例：1-2天"}
                        value={estimatedTime}
                        onChange={(e) => {
                          setEstimatedTime(e.target.value);
                        }}
                      />
                    </FormControl>
                    <FormControl flex={1}>
                      <FormLabel>
                        用戶預算
                      </FormLabel>
                      <Input
                        placeholder={"用戶期望金額"}
                        value={userBudget}
                        onChange={(e) => {
                          setUserBudget(e.target.value);
                        }}
                      />
                    </FormControl>
                  </Flex>
                  <FormControl>
                    <FormLabel>
                      建議報價
                    </FormLabel>
                    <Input
                      placeholder={"輸入維修報價"}
                      value={suggestedPrice}
                      onChange={(e) => {
                        setSuggestedPrice(e.target.value);
                      }}
                    />
                  </FormControl>
                </Flex>
              </Card>
            </motion.div>
            <motion.div
              initial={{
                opacity: 0,
                y: 20
              }}
              animate={{
                opacity: 1,
                y: 0
              }}
              transition={{
                duration: 0.5,
                delay: 0.4
              }}
            >
              <Card
                p={6}
                shadow={"md"}
                borderRadius={"xl"}
              >
                <Flex
                  direction={"column"}
                  gap={4}
                >
                  <Text
                    fontSize={"xl"}
                    fontWeight={"bold"}
                  >
                    回覆模板
                  </Text>
                  <Select
                    placeholder={"選擇回覆模板"}
                    onChange={handleTemplateChange}
                  >
                    {templates.map((template, index) => (
                      <option
                        key={index}
                        value={template.content}
                      >
                        {template.title}
                      </option>
                    ))}
                  </Select>
                  <Textarea
                    rows={4}
                    value={selectedTemplate}
                    onChange={(e) => {
                      setSelectedTemplate(e.target.value);
                    }}
                  />
                  <Flex
                    justifyContent={"flex-end"}
                    gap={4}
                  >
                    <Button variant={"outline"}>
                      保存草稿
                    </Button>
                    <Button colorScheme={"blue"} onClick={saveResponse}>
                      發送報價
                    </Button>
                  </Flex>
                </Flex>
              </Card>
            </motion.div>
            <motion.div
              style={{
                position: "fixed",
                bottom: "24px",
                right: "24px"
              }}
              whileHover={{
                scale: 1.1
              }}
              whileTap={{
                scale: 0.9
              }}
            >
              <Button
                size={"lg"}
                colorScheme={"green"}
                borderRadius={"full"}
                shadow={"lg"}
                leftIcon={<Check />}
                onClick={handleAcceptCase}
              >
                接受案件
              </Button>
            </motion.div>
          </>
        )}
      </Flex>
    </ChakraProvider>
  );
};

export default ExpertConsultationScreen;
