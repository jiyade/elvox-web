import Modal from "./Modal"
import { useState } from "react"
import { FormProvider, useForm } from "react-hook-form"
import CandidateDetails from "./CandidateDetails"
import FullScreenLoader from "./FullScreenLoader"
import CandidateFormContent from "./CandidateFormContent"
import Button from "./Button"
import api from "../api/api"
import toast from "react-hot-toast"

const CandidateApplicationForm = ({
    isOpen,
    setIsCancelConfirmOpen,
    setIsCandidateApplicationOpen,
    setIsApplicationSubmitted
}) => {
    const [isLoading, setIsLoading] = useState(false)

    const methods = useForm({
        defaultValues: {
            election_id: "",
            category: "",
            signature: null,
            nominee1: {
                admno: "",
                data: null,
                proof: null
            },
            nominee2: {
                admno: "",
                data: null,
                proof: null
            }
        }
    })

    const handleSubmit = async () => {
        try {
            setIsLoading(true)
            const data = methods.getValues()
            const fd = new FormData()

            fd.append("election_id", data?.election_id)
            fd.append("category", data?.category)
            fd.append("signature", data?.signature?.[0])
            fd.append("nominee1Admno", data?.nominee1?.admno)
            fd.append("nominee1Proof", data?.nominee1?.proof?.[0])
            fd.append("nominee2Admno", data?.nominee2?.admno)
            fd.append("nominee2Proof", data?.nominee2?.proof?.[0])

            const res = await api.post("/candidates", fd)
            if (res.status === 201) {
                toast.success(res.data.message, {
                    id: "candidate-application-success"
                })
                setIsApplicationSubmitted({
                    submitted: true,
                    status: "pending"
                })
                setIsCandidateApplicationOpen(false)
            }
        } catch (err) {
            if (err.response)
                toast.error(err.response?.data?.error, {
                    id: "candidate-application-error"
                })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Modal
            open={isOpen}
            onClose={() => setIsCancelConfirmOpen(true)}
            title='Candidate Application'
        >
            <div className='flex max-sm:flex-col flex-1 py-6 gap-6 w-full h-full max-sm:overflow-y-auto custom-scrollbar min-h-0'>
                <CandidateDetails />
                <FormProvider {...methods}>
                    <form
                        className='flex flex-col justify-between sm:flex-2 flex-1 w-full'
                        onSubmit={methods.handleSubmit(handleSubmit)}
                    >
                        <CandidateFormContent setIsLoading={setIsLoading} />
                        <div className='flex justify-center gap-3 mt-5 w-full'>
                            <Button
                                text='Cancel'
                                className='w-1/2 h-11 text-sm bg-secondary-button-light dark:bg-secondary-button-dark hover:bg-secondary-button-hover-light dark:hover:bg-secondary-button-hover-dark'
                                type='button'
                                onClick={() => {
                                    setIsCancelConfirmOpen(true)
                                }}
                            />
                            <Button
                                text='Submit'
                                className='w-1/2 h-11 text-sm bg-accent hover:bg-button-hover'
                                type='submit'
                                disabled={isLoading}
                            />
                        </div>
                    </form>
                </FormProvider>
            </div>
            {isLoading && (
                <div className='flex justify-between items-center'>
                    <FullScreenLoader />
                </div>
            )}
        </Modal>
    )
}

export default CandidateApplicationForm
