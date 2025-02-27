import React from 'react';
import {
  Box,
  Flex,
  Text,
  Button,
  Image,
  Tag,
  IconButton,
  Divider,
  Avatar
} from '@chakra-ui/react';
import {
  ArrowLeft as IconArrowLeft,
  Share as IconShare,
  Bookmark as IconBookmark,
  ThumbUp as IconThumbUp,
  Message as IconMessage
} from 'tabler-icons-react';
import { useNavigate } from 'react-router-dom';
import { kStyleGlobal } from '../theme/theme';

const KnowledgeDetailScreen: React.FC = () => {
  const navigate = useNavigate();
  const category = "居家水電"; // This would typically come from the article data

  return (
    <Flex
      direction="column"
      minH="100vh"
      bg="white"
    >
      {/* Header */}
      <Flex
        bg="white"
        p={4}
        justify="space-between"
        align="center"
        position="sticky"
        top={0}
        zIndex={10}
        borderBottomWidth="1px"
        borderColor="gray.100"
      >
        <IconButton
          aria-label="Back"
          icon={<IconArrowLeft />}
          variant="ghost"
          onClick={() => navigate(-1)}
        />
        <Flex>
          <IconButton
            aria-label="Share"
            icon={<IconShare />}
            variant="ghost"
            mr={2}
          />
          <IconButton
            aria-label="Bookmark"
            icon={<IconBookmark />}
            variant="ghost"
          />
        </Flex>
      </Flex>

      {/* Content */}
      <Box p={6}>
        <Image
          src="https://images.unsplash.com/photo-1581244277943-fe4a9c777189"
          alt="家庭水電維修指南"
          w="100%"
          h="200px"
          objectFit="cover"
          borderRadius="xl"
          mb={6}
        />

        <Text
          fontSize="24px"
          fontWeight="700"
          mb={4}
        >
          家庭水電維修指南
        </Text>

        <Flex gap={2} mb={6}>
          <Tag
            bg="black"
            color="white"
            borderRadius="full"
            size="sm"
          >
            {category}
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

        <Flex align="center" mb={6}>
          <Avatar size="sm" mr={3} src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde" />
          <Box>
            <Text fontWeight="600" fontSize="sm">李師傅</Text>
            <Text fontSize="xs" color="gray.500">水電專家 • 發布於 2023年10月15日</Text>
          </Box>
        </Flex>

        <Divider mb={6} />

        <Text mb={4}>
          家庭水電問題是我們日常生活中常見的困擾，了解基本的維修知識不僅可以幫助您解決簡單問題，還能在專業幫助到達前防止情況惡化。
        </Text>

        <Text fontWeight="700" fontSize="18px" mb={3}>
          常見水管問題
        </Text>

        <Text mb={4}>
          1. <strong>水龍頭漏水</strong>：通常是因為墊圈磨損。關閉水源，拆開水龍頭，更換墊圈即可解決。
        </Text>

        <Text mb={4}>
          2. <strong>馬桶持續沖水</strong>：檢查水箱內的浮球和閥門，調整或更換損壞部件。
        </Text>

        <Text mb={4}>
          3. <strong>排水管堵塞</strong>：可以使用疏通器或嘗試用熱水和小蘇打的混合物沖洗。
        </Text>

        <Text fontWeight="700" fontSize="18px" mb={3} mt={6}>
          常見電路問題
        </Text>

        <Text mb={4}>
          1. <strong>跳閘</strong>：當電路過載時會發生。找出導致過載的設備，減少使用或分散到不同電路。
        </Text>

        <Text mb={4}>
          2. <strong>插座不工作</strong>：檢查是否跳閘，或使用測電筆檢測是否有電。
        </Text>

        <Text mb={4}>
          3. <strong>燈具閃爍</strong>：可能是燈泡松動或需要更換，也可能是線路問題。
        </Text>

        <Text fontWeight="700" fontSize="18px" mb={3} mt={6}>
          安全注意事項
        </Text>

        <Text mb={4}>
          • 進行任何水電維修前，確保已關閉相關水源或電源。
        </Text>

        <Text mb={4}>
          • 不確定如何操作時，請尋求專業幫助，避免造成更大損壞或安全隱患。
        </Text>

        <Text mb={4}>
          • 保持工具乾燥，避免電器接觸水源。
        </Text>

        <Text mb={4}>
          • 定期檢查家中水電設施，預防問題發生。
        </Text>
      </Box>

      {/* Interaction Bar */}
      <Flex
        p={4}
        borderTopWidth="1px"
        borderColor="gray.100"
        justify="space-between"
        position="sticky"
        bottom={0}
        bg="white"
      >
        <Flex align="center">
          <Button leftIcon={<IconThumbUp />} variant="ghost" mr={4}>
            有幫助 (24)
          </Button>
          <Button leftIcon={<IconMessage />} variant="ghost">
            評論 (8)
          </Button>
        </Flex>
        <Button 
          colorScheme="blue" 
          variant="solid"
          onClick={() => navigate(`/expert-list?category=${encodeURIComponent(category)}`)}
        >
          諮詢專家
        </Button>
      </Flex>
    </Flex>
  );
};

export default KnowledgeDetailScreen;
