import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { LuGripVertical } from "react-icons/lu"

const TieBreakerCandidateRow = ({ candidate, disabled }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: candidate.id, disabled })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`flex items-center justify-between px-4 py-3 border-b last:border-b-0 border-gray-500/50 
                ${isDragging ? "opacity-60" : ""}
      `}
        >
            <div className='flex items-center gap-3'>
                <span
                    {...attributes}
                    {...listeners}
                    className={`${isDragging ? "cursor-grabbing" : "cursor-grab"} ${
                        disabled ? "cursor-not-allowed opacity-40" : ""
                    } touch-none`}
                >
                    <LuGripVertical size={18} />
                </span>

                <span
                    className={`font-medium text-primary-light dark:text-primary-dark ${disabled ? "opacity-40" : ""}`}
                >
                    {candidate.name}
                </span>
            </div>
        </div>
    )
}

export default TieBreakerCandidateRow
