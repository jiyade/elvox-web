import { useAuthStore } from "../stores"
import Button from "./Button"
import FilterMenu from "./FilterMenu"
import SortByTime from "./SortByTime"
import { useMediaQuery } from "react-responsive"

const AppealsHeader = ({
    setShowAppealForm,
    sort,
    setSort,
    category,
    setCategory,
    elections,
    electionId,
    setElectionId
}) => {
    const {
        user: { role }
    } = useAuthStore()

    const isMedium = useMediaQuery({ minWidth: 793 })

    return (
        <div className='flex items-center justify-between flex-1'>
            {role !== "admin" && (
                <>
                    <h2 className='text-sm sm:text-lg lg:text-xl font-semibold text-primary-light dark:text-primary-dark'>
                        My Appeals
                    </h2>
                    <Button
                        text='Submit Appeal'
                        className='px-2 py-2 sm:px-4 sm:py-2 md:px-6 md:py-3 text-sm font-medium bg-accent hover:bg-button-hover'
                        onClick={() => setShowAppealForm(true)}
                    />
                </>
            )}
            {role === "admin" && (
                <div className='flex gap-3 w-full'>
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
                            label={
                                category === "all" || !isMedium
                                    ? "Category"
                                    : ""
                            }
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
            )}
        </div>
    )
}

export default AppealsHeader
