import { useState } from "react"
import { DndContext } from "@dnd-kit/core"
import { arrayMove } from "@dnd-kit/sortable"
import {
    useAuthStore,
    useElectionStore,
    useTiedCandidatesStore
} from "../stores"
import capitalize from "../utils/capitalize"
import FullScreenLoader from "../components/FullScreenLoader"
import Button from "../components/Button"
import Checkbox from "../components/Checkbox"
import TiedCandidatesContainer from "../components/TiedCandidatesContainer"
import toast from "react-hot-toast"
import api from "../api/api"
import { useNavigate } from "react-router-dom"
import TieBreakerConfirm from "../components/TieBreakerConfirm"

const TieBreaker = () => {
    const [checked, setChecked] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const { tiedCandidatesData, setTiedCandidatesData } =
        useTiedCandidatesStore()

    const currentCategory = tiedCandidatesData?.categories[0]

    const [items, setItems] = useState(currentCategory?.candidates ?? [])

    const { election } = useElectionStore()
    const {
        user: { tutor_of }
    } = useAuthStore()

    const navigate = useNavigate()

    const handleDragEnd = (event) => {
        const { active, over } = event
        if (!over || active.id === over.id) return

        setItems((items) => {
            const oldIndex = items.findIndex((i) => i.id === active.id)
            const newIndex = items.findIndex((i) => i.id === over.id)
            return arrayMove(items, oldIndex, newIndex)
        })
    }

    const submitTieBreaker = async () => {
        if (!election?.id || !tutor_of || isLoading) return

        try {
            setIsLoading(true)

            const payload = items.map((item, index) => ({
                resultId: item.id,
                finalRank: item.rank + index
            }))

            await api.post(
                `/elections/${election?.id}/classes/${tutor_of}/tie-breaker/resolve`,
                payload
            )

            const res = await api.get(
                `/elections/${election?.id}/classes/${tutor_of}/tie-breaker`
            )

            if (!res.data?.hasTie) navigate("/")

            setTiedCandidatesData(res.data)

            toast.success("Tie-break resolved successfully")
        } catch (err) {
            toast.error(
                err.response?.data?.error ||
                    "Something went wrong, please try again!",
                {
                    id: "tie-breaker-submit-error"
                }
            )
        } finally {
            setIsLoading(false)
            setShowConfirm(false)
        }
    }

    return (
        <DndContext onDragEnd={handleDragEnd}>
            <div className='flex flex-col items-center px-2 md:px-5 lg:px-9 py-5 flex-1 min-h-0 text-primary-light dark:text-primary-dark'>
                <title>Tie Breaker</title>
                {tiedCandidatesData?.hasTie && (
                    <div className='flex flex-col flex-1 w-full gap-6 max-w-6xl min-h-0'>
                        <div className='flex flex-col gap-2'>
                            <h2 className='text-primary-light dark:text-primary-dark text-lg lg:text-xl font-semibold'>
                                Tie Breaker Required
                            </h2>
                            <p className='text-sm text-secondary-light dark:text-secondary-dark'>
                                A tie was detected. Arrange the candidates below
                                in their final tie-break order
                            </p>
                            <p className='text-sm font-semibold text-secondary-light dark:text-secondary-dark'>
                                Warning: This action finalizes the result and
                                cannot be undone
                            </p>
                        </div>
                        <div className='flex flex-col bg-card-light dark:bg-card-dark flex-1 rounded-md px-4 py-6 gap-6'>
                            <h3 className='font-semibold text-primary-light dark:text-primary-dark'>
                                {capitalize(currentCategory?.category)} Category
                                Tie Breaker
                            </h3>
                            <TiedCandidatesContainer
                                items={items}
                                disabled={isLoading || !checked}
                            />
                            <div className='flex items-center justify-between gap-6'>
                                <Checkbox
                                    checked={checked}
                                    onChange={setChecked}
                                    label='I confirm that the tie-break was conducted physically in the presence of the candidates'
                                />
                                <Button
                                    text='Submit'
                                    className='px-5 py-2 text-sm bg-accent hover:bg-button-hover'
                                    type='button'
                                    onClick={() => setShowConfirm(true)}
                                    disabled={!checked}
                                />
                            </div>
                        </div>
                    </div>
                )}
                {!tiedCandidatesData?.hasTie && (
                    <div className='flex flex-col px-3 py-4 gap-6 flex-1 items-center justify-center'>
                        <h2 className='text-center text-primary-light dark:text-primary-dark text-2xl md:text-3xl lg:text-4xl font-black'>
                            No Tied Candidates For Your Class
                        </h2>
                    </div>
                )}
                {showConfirm && (
                    <TieBreakerConfirm
                        isOpen={showConfirm}
                        setIsOpen={setShowConfirm}
                        isLoading={isLoading}
                        handleConfirm={submitTieBreaker}
                    />
                )}
            </div>
        </DndContext>
    )
}

export default TieBreaker
