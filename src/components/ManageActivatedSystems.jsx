import { useEffect, useState } from "react"
import api from "../api/api"
import toast from "react-hot-toast"
import FullScreenLoader from "./FullScreenLoader"
import Modal from "./Modal"
import Button from "./Button"
import { useElectionStore } from "../stores"
import ConfirmRevokeSystem from "./ConfirmRevokeSystem"

const formatDate = (value) => {
    if (!value) return "—"
    return new Date(value).toLocaleString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true
    })
}

const ManageActivatedSystems = ({ isOpen, setShowEditModal }) => {
    const [activatedSystems, setActivatedSystems] = useState([])
    const [showConfirmationDialog, setShowConfirmationDialog] = useState(false)
    const [selected, setSelected] = useState(null)
    const [password, setPassword] = useState("")
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    const { election, setElection } = useElectionStore()

    const revokeSystem = async () => {
        if (!selected) return

        if (!password) {
            setError("Password is required")
            return
        }

        setError(null)

        try {
            setIsLoading(true)

            await api.patch(
                `/elections/${election?.id}/activated-systems/${selected.id}/revoke`,
                {
                    password
                }
            )

            toast.success("System revoked successfully")
            if (Number(election?.totalActivatedSystems) > 0) {
                setElection({
                    totalActivatedSystems: `${Number(election?.totalActivatedSystems) - 1}`
                })
            }
            setShowConfirmationDialog(false)
            setShowEditModal(false)
        } catch (err) {
            toast.error(
                err.response?.data?.error || "Failed to revoke systems",
                {
                    id: "fail-revoke-system"
                }
            )
            console.log(err)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        const fetchActivatedSystems = async () => {
            try {
                setIsLoading(true)

                const res = await api.get(
                    `/elections/${election?.id}/activated-systems`
                )

                setActivatedSystems(res.data)
            } catch (err) {
                toast.error(
                    err.response?.data?.error ||
                        "Failed to fetch activated systems",
                    {
                        id: "fetch-activated-systems"
                    }
                )
            } finally {
                setIsLoading(false)
            }
        }

        fetchActivatedSystems()
    }, [election?.id])

    return (
        <Modal
            open={isOpen}
            onClose={() => setShowEditModal(false)}
            title='Manage Activated Systems'
        >
            <title>Manage Activated Systems</title>
            <div className='flex flex-col mt-6 flex-1 min-h-0'>
                {activatedSystems.length > 0 && (
                    <div className='flex flex-col border border-gray-500 rounded-md flex-1 divide-y divide-gray-500 min-h-0'>
                        <div className='flex flex-col overflow-y-auto custom-scrollbar divide-y divide-gray-500'>
                            {activatedSystems.map((system) => (
                                <div
                                    key={system.id}
                                    className='flex items-center justify-between px-2 py-3 w-full gap-2'
                                >
                                    <div className='flex flex-col gap-1'>
                                        <p className='text-sm'>
                                            {system.device_name}
                                        </p>
                                        <p className='text-xs text-secondary-light dark:text-secondary-dark'>
                                            Activated on:{" "}
                                            {formatDate(system.activated_at)}
                                        </p>
                                    </div>
                                    <Button
                                        text='Revoke'
                                        className='text-sm text-primary-light dark:text-primary-dark border-secondary-light dark:border-secondary-dark border-2 px-3 py-2 hover:bg-secondary-button-hover-light dark:hover:bg-secondary-button-hover-dark hover:text-primary-dark'
                                        type='button'
                                        onClick={() => {
                                            setSelected(system)
                                            setShowConfirmationDialog(true)
                                        }}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                {activatedSystems.length === 0 && (
                    <div className='flex flex-1 items-center justify-center py-10'>
                        <p>No activated systems!</p>
                    </div>
                )}
            </div>
            {showConfirmationDialog && (
                <ConfirmRevokeSystem
                    isOpen={showConfirmationDialog}
                    setIsOpen={setShowConfirmationDialog}
                    handleRevoke={revokeSystem}
                    systemName={selected.device_name}
                    password={password}
                    setPassword={setPassword}
                    error={error}
                    isLoading={isLoading}
                />
            )}
            {isLoading && (
                <div className='flex justify-between items-center'>
                    <FullScreenLoader />
                </div>
            )}
        </Modal>
    )
}

export default ManageActivatedSystems
