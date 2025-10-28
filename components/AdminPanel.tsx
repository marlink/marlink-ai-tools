import React, { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Tool } from '../types';

interface AdminPanelProps {
    onClose: () => void;
    onAddTool: (newTool: Omit<Tool, 'id'>) => void;
    toolCount: number;
    tools: Tool[];
    onUpdateTool: (updatedTool: Tool) => void;
}

type AnalysisResult = {
    name: string;
    description: string;
    category: string;
    keywords: string[];
    freeTier: boolean;
    monthlyCost: number | null;
    notes: string;
};

type AdminTab = 'dashboard' | 'settings' | 'thumbnails';

const AdminPanel: React.FC<AdminPanelProps> = ({ onClose, onAddTool, toolCount, tools, onUpdateTool }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('');
    const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');

    const [url, setUrl] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState('');
    const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
    const [error, setError] = useState('');
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (username === 'admin' && password === 'password123') {
            setIsLoggedIn(true);
            setLoginError('');
            setUsername('');
            setPassword('');
        } else {
            setLoginError('Invalid credentials. Please try again.');
        }
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        // Resetting all other states as well
        setUrl('');
        setIsSubmitting(false);
        setMessage('');
        setAnalysisResult(null);
        setError('');
        setHasUnsavedChanges(false);
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, toolId: number) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const imageUrl = e.target?.result as string;
                const tool = tools.find(t => t.id === toolId);
                if (tool) {
                    const updatedTool = { ...tool, imageUrl };
                    onUpdateTool(updatedTool);
                    setHasUnsavedChanges(true);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmitAnalysis = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!url) {
            setError('Please enter a valid URL.');
            return;
        }
        setIsSubmitting(true);
        setMessage('Analyzing URL with Gemini...');
        setError('');
        setAnalysisResult(null);
        
        try {
            const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || 'PLACEHOLDER_API_KEY');
            const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

            const prompt = `
                Based on information found via Google Search for the website ${url}, provide details about the AI tool in a valid JSON format.
                Do not add any markdown formatting like \`\`\`json.
                The JSON object must have these keys:
                - "name" (string)
                - "description" (string, a concise one-sentence summary)
                - "category" (string, one of "Productivity", "Writing", "Creative", "Developer", "Marketing", "Research", "Video", "Audio")
                - "keywords" (array of 5 relevant string keywords)
                - "freeTier" (boolean, true if there is a free tier or free trial, otherwise false)
                - "monthlyCost" (number or null, the starting price for a monthly subscription. If it's free, use 0. If pricing is enterprise-only or not publicly available, use null)
                - "notes" (string, a brief note about the pricing, e.g., "Paid unlocks advanced features").
            `;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            let jsonString = response.text().trim();

            if (jsonString.startsWith('```json')) {
              jsonString = jsonString.substring(7, jsonString.length - 3).trim();
            }

            const analysisResult: AnalysisResult = JSON.parse(jsonString);
            setAnalysisResult(analysisResult);
            setMessage('Analysis complete. Review the details below.');

        } catch (err) {
            setError("Failed to analyze the URL. The tool might be too new or information couldn't be retrieved. Please try another URL.");
            setMessage('');
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const handleAddTool = () => {
        if (!analysisResult || !url) return;

        const newTool: Omit<Tool, 'id'> = {
            ...analysisResult,
            url,
            imageUrl: `https://s0.wordpress.com/mshots/v1/${encodeURIComponent(url)}?w=400&h=300`,
            popularity: { daily: 0, weekly: 0, monthly: 0 }
        };
        onAddTool(newTool);
        onClose();
        setHasUnsavedChanges(true);
    };

    const refreshThumbnail = (tool: Tool) => {
        const newImageUrl = `https://s0.wordpress.com/mshots/v1/${encodeURIComponent(tool.url)}?w=400&h=300`;
        const updatedTool = { ...tool, imageUrl: newImageUrl };
        onUpdateTool(updatedTool);
        setHasUnsavedChanges(true);
    };

    // Download functionality removed to reduce bundle size

    const handleSaveChanges = () => {
        setHasUnsavedChanges(false);
        // In a real app, this would save to backend
        setMessage('Changes saved successfully!');
        setTimeout(() => setMessage(''), 3000);
    };

    const renderLogin = () => (
        <>
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold tracking-tighter text-black dark:text-white">Admin Login</h2>
                <p className="text-neutral-600 dark:text-neutral-400 mt-2">Enter credentials to access the panel.</p>
            </div>
            <form onSubmit={handleLogin} className="space-y-6">
                 <div>
                    <label htmlFor="username" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                        Username
                    </label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full px-4 py-3 bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 focus:ring-2 focus:ring-black dark:focus:ring-white focus:outline-none transition-all duration-200"
                    />
                </div>
                 <div>
                    <label htmlFor="password" aria-label="Password" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                        Password
                    </label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-3 bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 focus:ring-2 focus:ring-black dark:focus:ring-white focus:outline-none transition-all duration-200"
                    />
                </div>
                 <p className="text-xs text-center text-neutral-500">Use <code className="bg-neutral-100 dark:bg-neutral-800 p-1 rounded">admin</code> / <code className="bg-neutral-100 dark:bg-neutral-800 p-1 rounded">password123</code> to login.</p>
                <button
                    type="submit"
                    className="w-full px-6 py-3 text-sm font-medium border border-black dark:border-white text-black dark:text-white hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black transition-colors duration-300"
                >
                    Login
                </button>
                {loginError && <p className="mt-4 text-center text-sm text-red-600 dark:text-red-400">{loginError}</p>}
            </form>
        </>
    );

    const renderPanel = () => (
        <>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-3xl font-bold tracking-tighter text-black dark:text-white">Admin Panel</h2>
                    <p className="text-neutral-600 dark:text-neutral-400 mt-1">Manage the tool directory.</p>
                </div>
                <button onClick={handleLogout} className="text-sm text-neutral-500 hover:text-red-500 dark:hover:text-red-400 transition-colors">Logout</button>
            </div>

            <div className="border-b border-neutral-200 dark:border-neutral-800 mb-6">
                <nav className="flex space-x-4" aria-label="Tabs">
                    <button onClick={() => setActiveTab('dashboard')} className={`px-3 py-2 font-medium text-sm rounded-t-md ${activeTab === 'dashboard' ? 'border-b-2 border-black dark:border-white text-black dark:text-white' : 'text-neutral-500 hover:text-black dark:hover:text-white'}`}>Dashboard</button>
                    <button onClick={() => setActiveTab('settings')} className={`px-3 py-2 font-medium text-sm rounded-t-md ${activeTab === 'settings' ? 'border-b-2 border-black dark:border-white text-black dark:text-white' : 'text-neutral-500 hover:text-black dark:hover:text-white'}`}>Settings</button>
                    <button onClick={() => setActiveTab('thumbnails')} className={`px-3 py-2 font-medium text-sm rounded-t-md ${activeTab === 'thumbnails' ? 'border-b-2 border-black dark:border-white text-black dark:text-white' : 'text-neutral-500 hover:text-black dark:hover:text-white'}`}>Thumbnails</button>
                </nav>
            </div>

            {activeTab === 'dashboard' && (
                <div className="space-y-8">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-neutral-50 dark:bg-neutral-900/50 p-4 border border-neutral-200 dark:border-neutral-800">
                            <h3 className="font-semibold text-neutral-800 dark:text-neutral-200">Total Tools</h3>
                            <p className="text-3xl font-bold text-black dark:text-white mt-1">{toolCount}</p>
                        </div>
                        <div className="bg-neutral-50 dark:bg-neutral-900/50 p-4 border border-neutral-200 dark:border-neutral-800">
                            <h3 className="font-semibold text-neutral-800 dark:text-neutral-200">Pending Submissions</h3>
                            <p className="text-3xl font-bold text-black dark:text-white mt-1">3 <span className="text-sm font-normal text-neutral-500">(demo)</span></p>
                        </div>
                    </div>
                    
                    <div>
                        <h3 className="text-xl font-semibold mb-4 text-black dark:text-white tracking-tight">Add New Tool</h3>
                        {!analysisResult ? (
                            <form onSubmit={handleSubmitAnalysis} className="space-y-4">
                                <div>
                                    <label htmlFor="url" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Tool URL</label>
                                    <input type="url" id="url" name="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://example.com" required className="w-full px-4 py-3 bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 focus:ring-2 focus:ring-black dark:focus:ring-white focus:outline-none transition-all duration-200" />
                                </div>
                                <button type="submit" disabled={isSubmitting} className="w-full px-6 py-3 text-sm font-medium border border-black dark:border-white text-black dark:text-white hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed">{isSubmitting ? 'Analyzing...' : 'Submit & Analyze'}</button>
                            </form>
                        ) : (
                            <div className="space-y-4">
                                <div className="p-4 border border-neutral-200 dark:border-neutral-700 space-y-3 text-sm bg-neutral-50 dark:bg-neutral-900/50">
                                    <p><strong>Name:</strong> {analysisResult.name}</p>
                                    <p><strong>Description:</strong> {analysisResult.description}</p>
                                    <p><strong>Category:</strong> {analysisResult.category}</p>
                                    <p><strong>Keywords:</strong> {analysisResult.keywords.join(', ')}</p>
                                    <p><strong>URL:</strong> {url}</p>
                                    <p><strong>Free Tier:</strong> {analysisResult.freeTier ? 'Yes' : 'No'}</p>
                                    <p><strong>Monthly Cost:</strong> {analysisResult.monthlyCost === null ? 'N/A' : analysisResult.monthlyCost === 0 ? 'Free' : `$${analysisResult.monthlyCost}`}</p>
                                    <p><strong>Notes:</strong> {analysisResult.notes}</p>
                                </div>
                                <button onClick={handleAddTool} className="w-full px-6 py-3 text-sm font-medium bg-black text-white dark:bg-white dark:text-black hover:opacity-80 transition-opacity">Confirm & Add Tool</button>
                                <button onClick={() => setAnalysisResult(null)} className="w-full text-center text-sm text-neutral-500 hover:text-black dark:hover:text-white mt-2">Analyze another URL</button>
                            </div>
                        )}
                        {message && <p className="mt-4 text-center text-sm text-green-600 dark:text-green-400">{message}</p>}
                        {error && <p className="mt-4 text-center text-sm text-red-600 dark:text-red-400">{error}</p>}
                    </div>
                </div>
            )}

            {activeTab === 'settings' && (
                <div className="space-y-8">
                    <div>
                        <h3 className="text-xl font-semibold mb-1 text-black dark:text-white tracking-tight">Settings</h3>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">Manage application configuration and integrations.</p>
                    </div>
                    
                    <div className="space-y-6 border-t border-neutral-200 dark:border-neutral-800 pt-6">
                        <h4 className="font-semibold text-lg text-black dark:text-white">General Settings</h4>
                        <div className="flex items-center justify-between">
                            <div>
                                <label htmlFor="maintenance-mode" className="font-medium text-neutral-800 dark:text-neutral-200">Maintenance Mode</label>
                                <p className="text-sm text-neutral-500">Temporarily disable public access to the site.</p>
                            </div>
                            <button
                                disabled
                                className="relative inline-flex h-6 w-11 items-center rounded-full bg-neutral-200 dark:bg-neutral-700 cursor-not-allowed"
                            >
                                <span className="inline-block h-4 w-4 transform rounded-full bg-white dark:bg-neutral-500 translate-x-1" />
                            </button>
                        </div>
                    </div>
            
                    <div className="space-y-4 border-t border-neutral-200 dark:border-neutral-800 pt-6">
                        <h4 className="font-semibold text-lg text-black dark:text-white">API Configuration</h4>
                        <div>
                             <label htmlFor="gemini-api-key" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                                Gemini API Key
                            </label>
                            <input
                                type="password"
                                id="gemini-api-key"
                                value="••••••••••••••••••••••"
                                disabled
                                className="w-full px-4 py-3 bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 opacity-50 cursor-not-allowed"
                            />
                             <p className="text-xs text-neutral-500 mt-2">API Key is managed via environment variables and cannot be changed here.</p>
                        </div>
                    </div>
                    
                    <div className="border-t border-neutral-200 dark:border-neutral-800 pt-6 flex justify-end">
                        <button
                            disabled
                            className="px-6 py-2 text-sm font-medium border border-slate-800 dark:border-slate-200 text-slate-800 dark:text-slate-200 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            Save Changes
                        </button>
                    </div>
                </div>
            )}

            {activeTab === 'thumbnails' && (
                <div className="space-y-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-xl font-semibold mb-1 text-black dark:text-white tracking-tight">Thumbnail Management</h3>
                            <p className="text-sm text-neutral-500 dark:text-neutral-400">Manage and update tool thumbnails.</p>
                        </div>
                        {/* Download functionality removed to reduce bundle size */}
                    </div>

                    <div className="space-y-4">
                        {tools.map((tool) => (
                            <div key={tool.id} className="flex items-center gap-4 p-4 border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900/50">
                                <img
                                    src={tool.imageUrl || '/fallback-thumbnail.svg'}
                                    alt={tool.name}
                                    className="w-16 h-16 object-cover border border-neutral-300 dark:border-neutral-600"
                                />
                                <div className="flex-1">
                                    <h4 className="font-medium text-black dark:text-white">{tool.name}</h4>
                                    <p className="text-sm text-neutral-500 dark:text-neutral-400">Current thumbnail: {tool.imageUrl ? 'Set' : 'Default'}</p>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => {
                                            const updatedTool = { ...tool, imageUrl: '/fallback-thumbnail.svg' };
                                            onUpdateTool(updatedTool);
                                            setHasUnsavedChanges(true);
                                        }}
                                        className="px-3 py-1 text-sm bg-red-600 text-white hover:bg-red-700 transition-colors"
                                    >
                                        Remove
                                    </button>
                                    <button
                                        onClick={() => refreshThumbnail(tool)}
                                        className="px-3 py-1 text-sm bg-purple-600 text-white hover:bg-purple-700 transition-colors"
                                    >
                                        Refresh
                                    </button>
                                    <label className="px-3 py-1 text-sm bg-blue-600 text-white hover:bg-blue-700 transition-colors cursor-pointer">
                                        Replace
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleFileChange(e, tool.id)}
                                            className="hidden"
                                        />
                                    </label>
                                </div>
                            </div>
                        ))}
                    </div>

                    {hasUnsavedChanges && (
                        <div className="flex justify-end pt-4 border-t border-neutral-200 dark:border-neutral-800">
                            <button
                                onClick={handleSaveChanges}
                                className="px-6 py-3 text-lg font-semibold bg-red-600 text-white hover:bg-red-700 transition-colors"
                            >
                                Save Changes
                            </button>
                        </div>
                    )}
                </div>
            )}
        </>
    );

    return (
        <div className="fixed inset-0 bg-black/50 dark:bg-white/10 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-2xl bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 p-8 relative max-h-[90vh] overflow-y-auto">
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 text-neutral-500 hover:text-black dark:hover:text-white transition-colors"
                    aria-label="Close admin panel"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                {isLoggedIn ? renderPanel() : renderLogin()}
            </div>
        </div>
    );
};

export default AdminPanel;