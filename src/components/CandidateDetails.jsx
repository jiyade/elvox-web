import { useAuthStore } from "../stores"
import generateInitialAvatar from "../utils/generateInitialAvatar"

const fields = [
    "admno",
    "department",
    "class",
    "semester",
    "batch",
    "email",
    "phone"
]

const labels = {
    admno: "Admission Number",
    department: "Department",
    class: "Class",
    semester: "Semester",
    batch: "Batch",
    email: "Email",
    phone: "Phone"
}

const CandidateDetails = () => {
    const { user } = useAuthStore()

    return (
        <div className='flex justify-center sm:flex-1 border rounded-md border-gray-500 px-3 py-[18px] sm:overflow-y-scroll custom-scrollbar w-full text-primary-light dark:text-primary-dark'>
            <div className='flex flex-col gap-2 divide-y divide-gray-500 w-full break-words'>
                <div className='flex flex-col justify-center items-center gap-2 pb-2'>
                    <img
                        src={
                            user?.profile_pic ??
                            generateInitialAvatar(user?.name)
                        }
                        alt={user?.name}
                        className='rounded-full'
                        width={80}
                    />
                    <p className='text-center'>{user?.name}</p>
                </div>
                <div className='flex flex-col justify-center gap-2'>
                    {fields.map((field) => (
                        <div
                            className='flex flex-col gap-1'
                            key={field}
                        >
                            <p className='text-xs text-secondary-light dark:text-secondary-dark'>
                                {labels[field]}
                            </p>
                            <p className='text-sm text-primary-light dark:text-primary-dark'>
                                {field === "phone"
                                    ? `+91 ${user[field]}`
                                    : user[field]}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default CandidateDetails
