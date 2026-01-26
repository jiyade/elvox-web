import Button from "./Button"
import { useState } from "react"
import MobileFiltersContainer from "./MobileFiltersContainer"
import ResultFiltersMobile from "./ResultFiltersMobile"
import ResultsFiltersNonMobilecreen from "./ResultsFiltersNonMobilecreen"
import ElectionDetails from "./ElectionDetails"
import { HiChevronDown, HiChevronUp } from "react-icons/hi"

const ResultsHeader = ({
    electionId,
    setElectionId,
    elections,
    classValue,
    setClassValue,
    year,
    setYear,
    status,
    setStatus
}) => {
    const [electionOpen, setElectionOpen] = useState(false)
    const [yearOpen, setYearOpen] = useState(false)
    const [classOpen, setClassOpen] = useState(false)
    const [statusOpen, setStatusOpen] = useState(false)
    const [showMobileFilters, setShowMobileFilters] = useState(false)
    const [showElectionDetails, setShowElectionDetails] = useState(false)

    return (
        <div className='flex flex-col gap-4'>
            <div className='flex items-center justify-between gap-6 rounded-xl py-3'>
                <div className='flex flex-col flex-1 sm:hidden'>
                    <div className='flex items-center justify-between flex-1'>
                        <Button
                            text='Filters'
                            className='h-9 px-4 text-sm bg-secondary-button hover:bg-secondary-button-hover-light dark:hover:bg-secondary-button-hover'
                            type='button'
                            onClick={() => setShowMobileFilters(true)}
                        />
                        <Button
                            text='Export'
                            className='h-9 px-4 text-sm bg-accent hover:bg-button-hover'
                            type='button'
                            onClick={() => {}}
                        />
                    </div>
                    {showMobileFilters && (
                        <MobileFiltersContainer
                            showMobileFilters={showMobileFilters}
                            setShowMobileFilters={setShowMobileFilters}
                            modalId='Result Filters'
                        >
                            <ResultFiltersMobile
                                elections={elections}
                                electionId={electionId}
                                setElectionId={setElectionId}
                                year={year}
                                setYear={setYear}
                                classValue={classValue}
                                setClassValue={setClassValue}
                                status={status}
                                setStatus={setStatus}
                            />
                        </MobileFiltersContainer>
                    )}
                </div>

                <div className='flex items-center justify-between flex-1 gap-6 max-sm:hidden'>
                    <ResultsFiltersNonMobilecreen
                        electionOpen={electionOpen}
                        yearOpen={yearOpen}
                        classOpen={classOpen}
                        statusOpen={statusOpen}
                        elections={elections}
                        electionId={electionId}
                        setElectionId={setElectionId}
                        setElectionOpen={setElectionOpen}
                        year={year}
                        setYear={setYear}
                        setYearOpen={setYearOpen}
                        classValue={classValue}
                        setClassValue={setClassValue}
                        setClassOpen={setClassOpen}
                        status={status}
                        setStatus={setStatus}
                        setStatusOpen={setStatusOpen}
                    />
                    <Button
                        text='Export'
                        className='h-9 px-4 text-sm bg-accent hover:bg-button-hover'
                        type='button'
                        onClick={() => {}}
                    />
                </div>
            </div>
            <div className='flex flex-col justify-between gap-3'>
                <div className='flex items-center justify-between gap-3'>
                    <h2
                        className='text-base sm:text-lg lg:text-xl font-semibold text-primary-light dark:text-primary-dark cursor-pointer'
                        onClick={() =>
                            setShowElectionDetails((state) => !state)
                        }
                    >
                        {elections.find((el) => el.value === electionId)
                            ?.label || ""}
                    </h2>

                    <button
                        className='p-0 m-0 bg-transparent border-0 text-inherit font-inherit focus:outline-none cursor-pointer justify-self-end'
                        onClick={() =>
                            setShowElectionDetails((state) => !state)
                        }
                    >
                        {showElectionDetails ? (
                            <HiChevronUp className='size-7 text-primary-light dark:text-primary-dark transition-transform duration-300' />
                        ) : (
                            <HiChevronDown className='size-7 text-primary-light dark:text-primary-dark transition-transform duration-300' />
                        )}
                    </button>
                </div>
                {showElectionDetails && (
                    <ElectionDetails
                        pastElection={true}
                        electionId={electionId}
                    />
                )}
            </div>
        </div>
    )
}

export default ResultsHeader
