import VoteProgressBar from "./VoteProgressBar"

const statusStyles = {
    TIE: "bg-yellow-400/40 dark:bg-yellow-400/20 text-yellow-600 dark:text-yellow-400 ring-1 ring-yellow-400/30 inline-block px-3 py-1 rounded-xl text-xs font-medium",
    WON: "bg-green-400/30 dark:bg-green-400/20 text-green-500 dark:text-green-400 ring-1 ring-green-400/30 inline-block px-3 py-1 rounded-xl text-xs font-medium",
    LOST: "bg-red-400/40 dark:bg-red-400/20 text-red-600 dark:text-red-400 ring-1 ring-red-400/30 inline-block px-3 py-1 rounded-xl text-xs font-medium"
}

const ResultsListItem = ({ result, category }) => {
    const hasTiedCandidates = result?.candidates?.some(
        (candidate) => candidate?.status === "TIE"
    )

    return (
        <div className='flex flex-col gap-3 dark:bg-[#16171d] bg-bg-light text-primary-light dark:text-primary-dark px-3 py-2'>
            <div className='flex items-center justify-between gap-3 py-2 border-b border-gray-500'>
                <p className='flex sm:items-center sm:gap-1 max-sm:flex-col max-sm:gap-0.5'>
                    <span>{category}</span>
                    {hasTiedCandidates && <span>(Tie breaker needed)</span>}
                </p>
                <p className='flex sm:items-center sm:gap-1 max-sm:flex-col max-sm:gap-0.5'>
                    <span>
                        Total votes<span className='max-sm:hidden'>:</span>
                    </span>
                    <span>{result?.totalVotes}</span>
                </p>
            </div>
            <div className='flex flex-col gap-2'>
                {result?.candidates
                    .toSorted((a, b) => a.rank - b.rank)
                    .map((candidate) => (
                        <div
                            key={candidate?.id}
                            className='grid grid-cols-[6fr_1fr] max-sm:gap-y-7 sm:grid-cols-[1fr_1.5fr_1fr_0.5fr] sm:gap-x-8 py-2 items-center'
                        >
                            <p>{candidate?.name}</p>
                            <VoteProgressBar
                                totalVotes={result?.totalVotes}
                                votes={candidate?.votes}
                                className='max-sm:hidden'
                            />
                            {parseInt(candidate.lead) !== 0 &&
                                !candidate.hadTie && (
                                    <p className='text-center max-sm:hidden'>
                                        {candidate.lead.startsWith("-")
                                            ? `Lost by ${candidate.lead.slice(1)}`
                                            : `Won by ${candidate.lead}`}
                                    </p>
                                )}
                            {candidate.hadTie &&
                                candidate?.status !== "TIE" && (
                                    <p className='text-center max-sm:hidden'>
                                        {candidate?.status === "WON"
                                            ? `Won by Tie-breaker`
                                            : `Lost by Tie-breaker`}
                                    </p>
                                )}
                            {((parseInt(candidate.lead) === 0 &&
                                !candidate.hadTie) ||
                                (candidate.hadTie &&
                                    candidate.status === "TIE")) && (
                                <div className='max-sm:hidden' /> // keeps grid alignment
                            )}

                            <p
                                className={`text-center ${
                                    statusStyles[candidate.status]
                                }`}
                            >
                                {candidate?.status}
                            </p>
                            <VoteProgressBar
                                totalVotes={result?.totalVotes}
                                votes={candidate?.votes}
                                className='sm:hidden col-span-2'
                            >
                                {parseInt(candidate.lead) !== 0 &&
                                    !candidate.hadTie && (
                                        <p className='absolute bottom-full right-0 pb-1 text-xs text-secondary-light dark:text-secondary-dark'>
                                            {candidate.lead.startsWith("-")
                                                ? `Lost by ${candidate.lead.slice(
                                                      1
                                                  )}`
                                                : `Won by ${candidate.lead}`}
                                        </p>
                                    )}
                                {candidate.hadTie &&
                                    candidate?.status !== "TIE" && (
                                        <p className='absolute bottom-full right-0 pb-1 text-xs text-secondary-light dark:text-secondary-dark'>
                                            {candidate?.status === "WON"
                                                ? `Won by Tie-breaker`
                                                : `Lost by Tie-breaker`}
                                        </p>
                                    )}
                            </VoteProgressBar>
                        </div>
                    ))}
            </div>
        </div>
    )
}

export default ResultsListItem
