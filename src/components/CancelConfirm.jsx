import { Dialog, DialogPanel } from "@headlessui/react"
import Button from "./Button"
import toast from "react-hot-toast"
import { useModalStore } from "../stores"
import { useEffect, useRef } from "react"

const CancelConfirm = ({ isOpen, setIsOpen, setIsFormOpen }) => {
    const { openModal, removeModal } = useModalStore()
    const onCloseRef = useRef(setIsOpen)

    useEffect(() => {
        onCloseRef.current = setIsOpen
    })

    useEffect(() => {
        if (!isOpen) return

        const modalId = "Cancel Confirm"

        openModal(modalId, () => {
            onCloseRef.current(false)
        })

        return () => {
            removeModal(modalId)
        }
    }, [isOpen, openModal, removeModal])

    return (
        <Dialog
            open={isOpen}
            onClose={() => {
                setIsOpen(false)
            }}
            className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm'
        >
            <DialogPanel
                className='
          dark:bg-card-dark bg-card-light 
          dark:text-primary-dark text-primary-light 
          relative shadow-xl w-full max-w-sm p-6 rounded-lg
          max-h-[90vh] min-h-0 flex flex-col overflow-hidden
        '
            >
                <div className='border-b border-gray-500 w-full pb-2 pt-1'>
                    <h2 className='text-lg text-center'>Discard changes?</h2>
                </div>
                <div className='text-center text-base px-3 py-4'>
                    <p>
                        You have unsaved changes. Closing this form will
                        permanently discard them.
                    </p>
                </div>
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
                        text='Discard'
                        className='w-1/2 h-11 text-sm bg-red-700 hover:bg-red-800'
                        type='button'
                        onClick={() => {
                            setIsOpen(false)
                            setIsFormOpen(false)
                            toast.dismiss()
                        }}
                    />
                </div>
            </DialogPanel>
        </Dialog>
    )
}

export default CancelConfirm
