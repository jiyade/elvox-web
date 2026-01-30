import ResultListItemContainer from "./ResultListItemContainer"

const ResultsList = ({ results }) => {
    return (
        <div className='flex flex-col flex-[1_1_0px] overflow-y-auto custom-scrollbar min-h-0 gap-3 bg-card-light dark:bg-card-dark rounded-md px-2 py-4'>
            {results.map((result) => (
                <ResultListItemContainer
                    key={result.classId}
                    result={result}
                />
            ))}
        </div>
    )
}

export default ResultsList
