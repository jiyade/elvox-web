import { useCallback, useEffect, useMemo, useState } from "react"
import { useElectionStore } from "../stores"
import api from "../api/api"
import toast from "react-hot-toast"
import FullScreenLoader from "./FullScreenLoader"
import Modal from "./Modal"
import Button from "./Button"
import EditSupervisorListItem from "./EditReservedClassListItem"
import { FaMinus, FaPlus } from "react-icons/fa6"

const EditReservedClass = ({ isOpen, setShowEditModal }) => {
    const [reservedClasses, setReservedClasses] = useState([])
    const [eligibleClasses, setEligibleClasses] = useState([])
    const [allClasses, setAllClasses] = useState([])
    const [isLoadingSubmit, setIsLoadingSubmit] = useState(false)
    const [changes, setChanges] = useState({
        toReserved: new Set(),
        toCommon: new Set()
    })

    const isDataReady =
        allClasses.length > 0 &&
        reservedClasses.length + eligibleClasses.length > 0

    const { election } = useElectionStore()

    const visibleReserved = useMemo(() => {
        return [
            ...reservedClasses.filter((c) => !changes.toCommon.has(c.id)),
            ...eligibleClasses.filter((c) => changes.toReserved.has(c.id))
        ]
    }, [reservedClasses, eligibleClasses, changes])

    const visibleCommon = useMemo(() => {
        return [
            ...eligibleClasses.filter((c) => !changes.toReserved.has(c.id)),
            ...reservedClasses.filter((c) => changes.toCommon.has(c.id))
        ]
    }, [eligibleClasses, reservedClasses, changes])

    const addedCount = useMemo(() => {
        return [...changes.toReserved].filter(
            (id) => !reservedClasses.some((c) => c.id === id)
        ).length
    }, [changes, reservedClasses])

    const removedCount = useMemo(() => {
        return [...changes.toCommon].filter(
            (id) => !eligibleClasses.some((c) => c.id === id)
        ).length
    }, [changes, eligibleClasses])

    const originalReservedClassIds = useMemo(
        () => new Set(reservedClasses.map((c) => c.id)),
        [reservedClasses]
    )

    const fetchReservedClasses = useCallback(async () => {
        if (!election?.id) return

        try {
            const res = await api.get(
                `/elections/${election.id}/category-config`
            )

            const reservedIds = new Set(res.data.map(String))

            setReservedClasses(
                [...allClasses]
                    .filter((c) => reservedIds.has(c.id))
                    .map((c) => ({ id: c.id, name: c.name, year: c.year }))
            )

            setEligibleClasses(allClasses.filter((c) => !reservedIds.has(c.id)))
        } catch (err) {
            toast.error(
                err.response?.data?.error ||
                    "Failed to fetch reserved classes, please try again",
                { id: "reserved-classes-fetch-error" }
            )
        }
    }, [election?.id, allClasses])

    const handleAction = (action, id) => {
        if (action === "add") {
            setChanges((prev) => {
                const toReserved = new Set(prev.toReserved)
                const toCommon = new Set(prev.toCommon)

                if (originalReservedClassIds.has(id)) {
                    toCommon.delete(id)
                } else {
                    toReserved.add(id)
                }

                return { toReserved, toCommon }
            })
        } else if (action === "remove") {
            setChanges((prev) => {
                const toReserved = new Set(prev.toReserved)
                const toCommon = new Set(prev.toCommon)

                if (originalReservedClassIds.has(id)) {
                    toCommon.add(id)
                }
                toReserved.delete(id)

                return { toReserved, toCommon }
            })
        } else if (action === "add-all") {
            setChanges((prev) => {
                const toReserved = new Set(prev.toReserved)
                const toCommon = new Set(prev.toCommon)

                const allIds = [...allClasses].map((c) => c.id)

                allIds.forEach((id) => {
                    if (originalReservedClassIds.has(id)) {
                        toCommon.delete(id)
                    } else {
                        toReserved.add(id)
                    }
                })

                return { toReserved, toCommon }
            })
        } else if (action === "remove-all") {
            setChanges((prev) => {
                const toReserved = new Set(prev.toReserved)
                const toCommon = new Set(prev.toCommon)

                const allIds = [...allClasses].map((c) => c.id)

                allIds.forEach((id) => {
                    if (originalReservedClassIds.has(id)) {
                        toCommon.add(id)
                    }
                    toReserved.delete(id)
                })

                return { toReserved, toCommon }
            })
        }
    }

    const handleSubmit = async () => {
        try {
            setIsLoadingSubmit(true)

            const res = await api.patch(
                `/elections/${election.id}/category-config`,
                {
                    classIds: visibleReserved.map((c) => c.id)
                }
            )
            toast.success(
                res.data.message || "Updating reserved classes success"
            )
            fetchReservedClasses()
            setShowEditModal(false)
        } catch (err) {
            toast.error(
                err.response?.data?.error ||
                    "Failed to update reserved classes, please try again",
                { id: "reserved-classes-update-error" }
            )
        } finally {
            setIsLoadingSubmit(false)
        }
    }

    useEffect(() => {
        if (!election?.id || allClasses.length === 0) return
        fetchReservedClasses()
    }, [fetchReservedClasses, election.id, allClasses])

    useEffect(() => {
        const fetchAllClasses = async () => {
            try {
                const res = await api.get("/classes")
                setAllClasses(res.data)
            } catch (err) {
                toast.error(
                    err.response?.data?.error ||
                        "Failed to fetch classes, please try again",
                    { id: "all-classes-fetch-error" }
                )
            }
        }

        fetchAllClasses()
    }, [])

    return (
        <Modal
            open={isOpen}
            onClose={() => setShowEditModal(false)}
            title={
                election?.status === "draft"
                    ? "Update Reserved Classes"
                    : "Reserved Classes"
            }
        >
            <title>Update Reserved Classes</title>
            <div className='flex flex-col mt-6 flex-1 min-h-0'>
                <div className='flex max-sm:flex-col gap-4 sm:justify-between flex-1 min-h-0'>
                    <div className='flex flex-col border border-gray-500 rounded-md flex-1 divide-y divide-gray-500'>
                        <div className='flex items-center justify-between px-3'>
                            <h3 className='py-2'>
                                Reserved Classes ({visibleReserved.length})
                            </h3>
                            {visibleReserved.length > 0 &&
                                election?.status === "draft" && (
                                    <Button
                                        className='text-sm text-primary-light dark:text-primary-dark py-1 px-2 hover:bg-secondary-button-hover-light dark:hover:bg-secondary-button-hover'
                                        onClick={() =>
                                            handleAction("remove-all")
                                        }
                                    >
                                        <FaMinus />
                                    </Button>
                                )}
                        </div>
                        <div className='flex flex-col divide-y divide-gray-500 overflow-y-auto custom-scrollbar'>
                            {isDataReady &&
                                visibleReserved.map((reserved) => (
                                    <EditSupervisorListItem
                                        key={reserved.id}
                                        data={reserved}
                                        action='remove'
                                        handleAction={handleAction}
                                        showButton={
                                            election?.status === "draft"
                                        }
                                    />
                                ))}
                        </div>
                    </div>
                    <div className='flex flex-col border border-gray-500 rounded-md flex-1 divide-y divide-gray-500'>
                        <div className='flex items-center justify-between px-3'>
                            <h3 className='py-2'>
                                Non-Reserved Classes ({visibleCommon.length})
                            </h3>
                            {visibleCommon.length > 0 &&
                                election?.status === "draft" && (
                                    <Button
                                        className='text-sm text-primary-light dark:text-primary-dark py-1 px-2 hover:bg-secondary-button-hover-light dark:hover:bg-secondary-button-hover'
                                        onClick={() => handleAction("add-all")}
                                    >
                                        <FaPlus />
                                    </Button>
                                )}
                        </div>
                        <div className='flex flex-col divide-y divide-gray-500 overflow-y-auto custom-scrollbar'>
                            {visibleCommon.map((cls) => (
                                <EditSupervisorListItem
                                    key={cls.id}
                                    data={cls}
                                    action='add'
                                    handleAction={handleAction}
                                    showButton={election?.status === "draft"}
                                />
                            ))}
                        </div>
                    </div>
                </div>
                {isDataReady && election?.status === "draft" && (
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
                                text='Update'
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
            {(!isDataReady || isLoadingSubmit) && (
                <div className='flex justify-between items-center'>
                    <FullScreenLoader />
                </div>
            )}
        </Modal>
    )
}

export default EditReservedClass
