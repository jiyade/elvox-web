import { useEffect, useMemo, useState } from "react"
import NoAppealsSubmitted from "../components/NoAppealsSubmitted"
import SubmitAppealFormModal from "../components/SubmitAppealFormModal"
import CancelConfirm from "../components/CancelConfirm"
import api from "../api/api"
import toast from "react-hot-toast"
import AppealsList from "../components/AppealsList"
import AppealsHeader from "../components/AppealsHeader"
import { useAuthStore, useElectionStore } from "../stores"
import FullScreenLoader from "../components/FullScreenLoader"

const Appeals = () => {
    const [appeals, setAppeals] = useState([])
    const [electionId, setElectionId] = useState("")
    const [elections, setElections] = useState([])
    const [showAppealForm, setShowAppealForm] = useState(false)
    const [isCancelConfirmOpen, setIsCancelConfirmOpen] = useState(false)
    const [sort, setSort] = useState("latest")
    const [category, setCategory] = useState("all")

    const [electionsLoading, setElectionsLoading] = useState(false)
    const [appealsLoading, setAppealsLoading] = useState(false)

    const isLoading = electionsLoading || appealsLoading

    const { election } = useElectionStore()
    const {
        user: { role }
    } = useAuthStore()

    useEffect(() => {
        const fetchElections = async () => {
            try {
                setAppealsLoading(true)
                const res = await api.get("/elections/all")
                const electionsData = res.data

                setElections(electionsData)

                setElectionId(election?.id ?? electionsData[0]?.id)
            } catch (err) {
                if (err.response)
                    toast.error(err.response?.data?.error, {
                        id: "elections-fetch-error"
                    })
            } finally {
                setAppealsLoading(false)
            }
        }

        if (role === "admin") fetchElections()
        else setElectionId(election?.id)
    }, [role, election?.id])

    useEffect(() => {
        const fetchAppeals = async () => {
            try {
                setElectionsLoading(true)
                if (
                    (role === "admin" && electionId) ||
                    (role !== "admin" && election?.id)
                ) {
                    const res = await api.get(
                        `/appeals?election=${
                            role === "admin" ? electionId : election?.id
                        }`
                    )
                    setAppeals(res.data)
                }
            } catch (err) {
                toast.error(
                    err.response?.data?.error ||
                        "Could not fetch appeals. Please try again",
                    { id: "appeals-fetch-error" }
                )
            } finally {
                setElectionsLoading(false)
            }
        }

        fetchAppeals()
    }, [electionId, election?.id, role])

    const visibleAppeals = useMemo(() => {
        let list = [...appeals]

        // sort
        if (sort === "oldest") {
            list.sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
        } else if (sort === "latest") {
            list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        }

        // filter by category
        if (category !== "all") {
            list = list.filter((l) => l.category.toLowerCase() === category)
        }

        return list
    }, [appeals, category, sort])

    return (
        <div className='flex flex-col items-center px-2 md:px-5 lg:px-9 py-5 flex-1'>
            <title>Appeals</title>
            {!isLoading &&
                (role !== "admin" ? appeals.length > 0 : electionId) && (
                    <div className='flex flex-col w-full gap-5 max-w-6xl py-2'>
                        <AppealsHeader
                            setShowAppealForm={setShowAppealForm}
                            sort={sort}
                            setSort={setSort}
                            setCategory={setCategory}
                            category={category}
                            electionId={electionId}
                            setElectionId={setElectionId}
                            elections={elections.map((el) => {
                                return { value: el.id, label: el.name }
                            })}
                        />
                        {visibleAppeals.length > 0 && (
                            <AppealsList appeals={visibleAppeals} />
                        )}
                    </div>
                )}

            {visibleAppeals.length === 0 && !isLoading && (
                <>
                    {role === "admin" ? (
                        <div className='flex px-3 py-4 flex-1 items-center justify-center'>
                            <h2 className='text-center text-primary-light dark:text-primary-dark text-2xl md:text-3xl lg:text-4xl font-black'>
                                {elections.length === 0
                                    ? "No elections found"
                                    : "No Appeals To Show"}
                            </h2>
                        </div>
                    ) : (
                        <NoAppealsSubmitted
                            setShowAppealForm={setShowAppealForm}
                        />
                    )}
                </>
            )}

            {showAppealForm && (
                <SubmitAppealFormModal
                    isOpen={showAppealForm}
                    setIsCancelConfirmOpen={setIsCancelConfirmOpen}
                    setShowAppealForm={setShowAppealForm}
                    setAppeals={setAppeals}
                />
            )}

            {isCancelConfirmOpen && (
                <CancelConfirm
                    isOpen={isCancelConfirmOpen}
                    setIsOpen={setIsCancelConfirmOpen}
                    setIsFormOpen={setShowAppealForm}
                />
            )}

            {isLoading && (
                <div className='flex justify-between items-center'>
                    <FullScreenLoader />
                </div>
            )}
        </div>
    )
}

export default Appeals
