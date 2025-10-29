import React, { useState, useEffect, useMemo, useCallback, lazy, Suspense } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import FilterBar from './components/FilterBar';
import ToolGrid from './components/ToolGrid';
import FeaturedTools from './components/FeaturedTools';
import Footer from './components/Footer';
import { Tool, Theme, SortOption, ViewMode } from './types';

const AdminPanel = lazy(() => import('./components/AdminPanel'));
const SubmissionForm = lazy(() => import('./components/SubmissionForm'));

const getThumbnail = (url: string) => `https://s0.wordpress.com/mshots/v1/${encodeURIComponent(url)}?w=400&h=300`;

const initialTools: Tool[] = [
    // Data has been updated with the provided traffic stats and advanced info.
    { id: 51, name: 'ChatGPT', url: 'https://chat.openai.com/', description: 'A conversational AI model by OpenAI that can generate human-like text.', imageUrl: getThumbnail('https://chat.openai.com/'), category: 'Productivity', keywords: ['chatbot', 'assistant', 'writing'], popularity: { daily: 200, weekly: 1400, monthly: 5600 }, freeTier: true, monthlyCost: 20, notes: 'Free basic, paid unlocks priority, images, more quotas' },
    { id: 52, name: 'Canva', url: 'https://www.canva.com/', description: 'Design anything. Magic Studio brings together the best AI-powered tools.', imageUrl: getThumbnail('https://www.canva.com/'), category: 'Creative', keywords: ['design', 'graphics', 'presentations'], popularity: { daily: 180, weekly: 1260, monthly: 5040 }, freeTier: true, monthlyCost: 12.99, notes: 'Free for basics, Pro for premium, teams, etc.' },
    { id: 54, name: 'Bard (Gemini)', url: 'https://gemini.google.com/', description: 'Google\'s conversational AI, designed to be a creative and helpful collaborator.', imageUrl: getThumbnail('https://gemini.google.com/'), category: 'Research', keywords: ['chatbot', 'google', 'search'], popularity: { daily: 160, weekly: 1120, monthly: 4480 }, freeTier: true, monthlyCost: 0, notes: 'Free via Google, research focus' },
    { id: 2, name: 'Midjourney', url: 'https://www.midjourney.com/', description: 'An independent research lab exploring new mediums of thought.', imageUrl: getThumbnail('https://www.midjourney.com/'), category: 'Creative', keywords: ['image generation', 'art', 'design'], popularity: { daily: 150, weekly: 1050, monthly: 4200 }, freeTier: false, monthlyCost: 10, notes: 'Paid only, no trial' },
    { id: 45, name: 'Character.AI', url: 'https://character.ai/', description: 'Create and talk to intelligent chatbots based on fictional characters.', imageUrl: getThumbnail('https://character.ai/'), category: 'Creative', keywords: ['chatbot', 'roleplay', 'conversation'], popularity: { daily: 145, weekly: 1015, monthly: 4060 }, freeTier: true, monthlyCost: 9.99, notes: 'Free for main, Pro for speed and extras' },
    { id: 17, name: 'Grammarly', url: 'https://www.grammarly.com/', description: 'Get comprehensive, real-time feedback on your grammar, spelling, and style.', imageUrl: getThumbnail('https://www.grammarly.com/'), category: 'Writing', keywords: ['writing', 'grammar', 'proofreading'], popularity: { daily: 140, weekly: 980, monthly: 3920 }, freeTier: true, monthlyCost: 12, notes: 'Paid unlocks advanced style/tone, plagiarism' },
    { id: 34, name: 'DeepL', url: 'https://www.deepl.com/', description: 'The world\'s most accurate and nuanced machine translation.', imageUrl: getThumbnail('https://www.deepl.com/'), category: 'Writing', keywords: ['translation', 'language', 'documents'], popularity: { daily: 135, weekly: 945, monthly: 3780 }, freeTier: true, monthlyCost: 8.74, notes: 'API/advanced only paid' },
    { id: 7, name: 'DALL-E 3', url: 'https://openai.com/dall-e-3', description: 'An AI system that can create realistic images and art from a description.', imageUrl: getThumbnail('https://openai.com/dall-e-3'), category: 'Creative', keywords: ['images', 'art', 'AI art'], popularity: { daily: 130, weekly: 910, monthly: 3640 }, freeTier: true, monthlyCost: 20, notes: 'Free via ChatGPT, paid unlocks images/commercial use' },
    { id: 42, name: 'Adobe Firefly', url: 'https://www.adobe.com/sensei/generative-ai/firefly.html', description: 'Explore new creative possibilities with generative AI in Adobe apps.', imageUrl: getThumbnail('https://www.adobe.com/sensei/generative-ai/firefly.html'), category: 'Creative', keywords: ['image', 'design', 'generative fill'], popularity: { daily: 125, weekly: 875, monthly: 3500 }, freeTier: true, monthlyCost: 19.99, notes: 'Bundled with Adobe subscription' },
    { id: 3, name: 'GitHub Copilot', url: 'https://github.com/features/copilot', description: 'Your AI pair programmer that helps you write better code, faster.', imageUrl: getThumbnail('https://github.com/features/copilot'), category: 'Developer', keywords: ['code', 'IDE', 'developer tool'], popularity: { daily: 120, weekly: 840, monthly: 3360 }, freeTier: false, monthlyCost: 10, notes: 'Paid only (after trial)' },
    { id: 36, name: 'Hugging Face', url: 'https://huggingface.co/', description: 'The AI community building the future. Build, train and deploy state of the art models.', imageUrl: getThumbnail('https://huggingface.co/'), category: 'Developer', keywords: ['ML', 'models', 'community'], popularity: { daily: 118, weekly: 826, monthly: 3304 }, freeTier: true, monthlyCost: 9, notes: 'Open source models always free' },
    { id: 25, name: 'ElevenLabs', url: 'https://elevenlabs.io/', description: 'Generative Voice AI. The most realistic and versatile AI speech software.', imageUrl: getThumbnail('https://elevenlabs.io/'), category: 'Audio', keywords: ['voice', 'TTS', 'cloning'], popularity: { daily: 115, weekly: 805, monthly: 3220 }, freeTier: true, monthlyCost: 5, notes: 'Paid unlocks more voices/features' },
    { id: 53, name: 'QuillBot', url: 'https://quillbot.com/', description: 'AI-powered paraphrasing tool, grammar checker, and summarizer.', imageUrl: getThumbnail('https://quillbot.com/'), category: 'Writing', keywords: ['paraphrasing', 'grammar', 'summarizer'], popularity: { daily: 112, weekly: 784, monthly: 3136 }, freeTier: true, monthlyCost: 9.95, notes: 'Paid unlocks Pro features' },
    { id: 4, name: 'Notion AI', url: 'https://www.notion.so/product/ai', description: 'Access the limitless power of AI, right inside Notion. Work faster. Write better.', imageUrl: getThumbnail('https://www.notion.so/product/ai'), category: 'Productivity', keywords: ['notes', 'wiki', 'tasks'], popularity: { daily: 110, weekly: 770, monthly: 3080 }, freeTier: true, monthlyCost: 10, notes: 'Paid unlocks advanced AI features' },
    { id: 75, name: 'WolframAlpha', url: 'https://www.wolframalpha.com/', description: 'A computational knowledge engine that answers factual queries.', imageUrl: getThumbnail('https://www.wolframalpha.com/'), category: 'Research', keywords: ['computation', 'knowledge', 'answers'], popularity: { daily: 109, weekly: 763, monthly: 3052 }, freeTier: true, monthlyCost: 5, notes: 'Paid only for advanced modules/files' },
    { id: 40, name: 'Suno AI', url: 'https://www.suno.ai/', description: 'Make any song you want. Generate music with vocals from a simple text prompt.', imageUrl: getThumbnail('https://www.suno.ai/'), category: 'Audio', keywords: ['music', 'song generation', 'creative'], popularity: { daily: 108, weekly: 756, monthly: 3024 }, freeTier: true, monthlyCost: 0, notes: 'Free, paid plans evolving' },
    { id: 79, name: 'DeepMind', url: 'https://deepmind.google/', description: 'Working to solve intelligence to advance science and benefit humanity.', imageUrl: getThumbnail('https://deepmind.google/'), category: 'Research', keywords: ['AGI', 'research', 'science'], popularity: { daily: 106, weekly: 742, monthly: 2968 }, freeTier: false, monthlyCost: null, notes: 'Research platform, no consumer price' },
    { id: 16, name: 'Runway', url: 'https://runwayml.com/', description: 'A next-generation creative suite that has everything you need to make anything.', imageUrl: getThumbnail('https://runwayml.com/'), category: 'Video', keywords: ['video editing', 'AI magic', 'creative tools'], popularity: { daily: 105, weekly: 735, monthly: 2940 }, freeTier: true, monthlyCost: 12, notes: 'Paid for hi-res, longer exports' },
    { id: 69, name: 'Civitai', url: 'https://civitai.com/', description: 'A platform for the Stable Diffusion AI Art Generation community.', imageUrl: getThumbnail('https://civitai.com/'), category: 'Creative', keywords: ['stable diffusion', 'models', 'community'], popularity: { daily: 104, weekly: 728, monthly: 2912 }, freeTier: true, monthlyCost: 0, notes: 'Paid for hosting/advanced generation' },
    { id: 30, name: 'Poe by Quora', url: 'https://poe.com/', description: 'Fast, helpful AI chat. Access a number of different bots, including GPT-4.', imageUrl: getThumbnail('https://poe.com/'), category: 'Productivity', keywords: ['chatbot', 'assistant', 'conversation'], popularity: { daily: 102, weekly: 714, monthly: 2856 }, freeTier: true, monthlyCost: 20, notes: 'Free for basics/limits' },
    { id: 74, name: 'Lexica', url: 'https://lexica.art/', description: 'The Stable Diffusion search engine. Search over 5M+ images and prompts.', imageUrl: getThumbnail('https://lexica.art/'), category: 'Creative', keywords: ['search engine', 'prompts', 'stable diffusion'], popularity: { daily: 101, weekly: 707, monthly: 2828 }, freeTier: true, monthlyCost: 10, notes: 'Free for search, paid for gen/storage' },
    { id: 14, name: 'Semrush', url: 'https://www.semrush.com/', description: 'Online visibility management and content marketing SaaS platform.', imageUrl: getThumbnail('https://www.semrush.com/'), category: 'Marketing', keywords: ['SEO', 'PPC', 'analytics'], popularity: { daily: 100, weekly: 700, monthly: 2800 }, freeTier: false, monthlyCost: 130, notes: 'Research, paid only' },
    { id: 31, name: 'Leonardo.Ai', url: 'https://leonardo.ai/', description: 'Produce stunning game assets, concept art, and illustrations with AI.', imageUrl: getThumbnail('https://leonardo.ai/'), category: 'Creative', keywords: ['art', 'game assets', 'images'], popularity: { daily: 99, weekly: 693, monthly: 2772 }, freeTier: true, monthlyCost: 12, notes: 'Free tokens daily; paid for unlimited/private images' },
    { id: 1, name: 'Jasper', url: 'https://www.jasper.ai/', description: 'The generative AI platform for business that helps create content 10X faster.', imageUrl: getThumbnail('https://www.jasper.ai/'), category: 'Writing', keywords: ['copywriting', 'content', 'AI writer'], popularity: { daily: 98, weekly: 680, monthly: 2720 }, freeTier: false, monthlyCost: 39, notes: 'Paid only/pro after trial' },
    { id: 57, name: 'Playground AI', url: 'https://playgroundai.com/', description: 'A free-to-use online AI image creator for art, social media posts, and more.', imageUrl: getThumbnail('https://playgroundai.com/'), category: 'Creative', keywords: ['image generator', 'art', 'free'], popularity: { daily: 97, weekly: 679, monthly: 2716 }, freeTier: true, monthlyCost: 0, notes: 'Paid for extra quotas' },
    { id: 44, name: 'Pika', url: 'https://pika.art/', description: 'An idea-to-video platform that brings your creativity to motion.', imageUrl: getThumbnail('https://pika.art/'), category: 'Video', keywords: ['video generation', 'text-to-video', 'creative'], popularity: { daily: 96, weekly: 672, monthly: 2688 }, freeTier: true, monthlyCost: 20, notes: 'Paid for longer videos, assets' },
    { id: 5, name: 'Perplexity AI', url: 'https://www.perplexity.ai/', description: 'An AI-powered search engine that provides direct, accurate answers with cited sources.', imageUrl: getThumbnail('https://www.perplexity.ai/'), category: 'Research', keywords: ['search', 'answers', 'information'], popularity: { daily: 95, weekly: 665, monthly: 2660 }, freeTier: true, monthlyCost: 20, notes: 'Free for main, paid for advanced/research' },
    { id: 49, name: 'Webflow', url: 'https://webflow.com/', description: 'Build professional websites in a completely visual canvas with AI assistance.', imageUrl: getThumbnail('https://webflow.com/'), category: 'Developer', keywords: ['website builder', 'no-code', 'design'], popularity: { daily: 94, weekly: 658, monthly: 2632 }, freeTier: true, monthlyCost: 14, notes: 'Free for basic websites' },
    { id: 27, name: 'HeyGen', url: 'https://www.heygen.com/', description: 'Scale your video production with customizable AI avatars and text-to-video.', imageUrl: getThumbnail('https://www.heygen.com/'), category: 'Video', keywords: ['video', 'avatars', 'generative'], popularity: { daily: 93, weekly: 651, monthly: 2604 }, freeTier: true, monthlyCost: 29, notes: 'Free demo, paid for bigger vids' },
    { id: 23, name: 'Zapier', url: 'https://zapier.com/', description: 'Automation for everyone. Automate your work across 5,000+ apps.', imageUrl: getThumbnail('https://zapier.com/'), category: 'Productivity', keywords: ['automation', 'workflow', 'integration'], popularity: { daily: 92, weekly: 644, monthly: 2576 }, freeTier: true, monthlyCost: 20, notes: 'Paid for more tasks/apps' },
    { id: 39, name: 'You.com', url: 'https://you.com/', description: 'The AI search engine you control. Summarize information, write code, and get answers.', imageUrl: getThumbnail('https://you.com/'), category: 'Research', keywords: ['search', 'chatbot', 'privacy'], popularity: { daily: 91, weekly: 637, monthly: 2548 }, freeTier: true, monthlyCost: 15, notes: 'Paid for quotas/advanced AI' },
    { id: 12, name: 'Fireflies.ai', url: 'https://fireflies.ai/', description: 'AI assistant for your meetings. Record, transcribe, search, and analyze conversations.', imageUrl: getThumbnail('https://fireflies.ai/'), category: 'Productivity', keywords: ['meetings', 'transcription', 'notes'], popularity: { daily: 90, weekly: 630, monthly: 2520 }, freeTier: true, monthlyCost: 10, notes: 'Paid for longer meetings/transcription' },
    { id: 71, name: 'Mage.space', url: 'https://www.mage.space/', description: 'Create anything. Fast, free, and unfiltered text-to-image generation.', imageUrl: getThumbnail('https://www.mage.space/'), category: 'Creative', keywords: ['image generator', 'stable diffusion', 'free'], popularity: { daily: 90, weekly: 630, monthly: 2520 }, freeTier: true, monthlyCost: 0, notes: 'Free for most, paid removes limits' },
    { id: 32, name: 'Otter.ai', url: 'https://otter.ai/', description: 'Get real-time automated notes and audio transcription for your meetings.', imageUrl: getThumbnail('https://otter.ai/'), category: 'Productivity', keywords: ['transcription', 'meetings', 'notes'], popularity: { daily: 89, weekly: 623, monthly: 2492 }, freeTier: true, monthlyCost: 8.33, notes: 'Paid for advanced speakers/export' },
    { id: 20, name: 'Descript', url: 'https://www.descript.com/', description: 'All-in-one audio & video editor that makes editing as easy as a word doc.', imageUrl: getThumbnail('https://www.descript.com/'), category: 'Audio', keywords: ['audio editing', 'video', 'podcast'], popularity: { daily: 88, weekly: 616, monthly: 2464 }, freeTier: true, monthlyCost: 12, notes: 'Paid for watermark removal, export' },
    { id: 56, name: 'Ahrefs', url: 'https://ahrefs.com/', description: 'An all-in-one SEO toolset that helps you rank higher and get more traffic.', imageUrl: getThumbnail('https://ahrefs.com/'), category: 'Marketing', keywords: ['SEO', 'keywords', 'backlinks'], popularity: { daily: 87, weekly: 609, monthly: 2436 }, freeTier: false, monthlyCost: 99, notes: 'Paid only' },
    { id: 46, name: 'Miro', url: 'https://miro.com/', description: 'The online collaborative whiteboard platform with AI-powered features.', imageUrl: getThumbnail('https://miro.com/'), category: 'Productivity', keywords: ['whiteboard', 'collaboration', 'diagram'], popularity: { daily: 86, weekly: 602, monthly: 2408 }, freeTier: true, monthlyCost: 10, notes: 'Paid unlocks full boards/collab' },
    { id: 9, name: 'ClickUp', url: 'https://clickup.com/', description: 'One app to replace them all. The future of work with tasks, docs, chat, and goals.', imageUrl: getThumbnail('https://clickup.com/'), category: 'Productivity', keywords: ['project management', 'tasks', 'teamwork'], popularity: { daily: 85, weekly: 595, monthly: 2380 }, freeTier: true, monthlyCost: 5, notes: 'Paid for team/project management' },
    { id: 83, name: 'Loom', url: 'https://www.loom.com/', description: 'The AI-powered video communication platform for asynchronous work.', imageUrl: getThumbnail('https://www.loom.com/'), category: 'Video', keywords: ['screen recording', 'video messaging', 'collaboration'], popularity: { daily: 85, weekly: 595, monthly: 2380 }, freeTier: true, monthlyCost: 10, notes: 'Paid unlocks more videos/minutes' },
    { id: 35, name: 'Veed.io', url: 'https://www.veed.io/', description: 'Online video suite for professionals. Record, edit, and stream your videos.', imageUrl: getThumbnail('https://www.veed.io/'), category: 'Video', keywords: ['video editing', 'recorder', 'livestream'], popularity: { daily: 84, weekly: 588, monthly: 2352 }, freeTier: true, monthlyCost: 12, notes: 'Free basic, paid for watermark removal' },
    { id: 50, name: 'Framer', url: 'https://www.framer.com/', description: 'Design and publish professional websites with AI-powered tools.', imageUrl: getThumbnail('https://www.framer.com/'), category: 'Developer', keywords: ['website design', 'prototyping', 'no-code'], popularity: { daily: 83, weekly: 581, monthly: 2324 }, freeTier: true, monthlyCost: 20, notes: 'Paid for publishing/full features' },
    { id: 24, name: 'Murf AI', url: 'https://murf.ai/', description: 'Go from text to speech with a versatile AI voice generator.', imageUrl: getThumbnail('https://murf.ai/'), category: 'Audio', keywords: ['voiceover', 'text-to-speech', 'audio'], popularity: { daily: 82, weekly: 574, monthly: 2296 }, freeTier: true, monthlyCost: 13, notes: 'Paid for export/commercial use' },
    { id: 28, name: 'Tome', url: 'https://tome.app/', description: 'The AI-powered storytelling format for presentations, documents, and websites.', imageUrl: getThumbnail('https://tome.app/'), category: 'Productivity', keywords: ['presentations', 'storytelling', 'slides'], popularity: { daily: 81, weekly: 567, monthly: 2268 }, freeTier: true, monthlyCost: 16, notes: 'Paid unlocks advanced/branding' },
    { id: 68, name: 'InVideo', url: 'https://invideo.io/', description: 'The AI-powered online video editor to make professional videos in minutes.', imageUrl: getThumbnail('https://invideo.io/'), category: 'Video', keywords: ['video editor', 'templates', 'marketing'], popularity: { daily: 81, weekly: 567, monthly: 2268 }, freeTier: true, monthlyCost: 25, notes: 'Paid for assets/export' },
    { id: 91, name: 'Tome App', url: 'https://tome.app/', description: 'Unlock your best work with Tome\'s AI-powered storytelling format.', imageUrl: getThumbnail('https://tome.app/'), category: 'Productivity', keywords: ['presentations', 'storytelling', 'design'], popularity: { daily: 81, weekly: 567, monthly: 2268 }, freeTier: true, monthlyCost: 16, notes: 'Paid content creator tier' },
    { id: 6, name: 'Copy.ai', url: 'https://www.copy.ai/', description: 'Generate high-quality marketing copy and content with AI.', imageUrl: getThumbnail('https://www.copy.ai/'), category: 'Marketing', keywords: ['copywriting', 'marketing', 'content'], popularity: { daily: 80, weekly: 560, monthly: 2240 }, freeTier: true, monthlyCost: 36, notes: 'Paid unlocks full suite' },
    { id: 73, name: 'Gamma', url: 'https://gamma.app/', description: 'A new medium for presenting ideas. Create beautiful, engaging presentations.', imageUrl: getThumbnail('https://gamma.app/'), category: 'Productivity', keywords: ['presentations', 'documents', 'design'], popularity: { daily: 80, weekly: 560, monthly: 2240 }, freeTier: true, monthlyCost: 12, notes: 'Paid removes branding, more exports' },
    { id: 60, name: 'CodeWhisperer', url: 'https://aws.amazon.com/codewhisperer/', description: 'Build applications faster with the AI coding companion from Amazon.', imageUrl: getThumbnail('https://aws.amazon.com/codewhisperer/'), category: 'Developer', keywords: ['code', 'aws', 'AI assistant'], popularity: { daily: 79, weekly: 553, monthly: 2212 }, freeTier: true, monthlyCost: 19, notes: 'Paid unlocks more usage' },
    { id: 21, name: 'Codeium', url: 'https://codeium.com/', description: 'The modern coding superpower, a code acceleration toolkit.', imageUrl: getThumbnail('https://codeium.com/'), category: 'Developer', keywords: ['code', 'autocomplete', 'AI'], popularity: { daily: 78, weekly: 546, monthly: 2184 }, freeTier: true, monthlyCost: 0, notes: 'Teams paid only' },
    { id: 95, name: 'Wordtune', url: 'https://www.wordtune.com/', description: 'Your personal writing assistant and editor. Say exactly what you mean.', imageUrl: getThumbnail('https://www.wordtune.com/'), category: 'Writing', keywords: ['rewriting', 'editing', 'writing assistant'], popularity: { daily: 78, weekly: 546, monthly: 2184 }, freeTier: true, monthlyCost: 9.99, notes: 'Paid for Pro features' },
    { id: 29, name: 'Writesonic', url: 'https://writesonic.com/', description: 'Create SEO-friendly content that drives traffic and engagement with our AI writer.', imageUrl: getThumbnail('https://writesonic.com/'), category: 'Writing', keywords: ['SEO', 'content', 'AI writer'], popularity: { daily: 77, weekly: 539, monthly: 2156 }, freeTier: true, monthlyCost: 13, notes: 'Paid for higher quotas/commercial' },
    { id: 64, name: 'Fliki', url: 'https://fliki.ai/', description: 'Create videos from scripts or blog posts using realistic voices in 2 minutes!', imageUrl: getThumbnail('https://fliki.ai/'), category: 'Video', keywords: ['text-to-video', 'voiceover', 'content'], popularity: { daily: 76, weekly: 532, monthly: 2128 }, freeTier: true, monthlyCost: 28, notes: 'Paid more video/audio exports' },
    { id: 11, name: 'Synthesia', url: 'https://www.synthesia.io/', description: 'Create professional videos with AI avatars and voiceovers in minutes.', imageUrl: getThumbnail('https://www.synthesia.io/'), category: 'Video', keywords: ['video', 'avatars', 'presentation'], popularity: { daily: 75, weekly: 525, monthly: 2100 }, freeTier: true, monthlyCost: 30, notes: 'Paid unlocks exports/downloads' },
    { id: 86, name: 'Replika', url: 'https://replika.com/', description: 'The AI companion who cares. Always here to listen and talk. Always on your side.', imageUrl: getThumbnail('https://replika.com/'), category: 'Creative', keywords: ['AI friend', 'companion', 'chatbot'], popularity: { daily: 75, weekly: 525, monthly: 2100 }, freeTier: true, monthlyCost: 19.99, notes: 'Paid removes limits, more relationships' },
    { id: 67, name: 'Gong', url: 'https://www.gong.io/', description: 'The Revenue Intelligence platform that captures and analyzes customer interactions.', imageUrl: getThumbnail('https://www.gong.io/'), category: 'Marketing', keywords: ['sales', 'revenue', 'analytics'], popularity: { daily: 74, weekly: 518, monthly: 2072 }, freeTier: false, monthlyCost: null, notes: 'Paid only (sales SaaS)' },
    { id: 41, name: 'Rytr', url: 'https://rytr.me/', description: 'A better, 10x faster way to write. Auto-generate catchy copy for various uses.', imageUrl: getThumbnail('https://rytr.me/'), category: 'Writing', keywords: ['copywriting', 'content', 'marketing'], popularity: { daily: 73, weekly: 511, monthly: 2044 }, freeTier: true, monthlyCost: 9, notes: 'Paid unlocks higher quotas' },
    { id: 26, name: 'Luma AI', url: 'https://lumalabs.ai/', description: 'Capture the world in lifelike 3D. Unmatched photorealism and details.', imageUrl: getThumbnail('https://lumalabs.ai/'), category: 'Creative', keywords: ['3D', 'NeRF', 'capture'], popularity: { daily: 72, weekly: 504, monthly: 2016 }, freeTier: true, monthlyCost: 15, notes: 'Paid unlocks more 3D/gen' },
    { id: 55, name: 'Klaviyo', url: 'https://www.klaviyo.com/', description: 'A marketing automation platform with AI-powered features for email, SMS, etc.', imageUrl: getThumbnail('https://www.klaviyo.com/'), category: 'Marketing', keywords: ['email marketing', 'automation', 'sms'], popularity: { daily: 71, weekly: 497, monthly: 1988 }, freeTier: true, monthlyCost: 20, notes: 'Paid unlocks more contacts/emails' },
    { id: 8, name: 'Replit', url: 'https://replit.com/', description: 'The collaborative browser-based IDE with an AI-powered code completion.', imageUrl: getThumbnail('https://replit.com/'), category: 'Developer', keywords: ['IDE', 'coding', 'collaboration'], popularity: { daily: 70, weekly: 490, monthly: 1960 }, freeTier: true, monthlyCost: 7, notes: 'Free for basics, paid for more projects' },
    { id: 85, name: 'Phind', url: 'https://www.phind.com/', description: 'The AI search engine for developers. Get instant answers and code examples.', imageUrl: getThumbnail('https://www.phind.com/'), category: 'Developer', keywords: ['developer search', 'code', 'answers'], popularity: { daily: 70, weekly: 490, monthly: 1960 }, freeTier: true, monthlyCost: 0, notes: 'Paid only for pro/enterprise' },
    { id: 43, name: 'Taskade', url: 'https://www.taskade.com/', description: 'The AI-powered, all-in-one team collaboration tool for remote teams.', imageUrl: getThumbnail('https://www.taskade.com/'), category: 'Productivity', keywords: ['tasks', 'collaboration', 'notes'], popularity: { daily: 69, weekly: 483, monthly: 1932 }, freeTier: true, monthlyCost: 12, notes: 'Paid for teams/advanced features' },
    { id: 33, name: 'Kajabi', url: 'https://kajabi.com/', description: 'The all-in-one platform to create, market, and sell your online courses.', imageUrl: getThumbnail('https://kajabi.com/'), category: 'Marketing', keywords: ['courses', 'coaching', 'business'], popularity: { daily: 68, weekly: 476, monthly: 1904 }, freeTier: false, monthlyCost: 69, notes: 'Paid only (course SaaS)' },
    { id: 65, name: 'Surfer SEO', url: 'https://surferseo.com/', description: 'Content intelligence tool that helps you write better and rank higher.', imageUrl: getThumbnail('https://surferseo.com/'), category: 'Writing', keywords: ['SEO', 'content optimization', 'writing'], popularity: { daily: 67, weekly: 469, monthly: 1876 }, freeTier: false, monthlyCost: 29, notes: 'Paid only' },
    { id: 48, name: 'Podcastle', url: 'https://podcastle.ai/', description: 'Studio-quality recording, AI-powered editing, and seamless exporting.', imageUrl: getThumbnail('https://podcastle.ai/'), category: 'Audio', keywords: ['podcast', 'audio editing', 'recording'], popularity: { daily: 66, weekly: 462, monthly: 1848 }, freeTier: true, monthlyCost: 12, notes: 'Paid unlocks export, more shows' },
    { id: 13, name: 'Tabnine', url: 'https://www.tabnine.com/', description: 'AI assistant for software developers. Code faster with code completions.', imageUrl: getThumbnail('https://www.tabnine.com/'), category: 'Developer', keywords: ['code completion', 'AI', 'developer'], popularity: { daily: 65, weekly: 455, monthly: 1820 }, freeTier: true, monthlyCost: 12, notes: 'Paid unlocks unlimited code completion' },
    { id: 59, name: 'Superhuman', url: 'https://superhuman.com/', description: 'The fastest email experience ever made, with AI-powered assistance.', imageUrl: getThumbnail('https://superhuman.com/'), category: 'Productivity', keywords: ['email', 'productivity', 'inbox'], popularity: { daily: 64, weekly: 448, monthly: 1792 }, freeTier: false, monthlyCost: 30, notes: 'Paid only' },
    { id: 37, name: 'Pictory', url: 'https://pictory.ai/', description: 'Automatically create short, shareable branded videos from long form content.', imageUrl: getThumbnail('https://pictory.ai/'), category: 'Video', keywords: ['video creation', 'content repurposing', 'marketing'], popularity: { daily: 63, weekly: 441, monthly: 1764 }, freeTier: true, monthlyCost: 19, notes: 'Paid for higher quotas / export' },
    { id: 47, name: 'Gradio', url: 'https://www.gradio.app/', description: 'Build and share delightful machine learning apps, all in Python.', imageUrl: getThumbnail('https://www.gradio.app/'), category: 'Developer', keywords: ['ML', 'demo', 'python'], popularity: { daily: 62, weekly: 434, monthly: 1736 }, freeTier: true, monthlyCost: 19, notes: 'Paid for more hosting/app deployment' },
    { id: 62, name: 'Lalal.ai', url: 'https://www.lalal.ai/', description: 'High-quality stem splitting based on the world\'s #1 AI-powered technology.', imageUrl: getThumbnail('https://www.lalal.ai/'), category: 'Audio', keywords: ['stem splitter', 'vocals', 'instrumental'], popularity: { daily: 61, weekly: 427, monthly: 1708 }, freeTier: true, monthlyCost: 15, notes: 'Paid for unlimited splits' },
    { id: 10, name: 'Consensus', url: 'https://consensus.app/', description: 'Consensus is an AI-powered search engine for scientific research.', imageUrl: getThumbnail('https://consensus.app/'), category: 'Research', keywords: ['science', 'research', 'papers'], popularity: { daily: 60, weekly: 420, monthly: 1680 }, freeTier: true, monthlyCost: 10, notes: 'Paid extra research / reports' },
    { id: 58, name: 'Splash', url: 'https://www.splashmusic.com/', description: 'AI-powered tools for music creation, from text-to-music to vocal melodies.', imageUrl: getThumbnail('https://www.splashmusic.com/'), category: 'Audio', keywords: ['music', 'AI music', 'vocals'], popularity: { daily: 59, weekly: 413, monthly: 1652 }, freeTier: true, monthlyCost: 0, notes: 'Paid for quota increase / watermark removal' },
    { id: 38, name: 'SlidesAI.io', url: 'https://www.slidesai.io/', description: 'Create professional, engaging presentation slides from any text in seconds.', imageUrl: getThumbnail('https://www.slidesai.io/'), category: 'Productivity', keywords: ['presentations', 'google slides', 'automation'], popularity: { daily: 58, weekly: 406, monthly: 1624 }, freeTier: true, monthlyCost: 10, notes: 'Paid for higher quotas, team' },
    { id: 61, name: 'Mem', url: 'https://mem.ai/', description: 'The self-organizing workspace. The fastest way to capture and share information.', imageUrl: getThumbnail('https://mem.ai/'), category: 'Productivity', keywords: ['notes', 'knowledge base', 'search'], popularity: { daily: 57, weekly: 399, monthly: 1596 }, freeTier: true, monthlyCost: 8, notes: 'Paid for advanced memory/organization' },
    { id: 63, name: 'Durable', url: 'https://durable.co/', description: 'The AI website builder that generates an entire website in seconds.', imageUrl: getThumbnail('https://durable.co/'), category: 'Marketing', keywords: ['website builder', 'small business', 'AI'], popularity: { daily: 56, weekly: 392, monthly: 1568 }, freeTier: true, monthlyCost: 12, notes: 'Paid for custom domain/support' },
    { id: 15, name: 'Elicit', url: 'https://elicit.org/', description: 'The AI Research Assistant. Elicit helps you automate research workflows.', imageUrl: getThumbnail('https://elicit.org/'), category: 'Research', keywords: ['research', 'literature', 'AI assistant'], popularity: { daily: 55, weekly: 385, monthly: 1540 }, freeTier: true, monthlyCost: 0, notes: 'Paid only for advanced features' },
    { id: 99, name: 'AdCreative.ai', url: 'https://www.adcreative.ai/', description: 'Generate conversion-focused ad creatives in a matter of seconds.', imageUrl: getThumbnail('https://www.adcreative.ai/'), category: 'Marketing', keywords: ['ad creatives', 'marketing', 'AI design'], popularity: { daily: 55, weekly: 385, monthly: 1540 }, freeTier: true, monthlyCost: 39, notes: 'Paid unlocks full creative suite' },
    { id: 66, name: 'Soundraw', url: 'https://soundraw.io/', description: 'Stop searching for the music you need. Create it. The AI music generator.', imageUrl: getThumbnail('https://soundraw.io/'), category: 'Audio', keywords: ['music generator', 'royalty-free', 'creators'], popularity: { daily: 54, weekly: 378, monthly: 1512 }, freeTier: true, monthlyCost: 19, notes: 'Paid for more exports/commercial use' },
    { id: 70, name: 'AssemblyAI', url: 'https://www.assemblyai.com/', description: 'AI models to transcribe and understand speech. Production-ready API.', imageUrl: getThumbnail('https://www.assemblyai.com/'), category: 'Developer', keywords: ['speech-to-text', 'API', 'transcription'], popularity: { daily: 53, weekly: 371, monthly: 1484 }, freeTier: true, monthlyCost: 15, notes: 'Paid for more hours/transcription' },
    { id: 72, name: 'Sudowrite', url: 'https://www.sudowrite.com/', description: 'The best AI for creative writers. Brainstorm, write, and rewrite.', imageUrl: getThumbnail('https://www.sudowrite.com/'), category: 'Writing', keywords: ['creative writing', 'fiction', 'storytelling'], popularity: { daily: 52, weekly: 364, monthly: 1456 }, freeTier: true, monthlyCost: 20, notes: 'Paid pro features, more words' },
    { id: 77, name: 'Boomy', url: 'https://boomy.com/', description: 'Make original songs in seconds, even if you\'ve never made music before.', imageUrl: getThumbnail('https://boomy.com/'), category: 'Audio', keywords: ['music generation', 'songs', 'instant'], popularity: { daily: 51, weekly: 357, monthly: 1428 }, freeTier: true, monthlyCost: 2, notes: 'Paid unlocks higher quotas/usage' },
    { id: 18, name: 'Looka', url: 'https://looka.com/', description: 'Use AI to design a logo and build a brand you love.', imageUrl: getThumbnail('https://looka.com/'), category: 'Marketing', keywords: ['logo design', 'branding', 'design'], popularity: { daily: 50, weekly: 350, monthly: 1400 }, freeTier: true, monthlyCost: 29, notes: 'Paid for export/full branding kit' },
    { id: 76, name: 'Andi', url: 'https://andisearch.com/', description: 'Search for the next generation using generative AI. It\'s conversational.', imageUrl: getThumbnail('https://andisearch.com/'), category: 'Research', keywords: ['search', 'conversational', 'generative'], popularity: { daily: 49, weekly: 343, monthly: 1372 }, freeTier: true, monthlyCost: 0, notes: 'Paid for more search/advanced' },
    { id: 78, name: 'Cohere', url: 'https://cohere.com/', description: 'Enterprise AI platform for building and deploying NLP models.', imageUrl: getThumbnail('https://cohere.com/'), category: 'Developer', keywords: ['NLP', 'enterprise', 'API'], popularity: { daily: 48, weekly: 336, monthly: 1344 }, freeTier: true, monthlyCost: null, notes: 'Paid for enterprise/large gen' },
    { id: 80, name: 'Eightify', url: 'https://eightify.app/', description: 'Get AI-powered summaries of YouTube videos in seconds. Save time.', imageUrl: getThumbnail('https://eightify.app/'), category: 'Productivity', keywords: ['youtube', 'summarizer', 'video'], popularity: { daily: 47, weekly: 329, monthly: 1316 }, freeTier: true, monthlyCost: 0, notes: 'Paid for more summaries/quota' },
    { id: 81, name: 'Humata AI', url: 'https://www.humata.ai/', description: 'Your AI-powered assistant for all your files. Ask questions about your data.', imageUrl: getThumbnail('https://www.humata.ai/'), category: 'Research', keywords: ['documents', 'Q&A', 'PDF'], popularity: { daily: 46, weekly: 322, monthly: 1288 }, freeTier: true, monthlyCost: 5, notes: 'Paid for higher quotas/integrations' },
    { id: 19, name: 'Beautiful.ai', url: 'https://www.beautiful.ai/', description: 'The first presentation maker that designs for you. Create beautiful presentations.', imageUrl: getThumbnail('https://www.beautiful.ai/'), category: 'Productivity', keywords: ['presentations', 'slides', 'design'], popularity: { daily: 45, weekly: 315, monthly: 1260 }, freeTier: false, monthlyCost: 12, notes: 'Paid for full exports/collab' },
    { id: 82, name: 'Kuki', url: 'https://www.kuki.ai/', description: 'An award winning AI chatbot that has exchanged more than a billion messages.', imageUrl: getThumbnail('https://www.kuki.ai/'), category: 'Creative', keywords: ['chatbot', 'conversational', 'entertainment'], popularity: { daily: 45, weekly: 315, monthly: 1260 }, freeTier: true, monthlyCost: 0, notes: 'Paid for advanced persona features' },
    { id: 84, name: 'NVIDIA Canvas', url: 'https://www.nvidia.com/en-us/studio/canvas/', description: 'Use AI to turn simple brushstrokes into realistic landscape images.', imageUrl: getThumbnail('https://www.nvidia.com/en-us/studio/canvas/'), category: 'Creative', keywords: ['art', 'landscape', 'painting'], popularity: { daily: 44, weekly: 308, monthly: 1232 }, freeTier: true, monthlyCost: 0, notes: 'Paid for pro brushsets/updates' },
    { id: 87, name: 'Sheet+', url: 'https://sheetplus.ai/', description: 'Write Google Sheets & Excel formulas 10x faster with AI.', imageUrl: getThumbnail('https://sheetplus.ai/'), category: 'Productivity', keywords: ['excel', 'google sheets', 'formulas'], popularity: { daily: 43, weekly: 301, monthly: 1204 }, freeTier: true, monthlyCost: 5, notes: 'Paid for more formulas/advanced use' },
    { id: 88, name: 'Steve AI', url: 'https://www.steve.ai/', description: 'The only AI needed to create videos and animations from text.', imageUrl: getThumbnail('https://www.steve.ai/'), category: 'Video', keywords: ['video creation', 'animation', 'text-to-video'], popularity: { daily: 42, weekly: 294, monthly: 1176 }, freeTier: true, monthlyCost: 29, notes: 'Paid for long-form animation/export' },
    { id: 89, name: 'Stockimg.ai', url: 'https://stockimg.ai/', description: 'Generate the perfect stock photo, book cover, wallpaper, and more in seconds.', imageUrl: getThumbnail('https://stockimg.ai/'), category: 'Creative', keywords: ['stock photos', 'image generation', 'design'], popularity: { daily: 41, weekly: 287, monthly: 1148 }, freeTier: true, monthlyCost: 19, notes: 'Paid for more downloads/promo' },
    { id: 22, name: 'Scite', url: 'https://scite.ai/', description: 'An award-winning platform for discovering and evaluating scientific articles.', imageUrl: getThumbnail('https://scite.ai/'), category: 'Research', keywords: ['citations', 'research', 'science'], popularity: { daily: 40, weekly: 280, monthly: 1120 }, freeTier: true, monthlyCost: 10, notes: 'Paid for higher research quotas' },
    { id: 90, name: 'Teachable', url: 'https://teachable.com/', description: 'Create and sell online courses and coaching with the best online platform.', imageUrl: getThumbnail('https://teachable.com/'), category: 'Marketing', keywords: ['online courses', 'creator', 'business'], popularity: { daily: 40, weekly: 280, monthly: 1120 }, freeTier: false, monthlyCost: 39, notes: 'Paid only (course SaaS)' },
    { id: 92, name: 'Vidyo.ai', url: 'https://vidyo.ai/', description: 'Make short videos from long ones instantly. AI-powered content repurposing.', imageUrl: getThumbnail('https://vidyo.ai/'), category: 'Video', keywords: ['video repurposing', 'clips', 'social media'], popularity: { daily: 39, weekly: 273, monthly: 1092 }, freeTier: true, monthlyCost: 20, notes: 'Paid unlocks more exports/length' },
    { id: 93, name: 'Voilà', url: 'https://www.getvoila.ai/', description: 'A powerful AI assistant for your browser that helps you write, summarize, and learn.', imageUrl: getThumbnail('https://www.getvoila.ai/'), category: 'Writing', keywords: ['browser extension', 'assistant', 'writing'], popularity: { daily: 38, weekly: 266, monthly: 1064 }, freeTier: true, monthlyCost: 0, notes: 'Paid for more flashcards/quota' },
    { id: 94, name: 'Wisdolia', url: 'https://www.wisdolia.com/', description: 'AI-powered flashcards. Automatically generate from any article, PDF, or video.', imageUrl: getThumbnail('https://www.wisdolia.com/'), category: 'Research', keywords: ['flashcards', 'learning', 'studying'], popularity: { daily: 37, weekly: 259, monthly: 1036 }, freeTier: true, monthlyCost: 0, notes: 'Paid for higher migration/integration' },
    { id: 96, name: 'Xpression Camera', url: 'https://xpressioncamera.com/', description: 'Become anyone with a single photo. A real-time generative AI app.', imageUrl: getThumbnail('https://xpressioncamera.com/'), category: 'Video', keywords: ['avatars', 'streaming', 'video chat'], popularity: { daily: 36, weekly: 252, monthly: 1008 }, freeTier: true, monthlyCost: 49, notes: 'Paid for pro streams/reactions' },
    { id: 97, name: 'Yarnit', url: 'https://www.yarnit.app/', description: 'The AI-powered content creation platform to create, publish, and distribute.', imageUrl: getThumbnail('https://www.yarnit.app/'), category: 'Marketing', keywords: ['content creation', 'social media', 'marketing'], popularity: { daily: 35, weekly: 245, monthly: 980 }, freeTier: true, monthlyCost: 14, notes: 'Paid for team/collab features' },
    { id: 98, name: 'ZMO.AI', url: 'https://www.zmo.ai/', description: 'Create high-quality, on-brand images for fashion models and products.', imageUrl: getThumbnail('https://www.zmo.ai/'), category: 'Creative', keywords: ['fashion', 'product photography', 'models'], popularity: { daily: 34, weekly: 238, monthly: 952 }, freeTier: true, monthlyCost: 10, notes: 'Paid unlocks full export/resolution' },
    { id: 100, name: 'AutoDraw', url: 'https://www.autodraw.com/', description: 'A drawing tool from Google that pairs machine learning with drawings from artists.', imageUrl: getThumbnail('https://www.autodraw.com/'), category: 'Creative', keywords: ['drawing', 'art', 'machine learning'], popularity: { daily: 33, weekly: 231, monthly: 924 }, freeTier: true, monthlyCost: 0, notes: 'Always free, Google Labs' }
];


function App() {
  const [theme, setTheme] = useState<Theme>(Theme.Light);
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);

  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isSubmitFormOpen, setIsSubmitFormOpen] = useState(false);
  
  const [viewMode, setViewMode] = useState<ViewMode>('grid-hover');
  const [activeCategories, setActiveCategories] = useState<string[]>(['All']);
  const [activeSort, setActiveSort] = useState<SortOption>('Weekly');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAdvancedMode, setIsAdvancedMode] = useState(false);

  useEffect(() => {
    // Load initial data immediately for better performance
    setTools(initialTools);
    setLoading(false);
  }, []);
  
  useEffect(() => {
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(prefersDark ? Theme.Dark : Theme.Light);
  }, []);

  useEffect(() => {
    console.log('App: theme changed to:', theme);
    if (theme === Theme.Dark) {
      console.log('App: adding dark class to documentElement');
      document.documentElement.classList.add('dark');
    } else {
      console.log('App: removing dark class from documentElement');
      document.documentElement.classList.remove('dark');
    }
    console.log('App: setting color-scheme to:', theme);
    document.documentElement.style.setProperty('color-scheme', theme);
  }, [theme]);

  const handleCategoryChange = useCallback((category: string) => {
    if (category === 'All') {
      setActiveCategories(['All']);
    } else {
      setActiveCategories(prev => {
        const otherCategories = prev.filter(c => c !== 'All');
        if (otherCategories.includes(category)) {
          const newCategories = otherCategories.filter(c => c !== category);
          return newCategories.length === 0 ? ['All'] : newCategories;
        } else {
          return [...otherCategories, category];
        }
      });
    }
  }, []);

  const handleClearCategories = useCallback(() => {
    setActiveCategories(['All']);
  }, []);

  const handleAddTool = useCallback((newTool: Omit<Tool, 'id'>) => {
    setTools(prevTools => {
      const toolWithId = { ...newTool, id: Math.max(...prevTools.map(t => t.id), 0) + 1 };
      return [toolWithId, ...prevTools];
    });
  }, []);

  const handleUpdateTool = useCallback((updatedTool: Tool) => {
    setTools(prevTools => prevTools.map(tool => tool.id === updatedTool.id ? updatedTool : tool));
  }, []);

  const handleUserSubmit = (url: string, contact: string) => {
    // In a real app, this would be sent to a backend for review.
  };

  const filteredAndSortedTools = useMemo(() => {
    let currentTools = [...tools];

    if (searchQuery) {
      const lowercasedQuery = searchQuery.toLowerCase();
      currentTools = currentTools.filter(tool =>
        tool.name.toLowerCase().includes(lowercasedQuery) ||
        tool.description.toLowerCase().includes(lowercasedQuery) ||
        tool.keywords.some(k => k.toLowerCase().includes(lowercasedQuery))
      );
    }

    if (!activeCategories.includes('All')) {
      currentTools = currentTools.filter(tool => activeCategories.includes(tool.category));
    }

    const sortKey = activeSort.toLowerCase() as keyof Tool['popularity'];
    currentTools.sort((a, b) => b.popularity[sortKey] - a.popularity[sortKey]);

    return currentTools;
  }, [tools, searchQuery, activeCategories, activeSort]);
  
  const featuredTools = useMemo(() => {
      if(loading) return [];
      return [...tools]
        .sort((a, b) => b.popularity.weekly - a.popularity.weekly)
        .slice(0, 3);
  }, [tools, loading]);

  return (
    <div className="bg-white dark:bg-black min-h-screen font-sans text-neutral-800 dark:text-neutral-200 transition-colors duration-300">
      <Header
        theme={theme}
        onThemeChange={setTheme}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenSubmitForm={() => setIsSubmitFormOpen(true)}
        isAdvancedMode={isAdvancedMode}
        onAdvancedModeChange={setIsAdvancedMode}
      />
      
      <Hero />
      <FeaturedTools tools={featuredTools} isAdvancedMode={isAdvancedMode} loading={loading} />

      <FilterBar
        activeCategories={activeCategories}
        onCategoryChange={handleCategoryChange}
        onClearCategories={handleClearCategories}
        activeSort={activeSort}
        onSortChange={setActiveSort}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      <ToolGrid tools={filteredAndSortedTools} viewMode={viewMode} isAdvancedMode={isAdvancedMode} loading={loading} />

      <Footer />

      {isAdminOpen && (
        <Suspense fallback={<div className="fixed inset-0 bg-black/50 z-50" />}>
          <AdminPanel
            onClose={() => setIsAdminOpen(false)}
            onAddTool={handleAddTool}
            onUpdateTool={handleUpdateTool}
            tools={tools}
            toolCount={tools.length}
          />
        </Suspense>
      )}

      {isSubmitFormOpen && (
        <Suspense fallback={<div className="fixed inset-0 bg-black/50 z-50" />}>
          <SubmissionForm
            onClose={() => setIsSubmitFormOpen(false)}
            onSubmit={handleUserSubmit}
          />
        </Suspense>
      )}
    </div>
  );
}

export default App;
