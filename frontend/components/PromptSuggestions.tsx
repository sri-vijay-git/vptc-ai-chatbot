interface PromptSuggestionsProps {
    suggestions: string[];
    onSelect: (prompt: string) => void;
}

export default function PromptSuggestions({ suggestions, onSelect }: PromptSuggestionsProps) {
    if (!suggestions || suggestions.length === 0) return null;

    return (
        <div className="flex flex-wrap gap-2 mb-4">
            {suggestions.map((suggestion, idx) => (
                <button
                    key={idx}
                    onClick={() => onSelect(suggestion)}
                    className="px-4 py-2 bg-white dark:bg-[#2D1B15] border border-[#D7CCC8] dark:border-[#5D4037]
                             rounded-full text-sm text-[#5D4037] dark:text-[#FFCC80]/90
                             hover:border-[#8B6F47] dark:hover:border-[#FFCC80] hover:shadow-sm
                             transition-all"
                >
                    {suggestion}
                </button>
            ))}
        </div>
    );
}
