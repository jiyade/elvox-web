import { useState } from "react"
import { FormProvider, useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"
import FullScreenLoader from "./FullScreenLoader"
import Modal from "./Modal"
import Button from "./Button"
import CreateElectionFormElectionName from "./CreateElectionFormElectionName"
import CreateElectionFormTimeline from "./CreateElectionFormTimeline"
import { toTimestamptz, fromTimestamptz } from "../utils/datetime"
import { createElectionResolver } from "../validators/election"
import api from "../api/api"
import { useElectionStore } from "../stores"

const EDIT_RULES = {
    electionName: ["draft"],
    nominationStart: ["draft"],
    nominationEnd: ["draft", "nominations"],
    votingStart: ["draft", "nominations", "pre-voting"],
    votingEnd: ["draft", "nominations", "pre-voting", "voting"],
    electionEnd: ["draft", "nominations", "pre-voting", "voting", "post-voting"]
}

const CreateElectionModal = ({ isOpen, setIsOpen, edit = false }) => {
    const [isLoading, setIsLoading] = useState(false)

    const navigate = useNavigate()

    const { election, setElection } = useElectionStore()

    const fromTimestamp = {}

    if (edit) {
        // GET CURRENT VALUES ON EDIT MODE
        fromTimestamp.nominationStart = fromTimestamptz(
            election.nomination_start
        )
        fromTimestamp.nominationEnd = fromTimestamptz(election.nomination_end)
        fromTimestamp.votingStart = fromTimestamptz(election.voting_start)
        fromTimestamp.votingEnd = fromTimestamptz(election.voting_end)
        fromTimestamp.electionEnd = fromTimestamptz(election.election_end)
    }

    // GET DISABLED FIELDS ON EDIT MODE
    const disabled = edit
        ? Object.fromEntries(
              Object.entries(EDIT_RULES).map(([field, allowed]) => [
                  field,
                  !allowed.includes(election?.status)
              ])
          )
        : {}

    const methods = useForm({
        defaultValues: {
            electionName: edit ? election.name : "",
            nominationStartDate: edit ? fromTimestamp.nominationStart.date : "",
            nominationStartTime: edit ? fromTimestamp.nominationStart.time : "",
            nominationEndDate: edit ? fromTimestamp.nominationEnd.date : "",
            nominationEndTime: edit ? fromTimestamp.nominationEnd.time : "",
            votingStartDate: edit ? fromTimestamp.votingStart.date : "",
            votingStartTime: edit ? fromTimestamp.votingStart.time : "",
            votingEndDate: edit ? fromTimestamp.votingEnd.date : "",
            votingEndTime: edit ? fromTimestamp.votingEnd.time : "",
            electionEndDate: edit ? fromTimestamp.electionEnd.date : "",
            electionEndTime: edit ? fromTimestamp.electionEnd.time : ""
        },
        resolver: createElectionResolver(election?.status)
    })

    const {
        handleSubmit,
        formState: { isDirty }
    } = methods

    const onSubmit = async (values) => {
        try {
            setIsLoading(true)

            const data = {}

            if (!disabled.electionName) {
                data.electionName = values.electionName
            }

            const setTs = (key, dateKey, timeKey) => {
                if (!edit || !disabled[key]) {
                    data[key] = toTimestamptz(values[dateKey], values[timeKey])
                }
            }

            setTs(
                "nominationStart",
                "nominationStartDate",
                "nominationStartTime",
                election.nomination_start
            )
            setTs(
                "nominationEnd",
                "nominationEndDate",
                "nominationEndTime",
                election.nomination_end
            )
            setTs(
                "votingStart",
                "votingStartDate",
                "votingStartTime",
                election.voting_start
            )
            setTs(
                "votingEnd",
                "votingEndDate",
                "votingEndTime",
                election.voting_end
            )
            setTs(
                "electionEnd",
                "electionEndDate",
                "electionEndTime",
                election.election_end
            )

            if (!edit) {
                const res = await api.post("/elections", data)
                toast.success("Election created successfully", {
                    id: "create-election-success"
                })
                setElection(res.data)
                navigate("/manage-election")
            } else {
                const res = await api.patch(`/elections/${election?.id}`, data)
                toast.success("Election updated successfully", {
                    id: "update-election-success"
                })
                setElection(res.data)
            }
            setIsOpen(false)
        } catch (err) {
            toast.error(
                err.response?.data?.error ||
                    (edit
                        ? "Failed to update election"
                        : "Failed to create election"),
                {
                    id: "create-update--election-error"
                }
            )
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Modal
            open={isOpen}
            onClose={() => {
                setIsOpen(false)
            }}
            title={edit ? "Edit Election Details" : "Create Election"}
        >
            <title>{edit ? "Edit Election" : "Create Election"}</title>

            <FormProvider {...methods}>
                <form
                    className='flex flex-col pt-6 flex-1 text-sm min-h-0'
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <div className='flex flex-col gap-5 flex-1 overflow-y-auto custom-scrollbar py-1'>
                        <CreateElectionFormElectionName
                            disabled={disabled.electionName}
                        />
                        <CreateElectionFormTimeline disabled={disabled} />
                    </div>
                    <div className='flex justify-center gap-3 mt-5 w-full'>
                        <Button
                            text='Cancel'
                            className='w-1/2 h-11 text-sm bg-secondary-button-light dark:bg-secondary-button-dark hover:bg-secondary-button-hover-light dark:hover:bg-secondary-button-hover-dark'
                            type='button'
                            onClick={() => {
                                setIsOpen(false)
                            }}
                        />
                        <Button
                            text={edit ? "Update Election" : "Create Election"}
                            className='w-1/2 h-11 text-sm bg-accent hover:bg-button-hover'
                            type='submit'
                            disabled={
                                isLoading ||
                                !isDirty ||
                                (disabled.electionName &&
                                    disabled.nominationStart &&
                                    disabled.nominationEnd &&
                                    disabled.votingStart &&
                                    disabled.votingEnd &&
                                    disabled.electionEnd)
                            }
                        />
                    </div>
                </form>
            </FormProvider>
            {isLoading && (
                <div className='flex justify-between items-center'>
                    <FullScreenLoader />
                </div>
            )}
        </Modal>
    )
}

export default CreateElectionModal
