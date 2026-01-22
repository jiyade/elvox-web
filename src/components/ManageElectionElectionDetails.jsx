import capitalize from "../utils/capitalize"
import { useElectionStore } from "../stores"
import Button from "./Button"
import Countdown from "./Countdown"
import DateAndTimeDisplay from "./DateAndTimeDisplay"

const ManageElectionElectionDetails = ({ setShowEditElectionModal }) => {
    const { election } = useElectionStore()

    return (
        <div className='flex flex-col w-full gap-2 px-4 py-4 rounded-md border border-gray-500 shadow-lg transition-all duration-100'>
            <div className='flex max-sm:flex-col items-start sm:items-center sm:justify-between gap-3'>
                <div className='flex items-center gap-3 max-sm:contents'>
                    <h2 className='text-lg font-bold text-primary-light dark:text-primary-dark'>
                        {election?.name}
                    </h2>

                    <div className='flex flex-col gap-2 items-start sm:contents'>
                        <p className='bg-yellow-400/40 dark:bg-yellow-400/20 text-yellow-600 dark:text-yellow-400 ring-1 ring-yellow-400/30 inline-block px-3 py-1 rounded-xl text-xs font-medium'>
                            {capitalize(election?.status)}
                        </p>
                        <Countdown className='sm:hidden' />
                    </div>
                </div>
                <Countdown className='max-sm:hidden' />
            </div>
            <div className='grid grid-cols-2 md:grid-cols-3 gap-5 md:gap-x-10 py-3 text-primary-light dark:text-primary-dark'>
                <div className='flex flex-col gap-2'>
                    <p>Election Start</p>
                    <DateAndTimeDisplay timestamp={election?.election_start} />
                </div>
                <div className='flex flex-col gap-2'>
                    <p>Nomination Start</p>
                    <DateAndTimeDisplay
                        timestamp={election?.nomination_start}
                    />
                </div>
                <div className='flex flex-col gap-2'>
                    <p>Nomination End</p>
                    <DateAndTimeDisplay timestamp={election?.nomination_end} />
                </div>
                <div className='flex flex-col gap-2'>
                    <p>Voting Start</p>
                    <DateAndTimeDisplay timestamp={election?.voting_start} />
                </div>
                <div className='flex flex-col gap-2'>
                    <p>Voting End</p>
                    <DateAndTimeDisplay timestamp={election?.voting_end} />
                </div>
                <div className='flex flex-col gap-2'>
                    <p>Election End</p>
                    <DateAndTimeDisplay timestamp={election?.election_end} />
                </div>
            </div>
            <div className='flex flex-col gap-2 self-end mt-2'>
                <Button
                    text='Edit Election Details'
                    className='py-2 px-4 text-sm bg-accent hover:bg-button-hover'
                    onClick={() => {
                        setShowEditElectionModal(true)
                    }}
                />
            </div>
        </div>
    )
}

export default ManageElectionElectionDetails
