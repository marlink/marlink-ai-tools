import React, { useState } from 'react';

interface SubmissionFormProps {
    onClose: () => void;
    onSubmit: (url: string, contact: string) => void;
}

const SubmissionForm: React.FC<SubmissionFormProps> = ({ onClose, onSubmit }) => {
    const [url, setUrl] = useState('');
    const [contact, setContact] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!url) return;
        onSubmit(url, contact);
        setIsSubmitted(true);
    };

    return (
        <div className="fixed inset-0 bg-black/50 dark:bg-white/10 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-lg bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 p-8 relative">
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 text-neutral-500 hover:text-black dark:hover:text-white transition-colors"
                    aria-label="Close submission form"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold tracking-tighter text-black dark:text-white">Submit a Tool</h2>
                    <p className="text-neutral-600 dark:text-neutral-400 mt-2">Found a cool AI tool? Share it with the community!</p>
                </div>

                {isSubmitted ? (
                    <div className="text-center space-y-4 py-8">
                        <p className="text-2xl">✅</p>
                        <h3 className="text-xl font-semibold text-black dark:text-white">Thank You!</h3>
                        <p className="text-neutral-700 dark:text-neutral-300">Your submission has been received and is pending review.</p>
                        <button
                            onClick={onClose}
                            className="w-full max-w-xs mx-auto mt-4 px-6 py-3 text-sm font-medium border border-black dark:border-white text-black dark:text-white hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black transition-colors duration-300"
                        >
                            Close
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="submission-url" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                                Tool URL <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="url"
                                id="submission-url"
                                name="url"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                placeholder="https://example.com"
                                required
                                className="w-full px-4 py-3 bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 focus:ring-2 focus:ring-black dark:focus:ring-white focus:outline-none transition-all duration-200"
                            />
                        </div>
                         <div>
                            <label htmlFor="contact" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                                Your Email or Phone (Optional)
                            </label>
                            <input
                                type="text"
                                id="contact"
                                name="contact"
                                value={contact}
                                onChange={(e) => setContact(e.target.value)}
                                placeholder="So we can follow up with questions"
                                className="w-full px-4 py-3 bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 focus:ring-2 focus:ring-black dark:focus:ring-white focus:outline-none transition-all duration-200"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full px-6 py-3 text-sm font-medium border border-black dark:border-white text-black dark:text-white hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                           Submit for Review
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default SubmissionForm;