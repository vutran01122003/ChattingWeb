import { BsEmojiSmile } from "react-icons/bs";
import { MdGif } from "react-icons/md";

export default function EmojiPicker({ onEmojiClick }) {
    const emojis = ['😀', '😂', '😍', '🥰', '😎', '🤔', '👍', '🎉', '❤️', '👏', '🔥', '💯'];
    
    return (
        <div className="absolute bottom-14 left-0 bg-white shadow-lg rounded-lg p-3 w-64 z-10 border">
            <div className="flex justify-between border-b pb-2 mb-2">
                <button className="bg-blue-100 rounded px-3 py-1 flex items-center">
                    <BsEmojiSmile className="mr-1" /> Emoji
                </button>
                <button className="px-3 py-1 flex items-center">
                    <MdGif className="mr-1" /> GIF
                </button>
            </div>
            <div className="grid grid-cols-6 gap-2">
                {emojis.map((emoji, index) => (
                    <button
                        key={index}
                        className="text-xl hover:bg-gray-100 rounded p-1"
                        onClick={() => onEmojiClick(emoji)}
                    >
                        {emoji}
                    </button>
                ))}
            </div>
        </div>
    );
}