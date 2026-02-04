import { Dialog, DialogPanel } from "@headlessui/react"
import Button from "./Button"
import { useEffect, useRef } from "react"
import { useModalStore } from "../stores"

const ApproveApplicationRejectionDialog = ({
    isOpen,
    setIsOpen,
    handleAction,
    rejectionNote,
    setRejectionNote,
    error
}) => {
    const { openModal, removeModal } = useModalStore()
    const onCloseRef = useRef(setIsOpen)

    useEffect(() => {
        onCloseRef.current = setIsOpen
    })

    useEffect(() => {
        if (!isOpen) return

        const modalId = "Reject Application"

        openModal(modalId, () => {
            onCloseRef.current(false)
        })

        return () => {
            removeModal(modalId)
        }
    }, [isOpen, openModal, removeModal])

    useEffect(() => {
        setRejectionNote("")
    }, [setRejectionNote])

    return (
        <Dialog
            open={isOpen.show}
            onClose={() => {
                setIsOpen({ show: false, id: null })
            }}
            className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm'
        >
            <DialogPanel
                className='
          dark:bg-card-dark bg-card-light 
          dark:text-primary-dark text-primary-light 
          relative shadow-xl w-full max-w-md p-6 rounded-lg
          max-h-[90vh] min-h-0 flex flex-col gap-3 overflow-hidden
        '
            >
                <div className='border-b border-gray-500 w-full pb-2 pt-1'>
                    <h2 className='text-lg text-center'>Reject application?</h2>
                </div>
                <div className='text-center text-sm pb-2'>
                    <p>
                        Rejecting this application is final. Once rejected, the
                        candidate cannot reapply for this election
                    </p>
                </div>
                <div className='flex flex-col gap-2 text-sm'>
                    <label
                        htmlFor='rejection-reason'
                        className='text-primary-light dark:text-primary-dark'
                    >
                        Rejection Reason
                    </label>
                    <textarea
                        id='rejection-reason'
                        value={rejectionNote}
                        onChange={(e) => setRejectionNote(e.target.value)}
                        placeholder='Enter your reason to reject this application'
                        rows={4}
                        className='outline-none border-none bg-field-light dark:bg-field-dark
             rounded-md w-full px-3 py-2
             text-primary-light dark:text-primary-dark
             placeholder:text-secondary-light dark:placeholder:text-secondary-dark
             resize-none custom-scrollbar'
                        maxLength={1000}
                        onKeyDown={(e) => {
                            if (e.key === "Enter")
                                handleAction("rejected", isOpen?.id)
                        }}
                    />
                    {rejectionNote?.length === 0 && error && (
                        <p className='text-xs text-red-500 mt-1 font-medium'>
                            {error}
                        </p>
                    )}
                    <div
                        className={`flex relative ${
                            rejectionNote.length ? "pb-3.5" : ""
                        }`}
                    >
                        {rejectionNote?.length > 0 && (
                            <p className='absolute right-0 text-xs text-secondary-light dark:text-secondary-dark'>
                                {rejectionNote.length}/1000
                            </p>
                        )}
                    </div>
                </div>
                <div className='flex justify-center gap-3 w-full'>
                    <Button
                        text='Cancel'
                        className='w-1/2 h-11 text-sm bg-secondary-button-light dark:bg-secondary-button-dark hover:bg-secondary-button-hover-light dark:hover:bg-secondary-button-hover-dark'
                        type='button'
                        onClick={() => {
                            setIsOpen({ show: false, id: null })
                        }}
                    />
                    <Button
                        text='Reject'
                        className='w-1/2 h-11 text-sm bg-red-700 hover:bg-red-800'
                        type='button'
                        onClick={() => handleAction("rejected", isOpen?.id)}
                    />
                </div>
            </DialogPanel>
        </Dialog>
    )
}

export default ApproveApplicationRejectionDialog
