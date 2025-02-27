import React, { useState } from 'react';
import {
  Box,
  Flex,
  Text,
  Button,
  Input,
  InputGroup,
  InputLeftElement,
  Grid,
  Tag,
  Image,
  useDisclosure,
  Avatar
} from '@chakra-ui/react';
import {
  Bell as IconBell,
  Search as IconSearch,
  Book as IconBook,
  Tool as IconTool,
  Math as IconMath,
  Language as IconLanguage,
  Atom as IconAtom,
  World as IconWorld,
  Clock as IconClock
} from 'tabler-icons-react';
import { useNavigate } from 'react-router-dom';
import { kStyleGlobal } from '../theme/theme';

const KnowledgeBaseScreen: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("居家水電");
  
  const recentItems = ["水龍頭維修", "電路故障", "數學作業", "英語學習"];
  
  const categories = [
    {
      "name": "居家水電",
      "icon": "tool"
    },
    {
      "name": "數學",
      "icon": "math"
    },
    {
      "name": "英語",
      "icon": "language"
    },
    {
      "name": "自然",
      "icon": "atom"
    },
    {
      "name": "社會",
      "icon": "world"
    }
  ];

  return (
    <Flex
      direction="column"
      h="100vh"
      bg="gray.50"
    >
      <Box
        bg="white"
        p={6}
        borderBottomWidth={1}
        borderColor="gray.100"
      >
        <Flex
          justify="space-between"
          align="center"
          mb={6}
        >
          <Text
            fontSize="24px"
            fontWeight="700"
            color={kStyleGlobal.colors.dark}
          >
            知識庫
          </Text>
          <Button
            variant="ghost"
            borderRadius="full"
          >
            <IconBell
              size={22}
              color={kStyleGlobal.colors.dark}
            />
          </Button>
        </Flex>
        <InputGroup>
          <InputLeftElement
            pointerEvents="none"
            h="full"
            pl={4}
          >
            <IconSearch
              size={20}
              color="gray.400"
            />
          </InputLeftElement>
          <Input
            placeholder="搜索知識庫..."
            bg="gray.50"
            h="50px"
            borderRadius="xl"
            pl={12}
            border="none"
            _focus={{
              bg: "gray.100"
            }}
          />
        </InputGroup>
      </Box>
      
      <Flex
        overflowX="auto"
        p={6}
        css={{
          scrollbarWidth: "none",
          "::-webkit-scrollbar": {
            display: "none"
          }
        }}
      >
        <Flex gap={4}>
          {categories.map(cat => (
            <Button
              key={cat.name}
              bg={cat.name === selectedCategory ? "black" : "white"}
              color={cat.name === selectedCategory ? "white" : "gray.600"}
              px={6}
              py={3}
              borderRadius="full"
              shadow="sm"
              _hover={{
                transform: "translateY(-2px)"
              }}
              transition="all 0.2s"
              onClick={() => setSelectedCategory(cat.name)}
            >
              <Flex
                align="center"
                gap={2}
              >
                {cat.icon === "tool" && (
                  <IconTool size={18} />
                )}
                {cat.icon === "math" && (
                  <IconMath size={18} />
                )}
                {cat.icon === "language" && (
                  <IconLanguage size={18} />
                )}
                {cat.icon === "atom" && (
                  <IconAtom size={18} />
                )}
                {cat.icon === "world" && (
                  <IconWorld size={18} />
                )}
                <Text>{cat.name}</Text>
              </Flex>
            </Button>
          ))}
        </Flex>
      </Flex>
      
      <Box
        flex={1}
        p={6}
        overflowY="auto"
      >
        <Text
          fontSize="20px"
          fontWeight="700"
          mb="20px"
        >
          熱門主題
        </Text>
        <Grid
          templateColumns="repeat(2, 1fr)"
          gap={4}
          mb={8}
        >
          {["水管漏水維修", "電路安全檢查", "小學數學基礎", "英語語法要點"].map((topic, i) => (
            <Box
              key={i}
              bg="white"
              p={6}
              borderRadius="xl"
              shadow="sm"
              onClick={() => {
                navigate("/knowledge-detail");
              }}
              cursor="pointer"
              transition="all 0.2s"
              _hover={{
                transform: "translateY(-2px)",
                shadow: "md"
              }}
            >
              <Flex
                direction="column"
                gap={3}
              >
                <IconBook
                  size={24}
                  color="black"
                />
                <Text
                  fontWeight="600"
                  fontSize="16px"
                >
                  {topic}
                </Text>
                <Text
                  color="gray.500"
                  fontSize="14px"
                >
                  查看詳情 →
                </Text>
              </Flex>
            </Box>
          ))}
        </Grid>
        
        <Flex
          direction="column"
          gap={6}
        >
          <Text
            fontSize="20px"
            fontWeight="700"
          >
            最近瀏覽
          </Text>
          {recentItems.map((item, i) => (
            <Box
              key={i}
              bg="white"
              p={4}
              borderRadius="xl"
              shadow="sm"
            >
              <Flex
                justify="space-between"
                align="center"
              >
                <Flex
                  align="center"
                  gap={3}
                >
                  <IconClock
                    size={18}
                    color="gray.500"
                  />
                  <Text
                    fontSize="15px"
                  >
                    {item}
                  </Text>
                </Flex>
                <Text
                  color="gray.500"
                  fontSize="14px"
                >
                  2小時前
                </Text>
              </Flex>
            </Box>
          ))}
        </Flex>
        
        <Flex
          direction="column"
          gap={4}
          mt={8}
        >
          <Text
            fontSize="20px"
            fontWeight="700"
          >
            推薦內容
          </Text>
          <Box
            bg="white"
            borderRadius="xl"
            overflow="hidden"
            shadow="sm"
          >
            <Image
              src="https://images.unsplash.com/photo-1581244277943-fe4a9c777189"
              alt="家庭水電維修指南"
              w="100%"
              h="200px"
              objectFit="cover"
            />
            <Box p={6}>
              <Text
                fontSize="18px"
                fontWeight="700"
                mb="8px"
              >
                家庭水電維修指南
              </Text>
              <Text
                color="gray.600"
                fontSize="14px"
                mb="16px"
              >
                常見家庭水電問題的解決方案和安全注意事項
              </Text>
              <Flex gap={2}>
                <Tag
                  bg="black"
                  color="white"
                  borderRadius="full"
                  size="sm"
                >
                  居家水電
                </Tag>
                <Tag
                  bg="gray.100"
                  color="gray.600"
                  borderRadius="full"
                  size="sm"
                >
                  基礎
                </Tag>
              </Flex>
            </Box>
          </Box>
        </Flex>
      </Box>
    </Flex>
  );
};

export default KnowledgeBaseScreen;
