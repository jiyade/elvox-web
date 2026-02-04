import { Dialog, DialogPanel } from "@headlessui/react"
import { FormProvider, useForm } from "react-hook-form"
import toast from "react-hot-toast"
import Button from "./Button"
import ChangePassword from "./ChangePassword"
import FullScreenLoader from "./FullScreenLoader"
import { useEffect, useRef, useState } from "react"
import api from "../api/api"
import { IoMdClose } from "react-icons/io"
import { useModalStore } from "../stores"

const ChangePasswordModal = ({ isOpen, setIsOpen }) => {
    const [isLoading, setIsLoading] = useState(false)
    const methods = useForm()

    const { openModal, removeModal } = useModalStore()
    const onCloseRef = useRef(setIsOpen)

    const onSubmit = async () => {
        try {
            setIsLoading(true)
            const data = methods.getValues()

            const res = await api.patch("/users/update-password", data)
            if (res.status === 200) {
                toast.success(res.data.message, {
                    id: "change-password-success"
                })
            }
            setIsOpen(false)
        } catch (err) {
            if (err.response)
                toast.error(err.response?.data?.error, {
                    id: "change-password-error"
                })
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        onCloseRef.current = setIsOpen
    })

    useEffect(() => {
        if (!isOpen) return

        const modalId = "Change Password"

        openModal(modalId, () => {
            onCloseRef.current(false)
        })

        return () => {
            removeModal(modalId)
        }
    }, [isOpen, openModal, removeModal])

    useEffect(() => {
        if (!isOpen) {
            methods.reset()
        }
    }, [isOpen, methods])

    return (
        <Dialog
            open={isOpen}
            onClose={() => {
                setIsOpen(false)
            }}
            className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm'
        >
            <title>Change Password</title>
            <DialogPanel
                className='
          dark:bg-card-dark bg-card-light 
          dark:text-primary-dark text-primary-light 
          relative shadow-xl w-full max-w-md py-6 px-5 rounded-lg
          max-h-[90vh] min-h-0 flex flex-col overflow-hidden
        '
            >
                <div className='shrink-0 relative'>
                    <div className='border-b border-gray-500 w-full pb-2 pt-1'>
                        <h2 className='text-lg text-center'>Change Password</h2>
                    </div>
                    <IoMdClose
                        className='absolute -right-1.5 -top-2.5 text-2xl cursor-pointer active:scale-50 transition-all duration-300'
                        onClick={() => {
                            setIsOpen(false)
                        }}
                    />
                </div>
                <FormProvider {...methods}>
                    <form
                        onSubmit={methods.handleSubmit(onSubmit)}
                        className='flex flex-col pt-6 gap-8 px-1 overflow-y-auto custom-scrollbar'
                    >
                        <ChangePassword forgot={false} />
                        <div className='flex justify-center gap-3 w-full'>
                            <Button
                                text='Cancel'
                                className='w-1/2 h-11 text-sm bg-secondary-button-light dark:bg-secondary-button-dark hover:bg-secondary-button-hover-light dark:hover:bg-secondary-button-hover-dark'
                                type='button'
                                onClick={() => {
                                    setIsOpen(false)
                                }}
                            />
                            <Button
                                text='Change'
                                className='w-1/2 h-11 text-sm bg-accent hover:bg-button-hover'
                                type='submit'
                                disabled={isLoading}
                            />
                        </div>
                    </form>
                </FormProvider>
                {isLoading && <FullScreenLoader />}
            </DialogPanel>
        </Dialog>
    )
}

export default ChangePasswordModal
