import { useState } from "react"
import { useFormContext } from "react-hook-form"

const MAX_FILES = 3
const MAX_SIZE = 5 * 1024 * 1024 // 5MB

const SubmitAppealFormAttachments = () => {
    const [files, setFiles] = useState([])

    const { setValue } = useFormContext()

    const handleFiles = (e) => {
        const selected = Array.from(e.target.files)

        const validFiles = selected.filter((file) => file.size <= MAX_SIZE)

        setFiles((prev) => {
            const merged = [...prev, ...validFiles]

            const unique = merged.filter(
                (file, index, self) =>
                    index ===
                    self.findIndex(
                        (f) => f.name === file.name && f.size === file.size
                    )
            )

            const limited = unique.slice(0, MAX_FILES)
            setValue("attachments", limited)
            return limited
        })

        e.target.value = ""
    }

    const removeFile = (name) => {
        setFiles((prev) => {
            const updated = prev.filter((f) => f.name !== name)
            setValue("attachments", updated)
            return updated
        })
    }

    return (
        <div className='flex flex-col gap-2'>
            <p>
                Supporting Evidence{" "}
                <span className='text-secondary-light dark:text-secondary-dark'>
                    (optional)
                </span>
            </p>
            {files.length > 0 && (
                <ul className='mt-1 space-y-2 text-sm'>
                    {files.map((file) => (
                        <li
                            key={file.name}
                            className='flex justify-between items-center'
                        >
                            <span className='truncate text-xs'>
                                {file.name}
                            </span>
                            <button
                                type='button'
                                onClick={() => removeFile(file.name)}
                                className='cursor-pointer text-red-500 hover:text-red-600 text-xs'
                            >
                                ✕
                            </button>
                        </li>
                    ))}
                </ul>
            )}
            <label
                htmlFor='attachments'
                className='flex flex-col flex-1 justify-center items-center py-1.5 text-sm border-3 border-[#babdc2] dark:border-[#3A3F4B] hover:bg-[#d2d3d6] dark:hover:bg-[#2A2E38] dark:hover:border-[#4A5060] hover:border-[#9CA3AF] text-primary-light dark:text-primary-dark rounded-md cursor-pointer active:scale-85 transition-all duration-200'
            >
                <p className=''>Add Attachments</p>
                <p className='text-xs text-gray-700 dark:text-gray-300'>
                    (PNG, JPG, PDF · Max 3 files · 5MB each)
                </p>
            </label>
            <input
                type='file'
                id='attachments'
                multiple
                accept='.png,.jpg,.jpeg,.pdf'
                className='hidden'
                onChange={handleFiles}
            />
        </div>
    )
}

export default SubmitAppealFormAttachments
