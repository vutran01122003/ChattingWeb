import { BsFileEarmark } from "react-icons/bs";

export default function FilePopup({ onFileSelect }) {
    const fileTypes = ['File'];
    
    return (
        <div className="absolute bottom-14 left-0 bg-white shadow-lg rounded-lg p-3 w-48 z-10 border">
            <h3 className="font-medium border-b pb-2 mb-2">Choose File Type</h3>
            <ul>
                {fileTypes.map((type, index) => (
                    <li key={index}>
                        <button
                            className="w-full text-left py-2 px-2 flex items-center hover:bg-gray-100 rounded"
                            onClick={onFileSelect}
                        >
                            <BsFileEarmark className="mr-2" /> {type}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}