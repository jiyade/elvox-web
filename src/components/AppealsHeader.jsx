import { useState } from "react"
import { useAuthStore } from "../stores"
import AppealHeaderFilters from "./AppealHeaderFilters"
import MobileFiltersContainer from "./MobileFiltersContainer"
import Button from "./Button"

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
    const [showMobileFilters, setShowMobileFilters] = useState(false)

    const {
        user: { role }
    } = useAuthStore()

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
                <>
                    <div className='flex flex-1 max-sm:hidden'>
                        <AppealHeaderFilters
                            elections={elections}
                            electionId={electionId}
                            setElectionId={setElectionId}
                            category={category}
                            setCategory={setCategory}
                            sort={sort}
                            setSort={setSort}
                        />
                    </div>
                    <div className='flex items-center w-full sm:hidden'>
                        <Button
                            text='Filters'
                            className='h-9 px-4 text-sm bg-secondary-button-light dark:bg-secondary-button-dark hover:bg-secondary-button-hover-light dark:hover:bg-secondary-button-hover-dark'
                            type='button'
                            onClick={() => setShowMobileFilters(true)}
                        />
                    </div>

                    {showMobileFilters && (
                        <MobileFiltersContainer
                            showMobileFilters={showMobileFilters}
                            setShowMobileFilters={setShowMobileFilters}
                            modalId='Appeal Filters'
                        >
                            <AppealHeaderFilters
                                elections={elections}
                                electionId={electionId}
                                setElectionId={setElectionId}
                                category={category}
                                setCategory={setCategory}
                                sort={sort}
                                setSort={setSort}
                            />
                        </MobileFiltersContainer>
                    )}
                </>
            )}
        </div>
    )
}

export default AppealsHeader
