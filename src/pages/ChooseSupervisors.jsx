import { useEffect, useState } from "react"
import { useOutletContext } from "react-router-dom"
import Supervisor from "../components/Supervisor"
import Button from "../components/Button"
import EditSupervisors from "../components/EditSupervisors"
import api from "../api/api"
import toast from "react-hot-toast"
import { useCallback } from "react"
import { useElectionStore } from "../stores"

const ChooseSupervisors = () => {
    const [supervisors, setSupervisors] = useState([])
    const [showEditModal, setShowEditModal] = useState(false)

    const { isLoading, setIsLoading } = useOutletContext()

    const { election } = useElectionStore()

    const fetchSupervisors = useCallback(async () => {
        try {
            setIsLoading(true)
            const res = await api.get(`/elections/${election?.id}/supervisors`)
            setSupervisors(res.data)
        } catch (err) {
            toast.error(
                err.response?.data?.error ||
                    "Failed to fetch supervisors, please try again",
                { id: "supervisors-fetch-error" }
            )
        } finally {
            setIsLoading(false)
        }
    }, [setIsLoading, election?.id])

    useEffect(() => {
        fetchSupervisors()
    }, [fetchSupervisors])

    if (isLoading) return null

    return (
        <div className='flex flex-col items-center px-2 md:px-5 lg:px-9 py-5 flex-1 min-h-0'>
            <title>Choose Supervisors</title>
            {supervisors?.length > 0 && (
                <div className='flex flex-col flex-1 w-full gap-8 max-w-6xl min-h-0'>
                    <div className='flex items-center justify-between gap-1'>
                        <p>Total supervisors: {supervisors.length}</p>
                        {!["post-voting", "closed"].includes(
                            election?.status
                        ) && (
                            <Button
                                text='Edit Supervisors'
                                className='px-4 py-2.5 text-sm font-medium bg-accent hover:bg-button-hover'
                                onClick={() => setShowEditModal(true)}
                            />
                        )}
                    </div>
                    {supervisors.length > 0 && (
                        <div className='flex flex-col flex-[1_1_0px] gap-3 overflow-y-auto custom-scrollbar rounded-md bg-card-light dark:bg-card-dark px-2 py-4'>
                            {supervisors.map((supervisor) => (
                                <Supervisor
                                    key={supervisor.id}
                                    supervisor={supervisor}
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}
            {showEditModal &&
                !["post-voting", "closed"].includes(election?.status) && (
                    <EditSupervisors
                        isOpen={showEditModal}
                        setShowEditModal={setShowEditModal}
                        supervisors={supervisors}
                        fetchSupervisors={fetchSupervisors}
                    />
                )}

            {!supervisors.length && (
                <div className='flex flex-col px-3 py-4 gap-6 flex-1 items-center justify-center'>
                    {!["post-voting", "closed"].includes(election?.status) ? (
                        <>
                            <h2 className='text-center text-primary-light dark:text-primary-dark text-2xl md:text-3xl lg:text-4xl font-black'>
                                No Supervisors Assigned
                            </h2>
                            <Button
                                text='Assign Supervisors'
                                className='px-3 py-3 text-sm font-medium bg-accent hover:bg-button-hover'
                                onClick={() => setShowEditModal(true)}
                            />
                        </>
                    ) : (
                        <h2 className='text-center text-primary-light dark:text-primary-dark text-2xl md:text-3xl lg:text-4xl font-black'>
                            Cannot assign supervisors at this stage
                        </h2>
                    )}
                </div>
            )}
        </div>
    )
}

export default ChooseSupervisors
