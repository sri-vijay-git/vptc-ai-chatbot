"use client";

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { MessageSquare, Calendar, Trash2, X, Search, FileText } from 'lucide-react';

interface ChatHistoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onLoadChat: (messages: any[]) => void;
}

export default function ChatHistoryModal({ isOpen, onClose, onLoadChat }: ChatHistoryModalProps) {
    const [history, setHistory] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            loadHistory();
        }
    }, [isOpen]);

    const loadHistory = async () => {
        setLoading(true);
        try {
            // Updated to match the new endpoint
            const response = await api.get('/history/');
            setHistory(response.data);
        } catch (error) {
            console.error('Failed to load history:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredHistory = history.filter(chat =>
        chat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        chat.messages.some((msg: any) =>
            msg.content.toLowerCase().includes(searchQuery.toLowerCase())
        )
    );

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fadeIn backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col shadow-2xl border border-gray-100 dark:border-gray-700">
                {/* Header */}
                <div className="p-5 border-b border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800">
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                                <MessageSquare className="w-5 h-5" />
                            </div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                Chat History
                            </h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search conversations..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                        />
                    </div>
                </div>

                {/* History List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 dark:bg-gray-900/50">
                    {loading ? (
                        <div className="flex justify-center py-8">
                            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : filteredHistory.length === 0 ? (
                        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                            <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-20" />
                            <p>No conversations found</p>
                        </div>
                    ) : (
                        filteredHistory.map((chat, idx) => (
                            <button
                                key={idx}
                                onClick={() => {
                                    onLoadChat(chat.messages);
                                    onClose();
                                }}
                                className="w-full p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md transition-all text-left group"
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                        {chat.title}
                                    </h3>
                                    <div className="flex items-center gap-1 text-xs text-gray-400">
                                        <Calendar className="w-3 h-3" />
                                        {new Date(chat.timestamp).toLocaleDateString()}
                                    </div>
                                </div>
                                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                                    {chat.messages.find((m: any) => m.role === 'assistant')?.content || 'No response'}
                                </p>
                                <div className="mt-3 flex items-center gap-2 text-xs text-gray-400">
                                    <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-gray-600 dark:text-gray-300">
                                        {chat.messages.length} messages
                                    </span>
                                </div>
                            </button>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
