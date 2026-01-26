import { IoSearch } from "react-icons/io5"
import SortCandidates from "./SortCandidates"
import MobileFiltersContainer from "./MobileFiltersContainer"
import ViewCandidatesFilters from "./ViewCandidatesFilters"
import { useState } from "react"
import Button from "./Button"

const ViewCandidatesHeader = ({
    nameInput,
    setNameInput,
    sort,
    setSort,
    className, // not jsx className, but name of the class
    setClassName,
    year,
    setYear,
    status,
    setStatus,
    category,
    setCategory
}) => {
    const [showMobileFilters, setShowMobileFilters] = useState(false)

    return (
        <div className='flex flex-col w-full gap-3'>
            <div className='flex gap-3'>
                <div className='w-full flex-3 relative sm:flex-4 md:flex-5 lg:flex-7'>
                    <span className='flex justify-center items-center text-secondary-light dark:text-secondary-dark p-2 inset-y-0 absolute'>
                        <IoSearch />
                    </span>
                    <input
                        type='text'
                        id='candidate-name'
                        className='outline-none border-none bg-field-light dark:bg-field-dark rounded-md w-full h-9 pl-8 p-3 text-primary-light dark:text-primary-dark placeholder:text-secondary-light dark:placeholder:text-secondary-dark active:bg-field-light dark:active:bg-field-dark appearance-none'
                        placeholder='Enter candidate name'
                        onChange={(e) => setNameInput(e.target.value)}
                        value={nameInput}
                    />
                </div>
                <div className='flex flex-col w-full flex-1 h-9 relative max-sm:hidden'>
                    <SortCandidates
                        sort={sort}
                        setSort={setSort}
                    />
                </div>
                <div className='flex items-center sm:hidden'>
                    <Button
                        text='Filters'
                        className='h-9 px-4 text-sm bg-secondary-button hover:bg-secondary-button-hover-light dark:hover:bg-secondary-button-hover'
                        type='button'
                        onClick={() => setShowMobileFilters(true)}
                    />
                </div>
            </div>
            <div className='flex items-center justify-between flex-1 gap-6 max-sm:hidden'>
                <ViewCandidatesFilters
                    year={year}
                    setYear={setYear}
                    className={className}
                    setClassName={setClassName}
                    category={category}
                    setCategory={setCategory}
                    status={status}
                    setStatus={setStatus}
                />
            </div>
            {showMobileFilters && (
                <MobileFiltersContainer
                    showMobileFilters={showMobileFilters}
                    setShowMobileFilters={setShowMobileFilters}
                    modalId='Candidate Filters'
                >
                    <ViewCandidatesFilters
                        year={year}
                        setYear={setYear}
                        className={className}
                        setClassName={setClassName}
                        category={category}
                        setCategory={setCategory}
                        status={status}
                        setStatus={setStatus}
                        sort={sort}
                        setSort={setSort}
                    />
                </MobileFiltersContainer>
            )}
        </div>
    )
}

export default ViewCandidatesHeader
