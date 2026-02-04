import capitalize from "../utils/capitalize"
import { useElectionStore } from "../stores"
import Button from "./Button"
import { IoImageOutline } from "react-icons/io5"

const ApproveApplicationExpanded = ({
    candidate,
    handleAction,
    setShowRejectionDialog
}) => {
    const { election } = useElectionStore()

    const rows = {
        "Candidate Information": [
            { "Admission Number": candidate?.admno },
            { Category: capitalize(candidate?.category) },
            { Election: election?.name }
        ],
        "Nominee 1 Information": [
            { "Admission Number": candidate?.nominee1_admno },
            { Name: candidate?.nominee1_name }
        ],
        "Nominee 2 Information": [
            { "Admission Number": candidate?.nominee2_admno },
            { Name: candidate?.nominee2_name }
        ]
    }

    const attachments = [
        ["Candidate Signature", candidate?.signature],
        ["Nominee 1 Proof", candidate?.nominee1_proof],
        ["Nominee 2 Proof", candidate?.nominee2_proof]
    ]
    return (
        <div className='flex overflow-hidden border-t border-gray-500'>
            <div className='flex flex-col gap-4 flex-1 p-4'>
                {Object.entries(rows).map(([heading, items]) => (
                    <div
                        className='grid grid-cols-1 gap-3'
                        key={heading}
                    >
                        <div className='flex justify-between items-center'>
                            <p className='font-semibold text-sm'>{heading}</p>
                        </div>

                        {items.map((obj, i) => {
                            const [[label, value]] = Object.entries(obj)

                            return (
                                <div
                                    key={label ?? i}
                                    className='grid grid-cols-2 gap-1'
                                >
                                    <p className='text-xs text-secondary-light dark:text-secondary-dark'>
                                        {label}
                                    </p>
                                    <p className='text-sm text-primary-light dark:text-primary-dark break-words'>
                                        {value}
                                    </p>
                                </div>
                            )
                        })}
                    </div>
                ))}
                <div className='flex flex-col gap-1'>
                    <p className='font-semibold col-span-2 mb-2'>Attachments</p>
                    <div className='flex flex-col gap-2'>
                        {attachments.map(([label, value]) => (
                            <div
                                key={label}
                                className='flex justify-between items-center gap-1 border-b border-gray-500 last:border-none pb-2'
                            >
                                <div className='flex items-center gap-2'>
                                    <IoImageOutline />

                                    <p className='text-sm text-primary-light dark:text-primary-dark text-left'>
                                        {label}
                                    </p>
                                </div>
                                <Button className='text-sm text-primary-light dark:text-primary-dark border-secondary-light dark:border-secondary-dark border-2 py-1 px-2 hover:bg-secondary-button-hover-light dark:hover:bg-secondary-button-hover-dark'>
                                    <a
                                        href={value}
                                        target='_blank'
                                        rel='noopener noreferrer'
                                    >
                                        View
                                    </a>
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
                {candidate.status === "pending" && (
                    <div className='flex justify-center gap-3 w-full'>
                        <Button
                            text='Reject'
                            className='w-1/2 h-9 text-sm bg-red-700 hover:bg-red-800'
                            type='button'
                            onClick={() =>
                                setShowRejectionDialog({
                                    show: true,
                                    id: candidate?.id
                                })
                            }
                        />
                        <Button
                            text='Approve'
                            className='w-1/2 h-9 text-sm bg-accent hover:bg-button-hover'
                            type='button'
                            onClick={() =>
                                handleAction("approved", candidate.id)
                            }
                        />
                    </div>
                )}
            </div>
        </div>
    )
}

export default ApproveApplicationExpanded
