import { Dialog, DialogPanel } from "@headlessui/react"
import Button from "./Button"
import FullScreenLoader from "./FullScreenLoader"
import { useModalStore } from "../stores"
import { useEffect, useRef } from "react"

const TieBreakerConfirm = ({ isOpen, setIsOpen, handleConfirm, isLoading }) => {
    const { openModal, removeModal } = useModalStore()
    const onCloseRef = useRef(setIsOpen)

    useEffect(() => {
        onCloseRef.current = setIsOpen
    })

    useEffect(() => {
        if (!isOpen) return

        const modalId = "Confirm Tie Breaker"

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
          relative shadow-xl w-full max-w-md p-6 rounded-lg
          max-h-[90vh] min-h-0 flex flex-col gap-6 overflow-hidden
        '
            >
                <div className='border-b border-gray-500 w-full pb-2 pt-1'>
                    <h2 className='text-lg text-center'>Finalize Tie-Break</h2>
                </div>
                <div className='text-center text-sm'>
                    <p>
                        You are about to finalize the tie-break ranking for this
                        class. This action is irreversible and the results will
                        be published immediately
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
                        text='Confirm'
                        className='w-1/2 h-11 text-sm bg-accent hover:bg-button-hover'
                        type='button'
                        onClick={handleConfirm}
                    />
                </div>
            </DialogPanel>
            {isLoading && (
                <div className='flex justify-between items-center'>
                    <FullScreenLoader />
                </div>
            )}
        </Dialog>
    )
}

export default TieBreakerConfirm
