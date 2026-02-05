import toast from "react-hot-toast"
import { useElectionStore } from "../stores"
import Button from "./Button"
import InfoTooltip from "./InfoTooltip"
import ConfirmRegenerateKey from "./ConfirmRegenerateKey"
import { useState } from "react"
import api from "../api/api"
import { LuClipboard, LuRotateCcw } from "react-icons/lu"
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5"

const SecretKey = ({ setIsLoading, isLoading, setShowActivatedSystems }) => {
    const [secretKey, setSecretKey] = useState("")
    const [revealed, setRevealed] = useState(false)
    const [showConfirmDialog, setShowConfirmDialog] = useState(false)

    const {
        election: {
            hasSecretKey,
            id: electionId,
            status,
            totalActivatedSystems
        },
        setElection
    } = useElectionStore()

    const generateSecretKey = async (regenerated) => {
        try {
            setIsLoading(true)

            const res = await api.post(`/elections/${electionId}/secret-key`)
            setElection({ hasSecretKey: true })
            setSecretKey(res.data.secretKey)
            setRevealed(false)
            toast.success(
                `Secret key ${regenerated ? "regenerated" : "generated"}`
            )
        } catch (err) {
            toast.error(
                err.response?.data?.error ||
                    `Failed to ${
                        regenerated ? "regenerated" : "generated"
                    } secret key`,
                {
                    id: "secret-key-generate-error"
                }
            )
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className='flex flex-col divide-y pt-4 gap-3 divide-gray-500 text-primary-light dark:text-primary-dark'>
            {!hasSecretKey && (
                <div className='grid grid-cols-[1fr_auto] gap-x-3 pb-3 items-center'>
                    <div className='flex gap-2 items-center'>
                        <p>Generate Secret Key</p>
                        <InfoTooltip message='Generates a secret key for the voting application' />
                    </div>
                    <Button
                        text='Generate'
                        className='text-sm bg-accent hover:bg-button-hover px-3 py-2'
                        type='button'
                        onClick={() => generateSecretKey(false)}
                        disabled={isLoading}
                    />
                </div>
            )}
            {hasSecretKey && (
                <div className='flex flex-col gap-2'>
                    <div className='grid grid-cols-[1fr_auto] gap-x-3 pb-3 items-center'>
                        <p>Total Activated Systems</p>
                        <p>{totalActivatedSystems}</p>
                    </div>
                    {Number(totalActivatedSystems) > 0 && (
                        <div className='grid grid-cols-[1fr_auto] gap-x-3 pb-3 items-center'>
                            <div className='flex gap-2 items-center'>
                                <p>Manage Activated Systems</p>
                                <InfoTooltip message='View activated voting systems and revoke their access' />
                            </div>
                            <Button
                                text='Manage'
                                className='text-sm text-primary-light dark:text-primary-dark border-secondary-light dark:border-secondary-dark border-2 px-3 py-2 hover:bg-secondary-button-hover-light dark:hover:bg-secondary-button-hover-dark hover:text-primary-dark'
                                type='button'
                                onClick={() => setShowActivatedSystems(true)}
                            />
                        </div>
                    )}
                    <div className='flex gap-2 items-center'>
                        <p>Secret Key</p>
                        <InfoTooltip
                            message={
                                secretKey
                                    ? "Used to authorize the voting application. Copy this key now - it will not be shown again"
                                    : "Used to authorize the voting application. The key is hidden for security, but you can regenerate it if needed"
                            }
                        />
                    </div>
                    <div className='flex items-center justify-between gap-2 h-9'>
                        <p className='flex flex-1 min-w-0 h-full items-center border border-gray-500 px-2 overflow-x-auto overflow-y-hidden whitespace-nowrap no-scrollbar'>
                            {secretKey
                                ? revealed
                                    ? secretKey
                                    : "•".repeat(secretKey.length)
                                : "•".repeat(64)}
                        </p>
                        <div className='flex gap-2 h-full min-w-0 justify-self-end'>
                            {secretKey && (
                                <Button
                                    className='h-full border border-gray-500 rounded-none px-3 hover:bg-secondary-button-hover-light dark:hover:bg-secondary-button-hover-dark text-primary-light dark:text-primary-dark hover:text-primary-dark'
                                    onClick={() => {
                                        navigator.clipboard.writeText(secretKey)
                                        toast.success("Secret key copied")
                                    }}
                                >
                                    <LuClipboard className='size-4' />
                                </Button>
                            )}
                            {secretKey && (
                                <Button
                                    className='h-full border border-gray-500 rounded-none px-3 hover:bg-secondary-button-hover-light dark:hover:bg-secondary-button-hover-dark text-primary-light dark:text-primary-dark hover:text-primary-dark'
                                    onClick={() =>
                                        setRevealed((state) => !state)
                                    }
                                >
                                    {revealed ? (
                                        <IoEyeOffOutline className='size-4' />
                                    ) : (
                                        <IoEyeOutline className='size-4' />
                                    )}
                                </Button>
                            )}
                            <Button
                                className='h-full rounded-none px-3 bg-red-700 hover:bg-red-800 text-primary-dark'
                                onClick={() => setShowConfirmDialog(true)}
                                disabled={isLoading}
                            >
                                <LuRotateCcw className='size-4' />
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {showConfirmDialog && ["pre-voting", "voting"].includes(status) && (
                <ConfirmRegenerateKey
                    isOpen={showConfirmDialog}
                    setIsOpen={setShowConfirmDialog}
                    handleRegenerate={() => {
                        generateSecretKey(true)
                        setShowConfirmDialog(false)
                    }}
                    isLoading={isLoading}
                />
            )}
        </div>
    )
}

export default SecretKey
