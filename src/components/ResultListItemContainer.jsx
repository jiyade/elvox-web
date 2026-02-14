import ResultsListItem from "./ResultsListItem"

const years = {
    1: "First",
    2: "Second",
    3: "Third",
    4: "Fourth"
}

const ResultListItemContainer = ({ result }) => {
    return (
        <div className='flex flex-col dark:bg-[#16171d] bg-bg-light text-primary-light dark:text-primary-dark rounded-md px-3 py-2'>
            <div className='flex items-center py-2'>
                <p className='flex items-center gap-1 text-[15px]'>
                    <span>{result?.class}</span>
                    <span className='text-[13px]'>
                        ({years[result?.year]} year)
                    </span>
                </p>
            </div>
            <div className='flex flex-col flex-1 gap-2 divide-y divide-gray-500'>
                <ResultsListItem
                    result={result?.results?.general}
                    category='General'
                />
                {result?.results?.reserved && (
                    <ResultsListItem
                        result={result.results.reserved}
                        category='Reserved'
                    />
                )}
            </div>
        </div>
    )
}

export default ResultListItemContainer
