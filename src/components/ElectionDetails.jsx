import { LuActivity } from "react-icons/lu"
import { useElectionStore } from "../stores"
import Countdown from "./Countdown"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import api from "../api/api"
import DateAndTimeDisplay from "./DateAndTimeDisplay"

const ElectionDetails = ({ electionId, pastElection = false }) => {
    const [isLoading, setIsLoading] = useState(pastElection)
    const [electionDetails, setElectionDetails] = useState({})

    const activeElection = useElectionStore((state) => state.election)

    const election = pastElection ? electionDetails : activeElection

    const hasElection = Boolean(election?.id)

    const electionStatus = {
        draft: "Coming Soon",
        nominations: "Nominations Open",
        "pre-voting": "Voting Preparation",
        voting: "Voting Live",
        "post-voting": election?.result_published
            ? "Results Published"
            : "Voting Finished",
        closed: "Election Concluded"
    }

    useEffect(() => {
        if (!pastElection) return

        if (electionId === activeElection?.id) {
            setElectionDetails(activeElection)
            setIsLoading(false)
            return
        }

        if (electionDetails?.id === electionId) return

        let cancelled = false

        const fetchElectionDetails = async (id) => {
            try {
                setIsLoading(true)

                const res = await api.get(`/elections/${id}`)
                if (!cancelled) {
                    setElectionDetails(res.data)
                }
            } catch (err) {
                if (!cancelled) {
                    toast.error(err.response?.data?.error, {
                        id: "election-fetchs-error"
                    })
                }
            } finally {
                if (!cancelled) {
                    setIsLoading(false)
                }
            }
        }

        fetchElectionDetails(electionId)

        return () => {
            cancelled = true
        }
    }, [electionId, pastElection, activeElection, electionDetails])

    return (
        <div className='flex flex-col w-full gap-2 px-4 py-4 rounded-md dark:bg-card-dark bg-card-light shadow-lg transition-all duration-100'>
            {isLoading && !hasElection && (
                <div className='flex items-center justify-center py-10'>
                    <div className='w-5 h-5 border border-b-transparent dark:border-b-transparent border-accent dark:border-[#ab8cff] rounded-full inline-block loader' />
                </div>
            )}
            {!isLoading && hasElection && (
                <>
                    <div className='flex items-center justify-between gap-2'>
                        <h2 className='text-lg font-bold text-left text-primary-light dark:text-primary-dark'>
                            {election?.name}
                        </h2>
                        {election?.status !== "closed" && (
                            <Countdown className='max-sm:hidden' />
                        )}
                    </div>
                    <p className='flex items-center gap-1 text-secondary-light dark:text-secondary-dark'>
                        <LuActivity className='text-secondary-light dark:text-secondary-dark' />
                        <span>
                            Status:{" "}
                            <span className='text-accent'>
                                {electionStatus[election.status]}
                            </span>
                        </span>
                    </p>
                    {election?.status !== "closed" && (
                        <Countdown className='sm:hidden' />
                    )}
                    <div className='grid grid-cols-2 md:grid-cols-3 gap-5 md:gap-x-10 py-3 text-primary-light dark:text-primary-dark'>
                        <div className='flex flex-col gap-2'>
                            <p>Election Start</p>
                            <DateAndTimeDisplay
                                timestamp={election?.election_start}
                            />
                        </div>
                        <div className='flex flex-col gap-2'>
                            <p>Nomination Start</p>
                            <DateAndTimeDisplay
                                timestamp={election?.nomination_start}
                            />
                        </div>
                        <div className='flex flex-col gap-2'>
                            <p>Nomination End</p>
                            <DateAndTimeDisplay
                                timestamp={election?.nomination_end}
                            />
                        </div>
                        <div className='flex flex-col gap-2'>
                            <p>Voting Start</p>
                            <DateAndTimeDisplay
                                timestamp={election?.voting_start}
                            />
                        </div>
                        <div className='flex flex-col gap-2'>
                            <p>Voting End</p>
                            <DateAndTimeDisplay
                                timestamp={election?.voting_end}
                            />
                        </div>
                        <div className='flex flex-col gap-2'>
                            <p>Election End</p>
                            <DateAndTimeDisplay
                                timestamp={election?.election_end}
                            />
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}

export default ElectionDetails
