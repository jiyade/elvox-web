import { useEffect, useMemo, useState } from "react"
import { useElectionStore } from "../stores"
import api from "../api/api"
import toast from "react-hot-toast"
import FullScreenLoader from "./FullScreenLoader"
import Modal from "./Modal"
import EditSupervisorListItem from "./EditSupervisorListItem"
import Button from "./Button"

const EditSupervisors = ({
    isOpen,
    setShowEditModal,
    supervisors,
    fetchSupervisors
}) => {
    const [eligibleTeachers, setEligibleTeachers] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [changes, setChanges] = useState({
        toSupervisors: new Set(),
        toTeachers: new Set()
    })

    const { election } = useElectionStore()

    const visibleSupervisors = useMemo(() => {
        return [
            ...supervisors.filter((s) => !changes.toTeachers.has(s.id)),
            ...eligibleTeachers.filter((t) => changes.toSupervisors.has(t.id))
        ]
    }, [supervisors, eligibleTeachers, changes])

    const visibleTeachers = useMemo(() => {
        return [
            ...eligibleTeachers.filter((t) => !changes.toSupervisors.has(t.id)),
            ...supervisors.filter((s) => changes.toTeachers.has(s.id))
        ]
    }, [eligibleTeachers, supervisors, changes])

    const addedCount = useMemo(() => {
        return [...changes.toSupervisors].filter(
            (id) => !supervisors.some((s) => s.id === id)
        ).length
    }, [changes, supervisors])

    const removedCount = useMemo(() => {
        return [...changes.toTeachers].filter(
            (id) => !eligibleTeachers.some((s) => s.id === id)
        ).length
    }, [changes, eligibleTeachers])

    const userById = useMemo(() => {
        return new Map(
            [...supervisors, ...eligibleTeachers].map((u) => [u.id, u])
        )
    }, [supervisors, eligibleTeachers])

    const originalSupervisorIds = useMemo(
        () => new Set(supervisors.map((s) => s.id)),
        [supervisors]
    )

    const handleAction = (action, id) => {
        if (action === "add") {
            setChanges((prev) => {
                const toSupervisors = new Set(prev.toSupervisors)
                const toTeachers = new Set(prev.toTeachers)

                if (originalSupervisorIds.has(id)) {
                    toTeachers.delete(id)
                } else {
                    toSupervisors.add(id)
                }

                return { toSupervisors, toTeachers }
            })
        } else if (action === "remove") {
            setChanges((prev) => {
                const toSupervisors = new Set(prev.toSupervisors)
                const toTeachers = new Set(prev.toTeachers)

                if (originalSupervisorIds.has(id)) {
                    toTeachers.add(id)
                }
                toSupervisors.delete(id)

                return { toSupervisors, toTeachers }
            })
        }
    }

    const handleSubmit = async () => {
        try {
            setIsLoading(true)

            const payload = {
                add: [...changes.toSupervisors].map((id) => {
                    const u = userById.get(id)
                    return { id: u.id, empcode: u.empcode }
                }),
                remove: [...changes.toTeachers].map((id) => {
                    const u = userById.get(id)
                    return { id: u.id, empcode: u.empcode }
                })
            }

            const res = await api.post(
                `/elections/${election.id}/supervisors`,
                payload
            )
            toast.success(
                `Editing supervisors success, ${res.data.added} added and ${res.data.removed} removed`
            )
            fetchSupervisors()
            setShowEditModal(false)
        } catch (err) {
            toast.error(
                err.response?.data?.error ||
                    "Failed to fetch eligible teachers, please try again",
                { id: "eligible-teachers-fetch-error" }
            )
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        const fetchEligbileTeachers = async () => {
            try {
                setIsLoading(true)
                const res = await api.get(
                    `/teachers/supervisor-eligible/${election?.id}`
                )
                setEligibleTeachers(res.data)
            } catch (err) {
                toast.error(
                    err.response?.data?.error ||
                        "Failed to fetch eligible teachers, please try again",
                    { id: "eligible-teachers-fetch-error" }
                )
            } finally {
                setIsLoading(false)
            }
        }

        fetchEligbileTeachers()
    }, [election?.id])

    return (
        <Modal
            open={isOpen}
            onClose={() => setShowEditModal(false)}
            title='Edit Supervisors'
        >
            <title>Edit Supervisors</title>
            <div className='flex flex-col mt-6 flex-1 min-h-0'>
                <div className='flex max-sm:flex-col gap-4 sm:justify-between flex-1 min-h-0'>
                    <div className='flex flex-col border border-gray-500 rounded-md flex-1 divide-y divide-gray-500'>
                        <h3 className='p-2'>
                            Supervisors ({visibleSupervisors.length})
                        </h3>
                        <div className='flex flex-col divide-y divide-gray-500 overflow-y-auto custom-scrollbar'>
                            {!isLoading &&
                                visibleSupervisors.map((supervisor) => (
                                    <EditSupervisorListItem
                                        key={supervisor.id}
                                        data={supervisor}
                                        action='remove'
                                        handleAction={handleAction}
                                    />
                                ))}
                        </div>
                    </div>
                    <div className='flex flex-col border border-gray-500 rounded-md flex-1 divide-y divide-gray-500'>
                        <h3 className='p-2'>
                            Available Teachers ({visibleTeachers.length})
                        </h3>
                        <div className='flex flex-col divide-y divide-gray-500 overflow-y-auto custom-scrollbar'>
                            {visibleTeachers.map((teacher) => (
                                <EditSupervisorListItem
                                    key={teacher.id}
                                    data={teacher}
                                    action='add'
                                    handleAction={handleAction}
                                />
                            ))}
                        </div>
                    </div>
                </div>
                {!isLoading && (
                    <div className='flex items-center justify-between gap-3 mt-5 w-full border-t border-gray-500 pt-4'>
                        <div className='flex flex-1 gap-3'>
                            <p className='text-secondary-light dark:text-secondary-dark text-xs'>
                                {addedCount === 0 && removedCount === 0
                                    ? "No changes"
                                    : `${addedCount} added, ${removedCount} removed`}
                            </p>
                        </div>
                        <div className='flex justify-center flex-1 gap-3'>
                            <Button
                                text='Cancel'
                                className='w-1/2 h-11 text-sm bg-secondary-button hover:bg-secondary-button-hover-light dark:hover:bg-secondary-button-hover'
                                type='button'
                                onClick={() => {
                                    setShowEditModal(false)
                                }}
                            />
                            <Button
                                text='Submit'
                                className='w-1/2 h-11 text-sm bg-accent hover:bg-button-hover'
                                onClick={handleSubmit}
                                disabled={
                                    addedCount === 0 && removedCount === 0
                                }
                            />
                        </div>
                    </div>
                )}
            </div>
            {isLoading && (
                <div className='flex justify-between items-center'>
                    <FullScreenLoader />
                </div>
            )}
        </Modal>
    )
}

export default EditSupervisors
