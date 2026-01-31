import { useElectionStore } from "../stores"
import Button from "./Button"
import Toggle from "./Toggle"
import InfoTooltip from "./InfoTooltip"
import toast from "react-hot-toast"
import { useState } from "react"
import EditReservedClass from "./EditReservedClass"
import api from "../api/api"
import SecretKey from "./SecretKey"

const ManageElectionConfiguration = ({
    setIsLoading,
    isLoading,
    setShowConfirmDialog
}) => {
    const [showReservedEdit, setShowReservedEdit] = useState(false)
    const [isAutoPublishLoading, setIsAutoPublishLoading] = useState(false)

    const { election, setElection } = useElectionStore()

    const handleAutoPublishToggle = async (value) => {
        try {
            setIsAutoPublishLoading(true)

            setElection({ auto_publish_results: value })
            await api.patch(`/elections/${election?.id}/auto-publish`, {
                autoPublish: value
            })
        } catch (err) {
            toast.error(
                err.response?.data?.error ||
                    "Failed to change auto publish results",
                {
                    id: "update-auto-publish-results"
                }
            )
            setElection({ auto_publish_results: !value })
        } finally {
            setIsAutoPublishLoading(false)
        }
    }

    return (
        <div className='flex flex-col w-full gap-3 px-4 py-4 rounded-md border border-gray-500 text-primary-light dark:text-primary-dark shadow-lg transition-all duration-100'>
            <div className='flex flex-col gap-1'>
                <p className='font-semibold text-left text-primary-light dark:text-primary-dark text-base'>
                    Configuration
                </p>
                <p className='text-secondary-light dark:text-secondary-dark'>
                    Configure election-specific behavior and system options
                    based on the election lifecycle
                </p>
            </div>
            <div className='flex flex-col divide-y pt-2 gap-3 divide-gray-500 text-primary-light dark:text-primary-dark'>
                <div className='grid grid-cols-[1fr_auto] gap-x-3 pb-3 items-center'>
                    <div className='flex gap-2 items-center'>
                        <p>
                            {election?.status === "draft"
                                ? "Configure"
                                : "View"}{" "}
                            Reserved Category Classes
                        </p>
                        <InfoTooltip
                            message={
                                election?.status === "draft"
                                    ? "Select which classes will have a reserved (female-only) category. Locked after Draft"
                                    : "Cannot be edited at this stage"
                            }
                        />
                    </div>
                    <Button
                        text={
                            election?.status === "draft" ? "Configure" : "View"
                        }
                        className='text-sm text-primary-light dark:text-primary-dark border-secondary-light dark:border-secondary-dark border-2 px-3 py-2 hover:bg-secondary-button-hover-light dark:hover:bg-secondary-button-hover hover:text-primary-dark'
                        type='button'
                        onClick={() => {
                            setShowReservedEdit(true)
                        }}
                    />
                </div>
                {!election?.result_published && (
                    <div className='grid grid-cols-[1fr_auto] gap-x-3 pb-3 items-center'>
                        <div className='flex gap-2 items-center'>
                            <p>
                                Automatically Publish Results After Voting Ends
                            </p>
                            <InfoTooltip
                                message={
                                    election?.status !== "post-voting" &&
                                    election?.status !== "closed"
                                        ? "If enabled, results will be published automatically when voting finishes"
                                        : "Cannot be changed at this stage"
                                }
                            />
                        </div>
                        <Toggle
                            checked={election?.auto_publish_results}
                            onChange={handleAutoPublishToggle}
                            disabled={
                                isLoading ||
                                isAutoPublishLoading ||
                                election?.status === "post-voting" ||
                                election?.status === "closed"
                            }
                        />
                    </div>
                )}
                {election?.status === "post-voting" &&
                    election?.result_published === false &&
                    election?.auto_publish_results === false && (
                        <div className='grid grid-cols-[1fr_auto] gap-x-3 pb-3 items-center'>
                            <div className='flex gap-2 items-center'>
                                <p>Publish Election Results</p>
                                <InfoTooltip message='Manually publish the election results. This cannot be undone' />
                            </div>
                            <Button
                                text='Publish Results'
                                className='text-sm text-primary-light dark:text-primary-dark bg-accent px-3 py-2 hover:bg-button-hover'
                                type='button'
                                onClick={() => setShowConfirmDialog(true)}
                            />
                        </div>
                    )}
            </div>
            {(election?.status === "pre-voting" ||
                election?.status === "voting") && (
                <div className='flex flex-col gap-1'>
                    <p className='font-semibold text-left text-primary-light dark:text-primary-dark text-base'>
                        Election Secret Key
                    </p>
                    <p className='text-secondary-light dark:text-secondary-dark'>
                        Used to authorize the voting application. This secret
                        key is shown only once after generation
                    </p>
                    <SecretKey
                        setIsLoading={setIsLoading}
                        isLoading={isLoading}
                    />
                </div>
            )}
            {showReservedEdit && (
                <EditReservedClass
                    isOpen={showReservedEdit}
                    setShowEditModal={setShowReservedEdit}
                />
            )}
        </div>
    )
}

export default ManageElectionConfiguration
