import capitalize from "../utils/capitalize"
import { useAuthStore, useElectionStore } from "../stores"
import Button from "./Button"
import { useState } from "react"
import { toast } from "react-hot-toast"
import CandidateApplicationWithdrawDialog from "./CandidateApplicationWithdrawDialog"
import api from "../api/api"
import generateInitialAvatar from "../utils/generateInitialAvatar"

const nomineeFields = ["nominee1_name", "nominee2_name"]

const electionFields = [
    "election_name",
    "nomination_start",
    "nomination_end",
    "voting_start"
]

const applicationFields = [
    "status",
    "actioned_by_name",
    "rejection_reason",
    "created_at",
    "updated_at"
]

const personalFields = [
    "admno",
    "department",
    "class",
    "semester",
    "batch",
    "category",
    "email",
    "phone"
]

const labels = {
    actioned_by_name: "Reviewed By",
    class: "Class",
    created_at: "Submitted On",
    department: "Department",
    nominee1_name: "Nominee 1",
    nominee2_name: "Nominee 2",
    category: "Category",
    rejection_reason: "Rejection Reason",
    semester: "Semester",
    status: "Status",
    updated_at: "Reviewed On",
    admno: "Admission Number",
    email: "Email",
    phone: "Phone",
    batch: "Batch",
    election_name: "Election",
    nomination_start: "Nomination Start",
    nomination_end: "Nomination End",
    voting_start: "Voting Start"
}

const statusStyles = {
    Pending:
        "bg-yellow-400/40 dark:bg-yellow-400/20 text-yellow-600 dark:text-yellow-400 ring-1 ring-yellow-400/30 inline-block px-3 py-1 rounded-xl text-xs font-medium",
    Approved:
        "bg-green-400/30 dark:bg-green-400/20 text-green-500 dark:text-green-400 ring-1 ring-green-400/30 inline-block px-3 py-1 rounded-xl text-xs font-medium",
    Rejected:
        "bg-red-400/40 dark:bg-red-400/20 text-red-600 dark:text-red-400 ring-1 ring-red-400/30 inline-block px-3 py-1 rounded-xl text-xs font-medium"
}

const formatDate = (value) =>
    new Date(value)
        .toLocaleString("en-IN", {
            dateStyle: "medium",
            timeStyle: "short"
        })
        .replace(/\b(am|pm)\b/, (m) => m.toUpperCase())

const formatValue = (field, value) => {
    if (!value) return null

    if (field === "status" || field === "category") return capitalize(value)
    if (
        field === "created_at" ||
        field === "updated_at" ||
        field === "nomination_start" ||
        field === "nomination_end" ||
        field === "voting_start"
    ) {
        return formatDate(value)
    }
    return value
}

const shouldShowField = (field, candidate) => {
    if (candidate.status === "pending") {
        if (field === "actioned_by") return false
        if (field === "rejection_reason") return false
        if (field === "updated_at") return false
    }

    return true
}

const UserCandidateApplication = ({
    candidate,
    setCandidateApplication,
    setIsApplicationSubmitted
}) => {
    const [showConfirmDialog, setShowConfirmDialog] = useState(false)
    const [password, setPassword] = useState("")
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    const { user } = useAuthStore()
    const { election } = useElectionStore()

    const displayDetails = {
        ...candidate,
        admno: user.admno,
        email: user.email,
        phone: user.phone,
        batch: user.batch
    }

    const visibleApplicationFields = applicationFields.filter((field) => {
        if (!shouldShowField(field, candidate)) return false

        const value = formatValue(field, displayDetails[field])
        return Boolean(value)
    })

    const showWithdrawButton =
        candidate.status !== "rejected" && election?.status === "nominations"

    const handleWithdraw = async () => {
        if (!password) return setError("Password is required")

        if (password.length < 8) return setError("At least 8 characters")

        setError(null)

        try {
            setIsLoading(true)
            const res = await api.patch(
                `/candidates/${candidate.id}/withdraw`,
                {
                    password,
                    election_id: candidate.election_id
                }
            )

            if (res.status === 200) {
                toast.success(res.data.message, {
                    id: "application-withdraw-success"
                })
                setShowConfirmDialog(false)
                setCandidateApplication(null)
                setIsApplicationSubmitted({
                    submitted: true,
                    status: "withdrawn"
                })
            }
        } catch (err) {
            toast.error(
                err.response?.data?.error ||
                    "Failed to withdraw application. Please try again.",
                { id: "application-withdraw-error" }
            )
        } finally {
            setIsLoading(false)
            setShowConfirmDialog(false)
        }
    }

    return (
        <>
            <div className='flex flex-col w-full px-4 py-6 rounded-md dark:bg-card-dark bg-card-light shadow-lg text-primary-light dark:text-primary-dark max-w-4xl'>
                <div className='flex flex-col gap-3 justify-center items-center'>
                    <img
                        src={
                            candidate?.profile_pic ??
                            generateInitialAvatar(candidate?.name)
                        }
                        alt={candidate?.name}
                        className='w-24 rounded-full'
                    />
                    <p className='text-xl font-bold'>{candidate?.name}</p>
                </div>
                <div className='grid grid-cols-[5fr_minmax(160px,1fr)] md:grid-cols-2 gap-y-6 md:gap-x-8 pt-8 px-3'>
                    <div className='contents md:grid md:grid-cols-[1fr_10rem] md:gap-y-2'>
                        <p className='font-semibold col-span-2'>
                            Personal Information
                        </p>
                        {personalFields.map((field, i) => {
                            if (!shouldShowField(field, candidate)) return null

                            const value = formatValue(
                                field,
                                displayDetails[field]
                            )
                            if (!value) return null

                            const isLast = i === personalFields.length - 1

                            return (
                                <div
                                    className='contents'
                                    key={field}
                                >
                                    <p
                                        className={`text-xs text-secondary-light dark:text-secondary-dark py-1.5 ${
                                            !isLast &&
                                            "border-b border-b-gray-400/40"
                                        }`}
                                    >
                                        {labels[field]}
                                    </p>
                                    <p
                                        className={`text-sm text-primary-light dark:text-primary-dark py-1.5 break-all ${
                                            !isLast &&
                                            "border-b border-b-gray-400/40"
                                        }`}
                                    >
                                        {value}
                                    </p>
                                </div>
                            )
                        })}
                    </div>
                    <div className='contents md:hidden'>
                        <p className='font-semibold col-span-2'>
                            Election Details
                        </p>
                        {electionFields.map((field, i) => {
                            if (!shouldShowField(field, candidate)) return null

                            const value = formatValue(
                                field,
                                displayDetails[field]
                            )
                            if (!value) return null

                            const isLast = i === electionFields.length - 1

                            return (
                                <div
                                    className='contents'
                                    key={field}
                                >
                                    <p
                                        className={`text-xs text-secondary-light dark:text-secondary-dark py-1.5 ${
                                            !isLast &&
                                            "border-b border-b-gray-400/40"
                                        }`}
                                    >
                                        {labels[field]}
                                    </p>
                                    <p
                                        className={`text-sm text-primary-light dark:text-primary-dark py-1.5 break-all ${
                                            !isLast &&
                                            "border-b border-b-gray-400/40"
                                        }`}
                                    >
                                        {value}
                                    </p>
                                </div>
                            )
                        })}
                    </div>
                    <div className='contents md:hidden'>
                        <p className='font-semibold col-span-2'>Nominees</p>
                        {nomineeFields.map((field, i) => {
                            const isLast = i === nomineeFields.length - 1

                            return (
                                <div
                                    className='contents'
                                    key={field}
                                >
                                    <p
                                        className={`text-xs text-secondary-light dark:text-secondary-dark py-1.5 ${
                                            !isLast &&
                                            "border-b border-b-gray-400/40"
                                        }`}
                                    >
                                        {labels[field]}
                                    </p>
                                    <p
                                        className={`text-sm text-primary-light dark:text-primary-dark py-1.5 break-all ${
                                            !isLast &&
                                            "border-b border-b-gray-400/40"
                                        }`}
                                    >
                                        {displayDetails[field]}
                                    </p>
                                </div>
                            )
                        })}
                    </div>
                    <div className='flex flex-col gap-[17.9px] max-md:hidden'>
                        <div className='grid grid-cols-[1fr_12rem] gap-y-2'>
                            <p className='font-semibold col-span-2'>
                                Election Details
                            </p>
                            {electionFields.map((field, i) => {
                                if (!shouldShowField(field, candidate))
                                    return null

                                const value = formatValue(
                                    field,
                                    displayDetails[field]
                                )
                                if (!value) return null

                                const isLast = i === electionFields.length - 1

                                return (
                                    <div
                                        className='contents'
                                        key={field}
                                    >
                                        <p
                                            className={`text-xs text-secondary-light dark:text-secondary-dark py-1.5 ${
                                                !isLast &&
                                                "border-b border-b-gray-400/40"
                                            }`}
                                        >
                                            {labels[field]}
                                        </p>
                                        <p
                                            className={`text-sm text-primary-light dark:text-primary-dark py-1.5 break-all ${
                                                !isLast &&
                                                "border-b border-b-gray-400/40"
                                            }`}
                                        >
                                            {value}
                                        </p>
                                    </div>
                                )
                            })}
                        </div>
                        <div className='grid grid-cols-[1fr_12rem] gap-y-2'>
                            <p className='font-semibold col-span-2'>Nominees</p>
                            {nomineeFields.map((field, i) => {
                                const isLast = i === nomineeFields.length - 1

                                return (
                                    <div
                                        className='contents'
                                        key={field}
                                    >
                                        <p
                                            className={`text-xs text-secondary-light dark:text-secondary-dark py-1.5 ${
                                                !isLast &&
                                                "border-b border-b-gray-400/40"
                                            }`}
                                        >
                                            {labels[field]}
                                        </p>
                                        <p
                                            className={`text-sm text-primary-light dark:text-primary-dark py-1.5 break-all ${
                                                !isLast &&
                                                "border-b border-b-gray-400/40"
                                            }`}
                                        >
                                            {displayDetails[field]}
                                        </p>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                    <div className='contents md:grid md:grid-cols-[1fr_10rem] md:gap-y-2 md:col-span-2'>
                        <p className='font-semibold col-span-2'>
                            Application Status
                        </p>
                        {visibleApplicationFields.map((field, i) => {
                            const value = formatValue(
                                field,
                                displayDetails[field]
                            )

                            const isLast =
                                !showWithdrawButton &&
                                i === visibleApplicationFields.length - 1

                            return (
                                <div
                                    className='contents'
                                    key={field}
                                >
                                    <p
                                        className={`text-xs text-secondary-light dark:text-secondary-dark py-1.5 ${
                                            !isLast &&
                                            "border-b border-b-gray-400/40"
                                        }`}
                                    >
                                        {labels[field]}
                                    </p>
                                    <p
                                        className={`text-sm text-primary-light dark:text-primary-dark py-1.5 break-all ${
                                            !isLast &&
                                            "border-b border-b-gray-400/40"
                                        }`}
                                    >
                                        <span
                                            className={`${statusStyles[value]}`}
                                        >
                                            {value}
                                        </span>
                                    </p>
                                </div>
                            )
                        })}
                        {showWithdrawButton && (
                            <div className='contents'>
                                <p className='text-xs text-secondary-light dark:text-secondary-dark flex items-center py-1.5'>
                                    Withdraw Application
                                </p>
                                <p className='flex items-center py-1.5'>
                                    <Button
                                        text='Withdraw Application'
                                        className='w-40 h-9 text-sm bg-red-700 hover:bg-red-800'
                                        onClick={() => {
                                            setShowConfirmDialog(true)
                                            setError(null)
                                        }}
                                    />
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {showConfirmDialog && (
                <CandidateApplicationWithdrawDialog
                    isOpen={showConfirmDialog}
                    setIsOpen={setShowConfirmDialog}
                    handleWithdraw={handleWithdraw}
                    password={password}
                    setPassword={setPassword}
                    error={error}
                    isLoading={isLoading}
                />
            )}
        </>
    )
}

export default UserCandidateApplication
