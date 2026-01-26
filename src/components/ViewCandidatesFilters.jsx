import { useMediaQuery } from "react-responsive"
import { useAuthStore } from "../stores"
import FilterMenu from "./FilterMenu"
import FilterCandidatesByClass from "./FilterCandidatesByClass"
import SortCandidates from "./SortCandidates"

const ViewCandidatesFilters = ({
    year,
    setYear,
    className,
    setClassName,
    category,
    setCategory,
    status,
    setStatus,
    sort,
    setSort
}) => {
    const {
        user: { role }
    } = useAuthStore()

    const isLgScreen = useMediaQuery({ minWidth: 1024 })

    return (
        <div className='flex max-sm:flex-col sm:flex-1 max-sm:py-8 gap-4 sm:gap-3 w-full'>
            <div className={`flex flex-col w-full relative flex-1`}>
                <FilterMenu
                    options={[
                        { value: "all", label: "All" },
                        { value: "first", label: "First Year" },
                        { value: "second", label: "Second Year" },
                        { value: "third", label: "Third Year" },
                        { value: "fourth", label: "Fourth Year" }
                    ]}
                    filter={year}
                    setFilter={setYear}
                    label={year === "all" || !isLgScreen ? "Year" : ""}
                    showSelected={isLgScreen}
                />
            </div>
            <div className={`flex flex-col w-full relative flex-1`}>
                <FilterCandidatesByClass
                    className={className}
                    setClassName={setClassName}
                    showSelected={isLgScreen}
                    showLabel={className === "all" || !isLgScreen}
                />
            </div>
            <div className={`flex flex-col w-full relative flex-1`}>
                <FilterMenu
                    options={[
                        { value: "all", label: "All" },
                        { value: "general", label: "General" },
                        { value: "reserved", label: "Reserved" }
                    ]}
                    filter={category}
                    setFilter={setCategory}
                    label={category === "all" || !isLgScreen ? "Category" : ""}
                    showSelected={isLgScreen}
                />
            </div>
            {role === "admin" && (
                <div className={`flex flex-col w-full relative flex-1`}>
                    <FilterMenu
                        options={[
                            { value: "all", label: "All" },
                            { value: "approved", label: "Approved" },
                            { value: "rejected", label: "Rejected" },
                            { value: "pending", label: "Pending" },
                            { value: "withdrawn", label: "Withdrawn" }
                        ]}
                        filter={status}
                        setFilter={setStatus}
                        label={status === "all" || !isLgScreen ? "Status" : ""}
                        showSelected={isLgScreen}
                    />
                </div>
            )}
            <div className='flex flex-col w-full relative flex-1 sm:hidden'>
                <SortCandidates
                    sort={sort}
                    setSort={setSort}
                />
            </div>
        </div>
    )
}

export default ViewCandidatesFilters
