export default function DateHeader({ date }) {
    const formatDateHeader = (dateString) => {
        const today = new Date();
        const date = new Date(dateString);

        const isToday = today.toDateString() === date.toDateString();

        const yesterday = new Date();
        yesterday.setDate(today.getDate() - 1);
        const isYesterday = yesterday.toDateString() === date.toDateString();

        if (isToday) return "Hôm nay";
        if (isYesterday) return "Hôm qua";

        return date.toLocaleDateString('vi-VN', {
            weekday: 'short',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    return (
        <div className="flex justify-center my-4">
            <div className="bg-gray-300 px-3 py-1 rounded-full text-xs text-gray-700">
                {formatDateHeader(date)}
            </div>
        </div>
    );
}