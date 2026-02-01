import { HiChevronRight } from "react-icons/hi"
import Button from "./Button"
import { useEffect, useRef, useState } from "react"

const ExportResultButton = ({ exportResults }) => {
    const [open, setOpen] = useState(false)

    const containerRef = useRef(null)

    useEffect(() => {
        const handlePointerDown = (e) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(e.target)
            ) {
                setOpen(false)
            }
        }

        document.addEventListener("pointerdown", handlePointerDown)

        return () => {
            document.removeEventListener("pointerdown", handlePointerDown)
        }
    }, [])

    return (
        <div
            className='flex flex-col group relative'
            ref={containerRef}
        >
            <Button
                className={`flex items-center justify-center gap-1 h-9 px-1 text-sm bg-accent hover:bg-button-hover ${open ? "rounded-b-none" : "group-hover:rounded-b-none"}`}
                type='button'
                onClick={() => setOpen((prev) => !prev)}
                animation={false}
            >
                <span className='pl-2'>Export</span>
                <div className='flex items-center justify-center h-full'>
                    <HiChevronRight
                        className={`size-5 transition-transform duration-200 ${
                            open ? "rotate-90" : "group-hover:rotate-90"
                        }`}
                    />
                </div>
            </Button>
            <div
                className={`text-primary-light dark:text-primary-dark rounded-b-md absolute top-full left-0 border border-accent w-full bg-bg-light dark:bg-bg-dark ${open ? "flex" : "hidden group-hover:flex"}`}
            >
                <ul className='flex flex-col flex-1 items-center justify-center gap-1'>
                    <li className='border-b border-accent w-full text-center'>
                        <button
                            className='cursor-pointer w-full h-full py-1 hover:scale-110'
                            type='button'
                            onClick={() => {
                                setOpen(false)
                                exportResults("csv")
                            }}
                        >
                            CSV
                        </button>
                    </li>
                    <li className='w-full text-center'>
                        <button
                            className='cursor-pointer w-full h-full py-1 hover:scale-110'
                            type='button'
                            onClick={() => {
                                setOpen(false)
                                exportResults("pdf")
                            }}
                        >
                            PDF
                        </button>
                    </li>
                </ul>
            </div>
        </div>
    )
}

export default ExportResultButton
