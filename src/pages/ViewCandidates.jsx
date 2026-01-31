import { useEffect, useMemo, useState } from "react"
import ViewCandidatesHeader from "../components/ViewCandidatesHeader"
import Candidate from "../components/Candidate"
import { toast } from "react-hot-toast"
import { useOutletContext } from "react-router-dom"
import api from "../api/api"
import { useAuthStore } from "../stores"

const ViewCandidates = () => {
    const [candidates, setCandidates] = useState([])
    const [nameInput, setNameInput] = useState("")
    const [sort, setSort] = useState("name")
    const [year, setYear] = useState("all")
    const [className, setClassName] = useState("all")
    const [status, setStatus] = useState("all")
    const [category, setCategory] = useState("all")

    const { isLoading, setIsLoading } = useOutletContext()

    const { user } = useAuthStore()

    const visibleCandidates = useMemo(() => {
        let list = [...candidates]

        // search
        if (nameInput.trim() !== "") {
            const lower = nameInput.toLowerCase()
            list = list.filter((l) => l.name.toLowerCase().includes(lower))
        }

        // sort
        if (sort === "name") {
            list.sort((a, b) => a.name.localeCompare(b.name))
        } else if (sort === "latest") {
            list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        }

        // filter by class
        if (className !== "all") {
            list = list.filter((l) => l.class.toLowerCase() === className)
        }

        // filter by year
        if (year !== "all") {
            const map = {
                first: [1, 2],
                second: [3, 4],
                third: [5, 6],
                fourth: [7, 8]
            }

            const sem = map[year]

            list = list.filter((l) => sem.includes(l.semester))
        }

        // filter by category
        if (category !== "all") {
            list = list.filter((l) => l.category.toLowerCase() === category)
        }

        return list
    }, [candidates, className, year, sort, nameInput, category])

    useEffect(() => {
        const fetchCandidates = async () => {
            try {
                setIsLoading(true)
                const res = await api.get(
                    `/candidates?status=${
                        user?.role === "admin" ? status : "approved"
                    }`
                )
                if (res.status === 200) setCandidates(res.data)
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
    }, [setIsLoading, status, user?.role])

    if (isLoading) return null

    return (
        <div className='flex flex-col items-center px-2 md:px-5 lg:px-9 py-5 flex-1 min-h-0'>
            <title>Candidates</title>
            <div className='flex flex-col flex-1 w-full gap-8 max-w-6xl min-h-0'>
                <ViewCandidatesHeader
                    nameInput={nameInput}
                    setNameInput={setNameInput}
                    sort={sort}
                    setSort={setSort}
                    year={year}
                    setYear={setYear}
                    className={className}
                    setClassName={setClassName}
                    status={status}
                    setStatus={setStatus}
                    category={category}
                    setCategory={setCategory}
                />
                {visibleCandidates.length > 0 && (
                    <div className='flex flex-col flex-[1_1_0px] gap-3 overflow-y-auto custom-scrollbar rounded-md bg-card-light dark:bg-card-dark px-2 py-4'>
                        {visibleCandidates.map((candidate) => (
                            <Candidate
                                candidate={candidate}
                                key={candidate.id}
                            />
                        ))}
                    </div>
                )}
            </div>

            {!visibleCandidates.length && (
                <div className='flex px-3 py-4 gap-8 flex-1 justify-center'>
                    <h2 className='text-center text-primary-light dark:text-primary-dark text-2xl md:text-3xl lg:text-4xl font-black'>
                        No Candidate Applications To Show
                    </h2>
                </div>
            )}
        </div>
    )
}

export default ViewCandidates
