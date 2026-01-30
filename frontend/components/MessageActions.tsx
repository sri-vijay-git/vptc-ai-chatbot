import { Copy, ThumbsUp, ThumbsDown, Check } from "lucide-react";
import { useState } from "react";

interface MessageActionsProps {
    content: string;
    onRate?: (rating: 1 | -1) => void;
    currentRating?: number;
}

export default function MessageActions({ content, onRate, currentRating }: MessageActionsProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="flex items-center gap-2 mt-2">
            <button
                onClick={handleCopy}
                className="p-1.5 hover:bg-[#D7CCC8] dark:hover:bg-[#3E2723] rounded-lg transition-colors"
                title="Copy message"
            >
                {copied ? (
                    <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                ) : (
                    <Copy className="w-4 h-4 text-[#5D4037] dark:text-[#FFCC80]/70" />
                )}
            </button>

            {onRate && (
                <>
                    <button
                        onClick={() => onRate(1)}
                        className={`p-1.5 rounded-lg transition-colors ${currentRating === 1
                                ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                                : "hover:bg-[#D7CCC8] dark:hover:bg-[#3E2723] text-[#5D4037] dark:text-[#FFCC80]/70"
                            }`}
                        title="Helpful"
                    >
                        <ThumbsUp className="w-4 h-4" />
                    </button>

                    <button
                        onClick={() => onRate(-1)}
                        className={`p-1.5 rounded-lg transition-colors ${currentRating === -1
                                ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                                : "hover:bg-[#D7CCC8] dark:hover:bg-[#3E2723] text-[#5D4037] dark:text-[#FFCC80]/70"
                            }`}
                        title="Not helpful"
                    >
                        <ThumbsDown className="w-4 h-4" />
                    </button>
                </>
            )}
        </div>
    );
}
