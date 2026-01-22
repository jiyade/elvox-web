import FilterCandidatesByClass from "./FilterCandidatesByClass"
import FilterMenu from "./FilterMenu"

const ResultsFiltersNonMobilecreen = ({
    electionOpen,
    yearOpen,
    classOpen,
    statusOpen,
    elections,
    electionId,
    setElectionId,
    setElectionOpen,
    year,
    setYear,
    setYearOpen,
    classValue,
    setClassValue,
    setClassOpen,
    status,
    setStatus,
    setStatusOpen
}) => {
    return (
        <div
            className={`flex items-center gap-3 transition-all duration-200 ease-out ${
                electionOpen || yearOpen || classOpen || statusOpen
                    ? "sm:w-lg md:w-xl"
                    : "w-md"
            }`}
        >
            <div
                className={`flex relative transition-all duration-200 ease-out ${
                    electionOpen ? "flex-2" : "flex-[0.6]"
                }`}
            >
                <FilterMenu
                    options={elections}
                    filter={electionId}
                    setFilter={setElectionId}
                    label='Election'
                    showSelected={false}
                    onOpenChange={setElectionOpen}
                />
            </div>
            <div
                className={`flex relative transition-all duration-200 ease-out ${
                    yearOpen ? "flex-1" : "flex-[0.6]"
                }`}
            >
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
                    onOpenChange={setYearOpen}
                />
            </div>
            <div
                className={`flex relative transition-all duration-200 ease-out ${
                    classOpen ? "flex-2" : "flex-[0.6]"
                }`}
            >
                <FilterCandidatesByClass
                    className={classValue}
                    setClassName={setClassValue}
                    showSelected={false}
                    onOpenChange={setClassOpen}
                />
            </div>
            <div
                className={`flex relative transition-all duration-200 ease-out ${
                    statusOpen ? "flex-1" : "flex-[0.6]"
                }`}
            >
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
                    onOpenChange={setStatusOpen}
                />
            </div>
        </div>
    )
}

export default ResultsFiltersNonMobilecreen
