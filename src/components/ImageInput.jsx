import { useEffect, useState } from "react"
import { useFormContext } from "react-hook-form"
import { LuUpload } from "react-icons/lu"

const ImageInput = ({ name, label }) => {
    const [preview, setPreview] = useState(null)

    const { register } = useFormContext()

    useEffect(() => {
        return () => {
            if (preview) URL.revokeObjectURL(preview)
        }
    }, [preview])

    return (
        <div className='w-full flex justify-center'>
            <label
                htmlFor={name}
                className={`inline-flex justify-center items-center bg-field-light dark:bg-field-dark ${
                    preview ? "" : "w-full"
                } h-32 rounded-md border-2 border-dashed border-gray-500 cursor-pointer dark:hover:bg-secondary-button-hover-dark hover:bg-secondary-button-hover-light ${
                    preview ? "" : "p-2"
                }`}
            >
                {!preview && (
                    <div className='flex flex-col items-center gap-1'>
                        <LuUpload className='size-5' />
                        <p className='text-sm text-center'>
                            Click to upload
                            <br />
                            <span className='text-xs'>JPG,PNG only</span>
                        </p>
                    </div>
                )}
                {preview && (
                    <img
                        alt={label}
                        src={preview}
                        className='w-full h-full object-contain rounded-md'
                    />
                )}
            </label>
            <input
                type='file'
                id={name}
                accept='.jpg,.jpeg,.png,image/jpeg,image/png'
                className='hidden'
                {...register(name, {
                    required: `${label} is required`,
                    onChange: (e) => {
                        const file = e.target.files?.[0]
                        if (!file) return

                        if (preview) URL.revokeObjectURL(preview)
                        setPreview(URL.createObjectURL(file))
                    }
                })}
            />
        </div>
    )
}

export default ImageInput
