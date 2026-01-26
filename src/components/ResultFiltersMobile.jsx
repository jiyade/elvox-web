import FilterCandidatesByClass from "./FilterCandidatesByClass"
import FilterMenu from "./FilterMenu"

const ResultFiltersMobile = ({
    elections,
    electionId,
    setElectionId,
    year,
    setYear,
    classValue,
    setClassValue,
    status,
    setStatus
}) => {
    return (
        <div className='flex flex-col gap-4 py-8'>
            <FilterMenu
                options={elections}
                filter={electionId}
                setFilter={setElectionId}
                label='Election'
                showSelected={false}
            />
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
                label='Year'
                showSelected={false}
            />
            <FilterCandidatesByClass
                className={classValue}
                setClassName={setClassValue}
                showSelected={false}
            />
            <FilterMenu
                options={[
                    { value: "all", label: "All" },
                    { value: "won", label: "Won" },
                    { value: "lost", label: "Lost" },
                    { value: "tie", label: "Tie" }
                ]}
                filter={status}
                setFilter={setStatus}
                label='Status'
                showSelected={false}
            />
        </div>
    )
}

export default ResultFiltersMobile
