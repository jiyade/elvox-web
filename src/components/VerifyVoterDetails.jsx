import Title from "./Title"
import Button from "./Button"
import { useState } from "react"
import FullScreenLoader from "./FullScreenLoader"

const VerifyVoterDetails = ({ student, verify, reset }) => {
    const [loaded, setLoaded] = useState(student.profile_pic ? false : true)

    const mapStudent = [
        ["Name", student.name],
        ["Admission Number", student.admno],
        ["Department", student.department],
        ["Class", student.class],
        ["Batch", student.batch],
        ["Semester", student.semester]
    ]

    return (
        <>
            <div className='flex flex-col w-full gap-8'>
                <Title
                    title='Verify Voter Details'
                    className='text-2xl '
                />
                <div className='flex max-sm:flex-col max-sm:justify-center items-center gap-10 sm:px-10'>
                    {student.profile_pic && (
                        <div className='flex'>
                            <img
                                src={student.profile_pic}
                                alt={student.name}
                                className='w-24 h-24 sm:w-30 sm:h-30 rounded-full'
                                onLoad={() => setLoaded(true)}
                            />
                        </div>
                    )}
                    <div className='flex flex-1 flex-col gap-2.5'>
                        {mapStudent.map(([label, value]) => (
                            <div
                                key={label}
                                className='grid grid-cols-2 gap-x-4 break-words text-sm'
                            >
                                <p className='text-secondary-light dark:text-secondary-dark'>
                                    {label}
                                </p>
                                <p className='text-primary-light dark:text-primary-dark'>
                                    {value}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className='flex flex-col gap-2.5'>
                    <div className='flex gap-4'>
                        <Button
                            text='Reset'
                            className='w-full h-11 text-sm px-2 bg-secondary-button-light dark:bg-secondary-button-dark hover:bg-secondary-button-hover-light dark:hover:bg-secondary-button-hover-dark'
                            type='button'
                            onClick={reset}
                        />
                        <Button
                            text='Verify & Generate OTP'
                            className='w-full h-11 text-sm px-2 bg-accent hover:bg-button-hover'
                            type='button'
                            onClick={verify}
                        />
                    </div>
                    <p className='text-secondary-light dark:text-secondary-dark text-xs sm:text-sm text-center'>
                        Generates a time-limited voting OTP. OTP can be
                        regenerated until the vote is cast
                    </p>
                </div>
            </div>
            {!loaded && <FullScreenLoader />}
        </>
    )
}

export default VerifyVoterDetails
