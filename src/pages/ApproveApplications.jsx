import { useEffect, useState } from "react"
import { useOutletContext } from "react-router-dom"
import toast from "react-hot-toast"
import api from "../api/api"
import ApproveApplicationCollapsed from "../components/ApproveApplicationCollapsed"
import ApproveApplicationExpanded from "../components/ApproveApplicationExpanded"
import ApproveApplicationRejectionDialog from "../components/ApproveApplicationRejectionDialog"
import { useElectionStore } from "../stores"

const ApproveApplications = () => {
    const [candidates, setCandidates] = useState([])
    const [expanded, setExpanded] = useState(null)
    const [showRejectionDialog, setShowRejectionDialog] = useState({
        show: false,
        id: null
    })
    const [rejectionNote, setRejectionNote] = useState("")
    const [error, setError] = useState("")

    const { isLoading, setIsLoading } = useOutletContext()

    const { election } = useElectionStore()

    const handleAction = async (action, id) => {
        if (action === "rejected" && rejectionNote.length === 0) {
            setError("Please add your reason before rejecting this application")
            return
        }
        setError("")

        try {
            setIsLoading(true)
            await api.patch(`/candidates/${id}/status`, {
                status: action,
                rejectionReason: rejectionNote.trim(),
                electionId: election?.id
            })
            toast.success(`Application was successfully ${action}`, {
                id: "application-action-success"
            })
            setCandidates((candidates) => {
                return candidates.filter((candidate) => candidate.id !== id)
            })
        } catch (err) {
            toast.error(
                err.response?.data?.error ||
                    `Failed to ${
                        action === "approved" ? "approve" : "reject"
                    } application, please try again`,
                { id: "application-action-error" }
            )
        } finally {
            setIsLoading(false)
            setShowRejectionDialog({ show: false, id: null })
        }
    }

    useEffect(() => {
        const fetchCandidates = async () => {
            try {
                setIsLoading(true)
                const res = await api.get("/candidates?status=pending")
                setCandidates(res.data)
            } catch (err) {
                toast.error(
                    err.response?.data?.error ||
                        "Could not fetch candidates. Please try again",
                    { id: "candidates-fetch-error" }
                )
            } finally {
                setIsLoading(false)
            }
        }

        fetchCandidates()
    }, [setIsLoading])

    if (isLoading) return null

    return (
        <div className='flex flex-col items-center px-2 md:px-5 lg:px-9 py-5 flex-1 min-h-0'>
            <title>Approve Applications</title>
            {candidates?.length > 0 && (
                <div className='flex flex-col flex-1 w-full gap-8 max-w-6xl min-h-0'>
                    <div className='flex flex-col flex-[1_1_0px] gap-3 overflow-y-auto custom-scrollbar rounded-md bg-card-light dark:bg-card-dark px-2 py-4'>
                        {candidates.map((candidate, i) => (
                            <div
                                key={candidate.id}
                                className={`gird items-center justify-between gap-3 dark:bg-[#16171d] bg-bg-light text-primary-light dark:text-primary-dark rounded-md px-3 py-2 ${
                                    expanded === i
                                        ? "grid-rows-1"
                                        : "grid-rows-[0]"
                                }`}
                            >
                                <div className='flex items-center justify-between gap-3 px-3 py-2'>
                                    <ApproveApplicationCollapsed
                                        candidate={candidate}
                                        expanded={expanded}
                                        index={i}
                                        expand={() => {
                                            setExpanded((state) =>
                                                state === i ? null : i
                                            )
                                        }}
                                    />
                                </div>
                                <div
                                    className={`grid transition-all duration-300 ease-in-out ${
                                        expanded === i
                                            ? "grid-rows-[1fr] opacity-100"
                                            : "grid-rows-[0fr] opacity-0"
                                    }`}
                                >
                                    <ApproveApplicationExpanded
                                        candidate={candidate}
                                        handleAction={handleAction}
                                        setShowRejectionDialog={
                                            setShowRejectionDialog
                                        }
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {!candidates.length && (
                <div className='flex px-3 py-4 gap-8 flex-1 items-center justify-center'>
                    <h2 className='text-center text-primary-light dark:text-primary-dark text-2xl md:text-3xl lg:text-4xl font-black'>
                        No Pending Candidate Applications To Show For Your Class
                    </h2>
                </div>
            )}
            {showRejectionDialog.show && (
                <ApproveApplicationRejectionDialog
                    isOpen={showRejectionDialog}
                    setIsOpen={setShowRejectionDialog}
                    rejectionNote={rejectionNote}
                    setRejectionNote={setRejectionNote}
                    handleAction={handleAction}
                    error={error}
                />
            )}
        </div>
    )
}

export default ApproveApplications
