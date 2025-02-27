import axios from 'axios';

// API 配置
const API_URL = 'https://tbnx.plus7.plus/v1/chat/completions';
const API_KEY = 'sk-itosKfcHEAlse5TYEB2BTUBSMtNO6jAvAykWAgeBjBxlDjJR';
const MODEL = 'deepseek-reasoner';

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface ChatResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export const generateAnswer = async (question: string, category: string): Promise<string> => {
  try {
    console.log(`Generating answer for question: ${question} in category: ${category}`);
    
    // 根據類別添加特定的提示
    let systemPrompt = "你是一個專業的問題解答助手。";
    
    switch (category) {
      case "技术":
        systemPrompt += "專注於解答技術相關問題，提供詳細的技術說明和解決方案。";
        break;
      case "商业":
        systemPrompt += "專注於解答商業相關問題，提供商業策略和市場分析。";
        break;
      case "医疗":
        systemPrompt += "專注於解答醫療相關問題，提供健康建議和醫療知識。請注意，你的回答不能替代專業醫生的診斷。";
        break;
      case "教育":
        systemPrompt += "專注於解答教育相關問題，提供學習方法和教育資源。";
        break;
      case "生活":
        systemPrompt += "專注於解答生活相關問題，提供日常生活技巧和建議。";
        break;
      case "创意":
        systemPrompt += "專注於解答創意相關問題，提供創新思維和創意方法。";
        break;
      default:
        systemPrompt += "提供全面且準確的信息。";
    }

    const messages: ChatMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: question }
    ];

    const requestBody = {
      model: MODEL,
      messages,
      temperature: 0.7,
      max_tokens: 500,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      stream: false
    };

    console.log('Request body:', JSON.stringify(requestBody, null, 2));

    const response = await axios.post<ChatResponse>(API_URL, requestBody, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      }
    });

    console.log('API response:', JSON.stringify(response.data, null, 2));

    if (response.data.choices && response.data.choices.length > 0) {
      return response.data.choices[0].message.content;
    } else {
      console.error('No choices in response:', response.data);
      return '抱歉，我無法生成回答。請稍後再試。';
    }
  } catch (error: any) {
    console.error('Error generating answer:', error);
    
    // 提供更詳細的錯誤信息
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
      
      // 根據狀態碼提供不同的錯誤消息
      switch (error.response.status) {
        case 401:
          return '認證失敗，請檢查 API 密鑰。';
        case 429:
          return '請求過多，請稍後再試。';
        case 500:
          return '服務器錯誤，請稍後再試。';
        default:
          return `發生錯誤 (${error.response.status}): ${error.response.data.error?.message || '未知錯誤'}`;
      }
    }
    
    return '發生錯誤，無法生成回答。請檢查網絡連接並稍後再試。';
  }
};
