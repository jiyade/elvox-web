import { Dialog, DialogPanel } from "@headlessui/react"
import { IoMdClose } from "react-icons/io"
import { useModalStore } from "../stores"
import { useEffect, useRef } from "react"

const ResultsFiltersMobile = ({
    showMobileFilters,
    setShowMobileFilters,
    modalId = "Mobile Filters",
    children
}) => {
    const { openModal, removeModal } = useModalStore()
    const onCloseRef = useRef(setShowMobileFilters)

    useEffect(() => {
        onCloseRef.current = setShowMobileFilters
    })

    useEffect(() => {
        if (!showMobileFilters) return

        openModal(modalId, () => {
            onCloseRef.current(false)
        })

        return () => {
            removeModal(modalId)
        }
    }, [showMobileFilters, openModal, removeModal, modalId])

    return (
        <Dialog
            open={showMobileFilters}
            onClose={() => {
                setShowMobileFilters(false)
            }}
            className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs sm:hidden'
        >
            <DialogPanel className='fixed inset-y-0 left-0 w-72 bg-card-light dark:bg-card-dark dark:text-primary-dark text-primary-light shadow-xl p-6 flex flex-col'>
                <div className='shrink-0 relative'>
                    <div className='border-b border-gray-500 w-full p-2'>
                        <h2 className='text-lg text-center'>Filters</h2>
                    </div>
                    <IoMdClose
                        className='absolute -right-1.5 -top-2.5 text-2xl cursor-pointer active:scale-50 transition-all duration-300'
                        onClick={() => {
                            setShowMobileFilters(false)
                        }}
                    />
                </div>
                {children}
            </DialogPanel>
        </Dialog>
    )
}

export default ResultsFiltersMobile
