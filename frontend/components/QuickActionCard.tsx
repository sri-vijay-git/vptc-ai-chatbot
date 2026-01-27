interface QuickActionCardProps {
    icon: string;
    title: string;
    description: string;
    onClick: () => void;
}

export default function QuickActionCard({ icon, title, description, onClick }: QuickActionCardProps) {
    return (
        <button
            onClick={onClick}
            className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all transform hover:scale-105 text-left border border-gray-200 dark:border-gray-700 h-full flex flex-col items-start"
        >
            <div className="text-3xl mb-2">{icon}</div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                {title}
            </h4>
            <p className="text-xs text-gray-600 dark:text-gray-400">
                {description}
            </p>
        </button>
    );
}
