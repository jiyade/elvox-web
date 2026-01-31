import { FormProvider, useForm } from "react-hook-form"
import Modal from "./Modal"
import { useAuthStore } from "../stores"
import SubmitAppealFormReadOnly from "./SubmitAppealFormReadOnly"
import SubmitAppealFormCategory from "./SubmitAppealFormCategory"
import SelectElection from "./SelectElection"
import SubmitAppealFormSubject from "./SubmitAppealFormSubject"
import SubmitAppealFormDescription from "./SubmitAppealFormDescription"
import SubmitAppealFormAttachments from "./SubmitAppealFormAttachments"
import Button from "./Button"
import FullScreenLoader from "./FullScreenLoader"
import { useState } from "react"
import api from "../api/api"
import toast from "react-hot-toast"

const SubmitAppealFormModal = ({
    isOpen,
    setIsCancelConfirmOpen,
    setShowAppealForm,
    setAppeals
}) => {
    const [isLoading, setIsLoading] = useState(false)

    const { user } = useAuthStore()

    const methods = useForm({
        defaultValues: {
            name: user.name,
            identifier: user.admno ?? user.empcode,
            category: "",
            election_id: "",
            subject: "",
            description: ""
        }
    })

    const {
        handleSubmit,
        getValues,
        formState: { errors }
    } = methods

    const onSubmit = async () => {
        try {
            setIsLoading(true)
            const data = getValues()
            const fd = new FormData()

            fd.append("category", data?.category)
            fd.append("election_id", data?.election_id)
            fd.append("subject", data?.subject)
            fd.append("description", data?.description)

            data?.attachments?.forEach((file) => {
                fd.append("attachments", file)
            })

            const res = await api.post("/appeals", fd)
            if (res.status === 201) {
                toast.success(res.data.message, {
                    id: "submit-appeal-success"
                })
                setAppeals((appeals) => [...appeals, res.data.data])
                setShowAppealForm(false)
            }
        } catch (err) {
            toast.error(
                err.response?.data?.error ||
                    "Failed to submit appeal. Please try again",
                {
                    id: "submit-appeal-error"
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
                setIsCancelConfirmOpen(true)
            }}
            title='Submit Appeal'
        >
            <title>Submit Appeal</title>
            <FormProvider {...methods}>
                <form
                    className='flex flex-col pt-6 flex-1 text-sm min-h-0'
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <div className='flex flex-col gap-5 flex-1 overflow-y-auto custom-scrollbar py-1'>
                        <SubmitAppealFormReadOnly role={user.role} />
                        <SubmitAppealFormCategory />
                        <div className='flex flex-col gap-2'>
                            <p>
                                Election <span className='text-red-500'>*</span>
                            </p>
                            <SelectElection />
                            {errors?.election_id && (
                                <p className='text-xs text-red-500 mt-1 font-medium'>
                                    {errors?.election_id?.message}
                                </p>
                            )}
                        </div>
                        <SubmitAppealFormSubject />
                        <SubmitAppealFormDescription />
                        <SubmitAppealFormAttachments />
                    </div>
                    <div className='flex justify-center gap-3 mt-5 w-full'>
                        <Button
                            text='Cancel'
                            className='w-1/2 h-11 text-sm bg-secondary-button hover:bg-secondary-button-hover-light dark:hover:bg-secondary-button-hover'
                            type='button'
                            onClick={() => {
                                setIsCancelConfirmOpen(true)
                            }}
                        />
                        <Button
                            text='Submit Appeal'
                            className='w-1/2 h-11 text-sm bg-accent hover:bg-button-hover'
                            type='submit'
                            disabled={isLoading}
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

export default SubmitAppealFormModal
