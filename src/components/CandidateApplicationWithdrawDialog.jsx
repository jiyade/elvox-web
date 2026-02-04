import { Dialog, DialogPanel } from "@headlessui/react"
import Button from "./Button"
import FullScreenLoader from "./FullScreenLoader"
import { useEffect, useRef } from "react"
import { useModalStore } from "../stores"

const CandidateApplicationWithdrawDialog = ({
    isOpen,
    setIsOpen,
    handleWithdraw,
    password,
    setPassword,
    error,
    isLoading
}) => {
    const { openModal, removeModal } = useModalStore()
    const onCloseRef = useRef(setIsOpen)

    useEffect(() => {
        onCloseRef.current = setIsOpen
    })

    useEffect(() => {
        if (!isOpen) return

        const modalId = "Withdraw Application"

        openModal(modalId, () => {
            onCloseRef.current(false)
        })

        return () => {
            removeModal(modalId)
        }
    }, [isOpen, openModal, removeModal])

    useEffect(() => {
        setPassword("")
    }, [setPassword])

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
                    <h2 className='text-lg text-center'>
                        Withdraw application?
                    </h2>
                </div>
                <div className='text-center text-sm'>
                    <p>
                        Withdrawing your application is permanent. Once
                        withdrawn, you cannot apply again for this election
                    </p>
                </div>
                <div className='flex flex-col gap-2 text-sm'>
                    <label
                        htmlFor='password'
                        className='text-primary-light dark:text-primary-dark'
                    >
                        Password
                    </label>
                    <input
                        type='password'
                        id='password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder='Enter your password'
                        className='outline-none border-none bg-field-light dark:bg-field-dark  rounded-md w-full h-11 p-3 text-primary-light dark:text-primary-dark placeholder:text-secondary-light dark:placeholder:text-secondary-dark active:bg-field-light dark:active:bg-field-dark'
                        onKeyDown={(e) => {
                            if (e.key === "Enter") handleWithdraw()
                        }}
                    />
                    {error && (
                        <p className='text-xs text-red-500 mt-1 font-medium'>
                            {error}
                        </p>
                    )}
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
                        text='Withdraw'
                        className='w-1/2 h-11 text-sm bg-red-700 hover:bg-red-800'
                        type='button'
                        onClick={handleWithdraw}
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

export default CandidateApplicationWithdrawDialog
