import { MdOutlineFileDownload } from "react-icons/md";

export default function FileAttachment({ file, onImageClick }) {
    if (file.file_type.startsWith("image/")) {
        return (
            <img
                src={file.file_path}
                alt={file.file_name}
                className="rounded-md object-cover max-h-[150px] w-full cursor-pointer"
                onClick={() => onImageClick(file.file_path)}
            />
        );
    } else if (file.file_type === "video/mp4") {
        return (
            <video
                controls
                className="rounded-md max-h-[200px] w-full"
            >
                <source src={file.file_path} type="video/mp4" />
                Trình duyệt của bạn không hỗ trợ video.
            </video>
        );
    } else {
        return (
            <div className='flex items-center gap-2'>
                <div
                    className="flex items-center gap-2 p-2 bg-white rounded-full cursor-pointer"
                    onClick={() => window.open(file.file_path, "_blank")}
                >
                    <MdOutlineFileDownload className="text-black" />
                </div>
                <span className="text-sm text-black truncate">{file.file_name}</span>
            </div>
        );
    }
}