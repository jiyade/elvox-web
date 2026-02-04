import Button from "./Button"
import { IoDocumentTextOutline, IoImageOutline } from "react-icons/io5"

const getFileType = (file) => {
    if (file.file_type.startsWith("image/")) return "image"
    return "document"
}

const AppealDetailsAttachments = ({ attachments }) => {
    return (
        <div className='flex flex-col gap-1'>
            <p className='font-semibold col-span-2 mb-2'>Attachments</p>

            {attachments?.length > 0 ? (
                <div className='flex flex-col gap-2'>
                    {attachments.map((attachment) => (
                        <div
                            key={attachment.id}
                            className='flex justify-between items-center gap-1 border-b border-gray-500 last:border-none pb-2'
                        >
                            <div className='flex items-center gap-2'>
                                {getFileType(attachment) === "document" ? (
                                    <IoDocumentTextOutline />
                                ) : (
                                    <IoImageOutline />
                                )}
                                <p className='text-sm text-primary-light dark:text-primary-dark text-left'>
                                    {attachment.file_name}
                                </p>
                            </div>
                            <Button className='text-sm text-primary-light dark:text-primary-dark border-secondary-light dark:border-secondary-dark border-2 py-1 px-2 hover:bg-secondary-button-hover-light dark:hover:bg-secondary-button-hover-dark'>
                                <a
                                    href={attachment.file_url}
                                    target='_blank'
                                    rel='noopener noreferrer'
                                >
                                    View
                                </a>
                            </Button>
                        </div>
                    ))}
                </div>
            ) : (
                <p className='text-sm text-primary-light dark:text-primary-dark py-1.5 text-justify'>
                    No attachments
                </p>
            )}
        </div>
    )
}

export default AppealDetailsAttachments
