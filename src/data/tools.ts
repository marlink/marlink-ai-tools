import type { Tool } from '../types';

export const initialTools: Tool[] = [
  {
    id: 1,
    name: 'ChatGPT',
    description: 'Advanced conversational AI by OpenAI for natural language processing and generation.',
    category: 'Conversational AI',
    url: 'https://chat.openai.com',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg',
    keywords: ['conversation', 'text-generation', 'coding', 'writing'],
    popularity: {
      daily: 98,
      weekly: 95,
      monthly: 92
    },
    freeTier: true,
    monthlyCost: 20,
    notes: 'Most popular AI chatbot with GPT-4 capabilities'
  },
  {
    id: 2,
    name: 'Claude',
    description: 'Anthropic\'s AI assistant focused on being helpful, harmless, and honest.',
    category: 'Conversational AI',
    url: 'https://claude.ai',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/47/Claude_AI_logo.svg',
    keywords: ['conversation', 'analysis', 'writing', 'coding'],
    popularity: {
      daily: 92,
      weekly: 89,
      monthly: 85
    },
    freeTier: true,
    monthlyCost: 20,
    notes: 'Known for detailed analysis and safety'
  },
  {
    id: 3,
    name: 'Midjourney',
    description: 'AI-powered image generation tool creating stunning artwork from text prompts.',
    category: 'Image Generation',
    url: 'https://midjourney.com',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/ed/Midjourney_Emblem.png',
    keywords: ['image-generation', 'art', 'creative', 'discord'],
    popularity: {
      daily: 95,
      weekly: 93,
      monthly: 90
    },
    freeTier: false,
    monthlyCost: 10,
    notes: 'Premium quality AI art generation'
  },
  {
    id: 4,
    name: 'GitHub Copilot',
    description: 'AI pair programmer that helps you write code faster with intelligent suggestions.',
    category: 'Code Assistant',
    url: 'https://github.com/features/copilot',
    imageUrl: 'https://github.githubassets.com/images/modules/site/copilot/copilot.png',
    keywords: ['coding', 'programming', 'autocomplete', 'github'],
    popularity: {
      daily: 89,
      weekly: 87,
      monthly: 84
    },
    freeTier: false,
    monthlyCost: 10,
    notes: 'Integrated with popular IDEs'
  },
  {
    id: 5,
    name: 'Stable Diffusion',
    description: 'Open-source text-to-image diffusion model for generating detailed images.',
    category: 'Image Generation',
    url: 'https://stability.ai/stable-diffusion',
    imageUrl: 'https://cdn.icon-icons.com/icons2/3914/PNG/512/stability_ai_logo_icon_248679.png',
    keywords: ['image-generation', 'open-source', 'diffusion', 'customizable'],
    popularity: {
      daily: 87,
      weekly: 85,
      monthly: 82
    },
    freeTier: true,
    monthlyCost: null,
    notes: 'Highly customizable and free to use'
  },
  {
    id: 6,
    name: 'Notion AI',
    description: 'AI writing assistant integrated into Notion for enhanced productivity.',
    category: 'Writing Assistant',
    url: 'https://notion.so/product/ai',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/4d/Notion_app_logo.png',
    keywords: ['writing', 'productivity', 'notes', 'collaboration'],
    popularity: {
      daily: 84,
      weekly: 82,
      monthly: 79
    },
    freeTier: true,
    monthlyCost: 8,
    notes: 'Seamlessly integrated with Notion workspace'
  },
  {
    id: 7,
    name: 'Jasper',
    description: 'AI content creation platform for marketing teams and content creators.',
    category: 'Content Creation',
    url: 'https://jasper.ai',
    imageUrl: 'https://asset.brandfetch.io/idAnDTF_Y_/idG3bYpWjC.svg',
    keywords: ['content-creation', 'marketing', 'copywriting', 'templates'],
    popularity: {
      daily: 81,
      weekly: 79,
      monthly: 76
    },
    freeTier: false,
    monthlyCost: 39,
    notes: 'Specialized for marketing content'
  },
  {
    id: 8,
    name: 'DALL-E 2',
    description: 'OpenAI\'s image generation model creating realistic images from text descriptions.',
    category: 'Image Generation',
    url: 'https://openai.com/dall-e-2',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/4d/OpenAI_Logo.svg',
    keywords: ['image-generation', 'openai', 'realistic', 'creative'],
    popularity: {
      daily: 86,
      weekly: 84,
      monthly: 81
    },
    freeTier: true,
    monthlyCost: null,
    notes: 'High-quality realistic image generation'
  }
];

// Utility functions
export const getFeaturedTools = (tools: Tool[], count: number = 3): Tool[] => {
  return tools
    .sort((a, b) => b.popularity.weekly - a.popularity.weekly)
    .slice(0, count);
};

export const searchTools = (tools: Tool[], query: string): Tool[] => {
  if (!query.trim()) return tools;
  
  const searchTerm = query.toLowerCase();
  return tools.filter(tool => 
    tool.name.toLowerCase().includes(searchTerm) ||
    tool.description.toLowerCase().includes(searchTerm) ||
    tool.category.toLowerCase().includes(searchTerm) ||
    tool.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm))
  );
};

export const sortTools = (tools: Tool[], sortBy: 'Daily' | 'Weekly' | 'Monthly'): Tool[] => {
  return [...tools].sort((a, b) => {
    switch (sortBy) {
      case 'Daily':
        return b.popularity.daily - a.popularity.daily;
      case 'Weekly':
        return b.popularity.weekly - a.popularity.weekly;
      case 'Monthly':
        return b.popularity.monthly - a.popularity.monthly;
      default:
        return b.popularity.weekly - a.popularity.weekly;
    }
  });
};

export const getCategories = (tools: Tool[]): string[] => {
  const categories = new Set(tools.map(tool => tool.category));
  return ['All', ...Array.from(categories).sort()];
};