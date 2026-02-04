import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import TieBreakerCandidateRow from "./TieBreakerCandidateRow"

const TiedCandidatesContainer = ({ items, disabled }) => {
    const ids = items?.map((c) => c.id)
    return (
        <SortableContext
            items={ids}
            strategy={verticalListSortingStrategy}
        >
            <div className='flex flex-col flex-1 border border-gray-500/50 rounded-md overflow-hidden'>
                {items.map((candidate) => (
                    <TieBreakerCandidateRow
                        key={candidate.id}
                        candidate={candidate}
                        disabled={disabled}
                    />
                ))}
            </div>
        </SortableContext>
    )
}

export default TiedCandidatesContainer
