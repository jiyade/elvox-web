import FilterMenu from "./FilterMenu"
import SortByTime from "./SortByTime"
import { useMediaQuery } from "react-responsive"

const AppealHeaderFilters = ({
    elections,
    electionId,
    setElectionId,
    category,
    setCategory,
    sort,
    setSort
}) => {
    const isMedium = useMediaQuery({ minWidth: 793 })

    return (
        <div className='flex gap-3 w-full max-sm:flex-col max-sm:py-8'>
            <div className={`flex relative flex-1 `}>
                <FilterMenu
                    options={elections}
                    filter={electionId}
                    setFilter={setElectionId}
                    label={isMedium ? "" : "Election"}
                    showSelected={isMedium}
                />
            </div>
            <div className={`flex relative flex-1 `}>
                <FilterMenu
                    filter={category}
                    setFilter={setCategory}
                    label={category === "all" || !isMedium ? "Category" : ""}
                    options={[
                        { value: "all", label: "All" },
                        {
                            value: "candidate_application",
                            label: "Candidate Application"
                        },
                        {
                            value: "election_result",
                            label: "Election Result"
                        },
                        {
                            value: "voting_issue",
                            label: "Voting Issue"
                        },
                        {
                            value: "account_access",
                            label: "Account / Access"
                        },
                        { value: "other", label: "Other" }
                    ]}
                    showSelected={isMedium}
                />
            </div>
            <div className={`flex relative flex-1`}>
                <SortByTime
                    sort={sort}
                    setSort={setSort}
                />
            </div>
        </div>
    )
}

export default AppealHeaderFilters
