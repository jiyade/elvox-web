import { useFormContext, Controller } from "react-hook-form"
import DatePicker from "./DatePicker"
import TimePicker from "./TimePicker"
import InfoTooltip from "./InfoTooltip"

const DISABLED_MESSAGES = {
    nominationStart:
        "Nomination start date and time can only be edited while the election is in Draft",

    nominationEnd:
        "Nomination end date and time can only be edited during Draft or Nominations",

    votingStart:
        "Voting start date and time can only be edited before voting begins",

    votingEnd:
        "Voting end date and time can only be edited before voting finishes",

    electionEnd:
        "Election end date and time can only be edited before the election is closed."
}

const CreateElectionFormTimeline = ({ disabled }) => {
    const {
        control,
        watch,
        formState: { errors }
    } = useFormContext()

    const [ns, ne, vs, ve] = watch([
        "nominationStartDate",
        "nominationEndDate",
        "votingStartDate",
        "votingEndDate"
    ])

    return (
        <div className='flex flex-col gap-2'>
            <h3 className='text-base font-semibold'>Timeline</h3>
            <div className='grid md:grid-cols-2 gap-2 md:gap-4'>
                <div className='flex flex-col gap-2'>
                    <div className='flex gap-2 items-center'>
                        <p>
                            Nomination Start{" "}
                            <span className='text-red-500'>*</span>
                        </p>
                        {disabled.nominationStart && (
                            <InfoTooltip
                                message={DISABLED_MESSAGES["nominationStart"]}
                            />
                        )}
                    </div>
                    <div className='flex gap-2'>
                        <div className='flex flex-col gap-1 flex-1'>
                            <Controller
                                name='nominationStartDate'
                                control={control}
                                disabled={disabled.nominationStart}
                                rules={{
                                    required:
                                        "Nomination start date is required"
                                }}
                                render={({ field }) => (
                                    <DatePicker
                                        value={field.value}
                                        onChange={field.onChange}
                                        disabled={disabled.nominationStart}
                                        disabledDate={{ before: new Date() }}
                                    />
                                )}
                            />
                            {errors?.nominationStartDate && (
                                <p className='text-xs text-red-500 mt-1 font-medium'>
                                    {errors?.nominationStartDate?.message}
                                </p>
                            )}
                        </div>
                        <div className='flex flex-col gap-1 flex-1'>
                            <Controller
                                name='nominationStartTime'
                                control={control}
                                disabled={disabled.nominationStart}
                                rules={{
                                    required:
                                        "Nomination start time is required"
                                }}
                                render={({ field }) => (
                                    <TimePicker
                                        value={field.value}
                                        onChange={field.onChange}
                                        disabled={disabled.nominationStart}
                                    />
                                )}
                            />
                            {errors?.nominationStartTime && (
                                <p className='text-xs text-red-500 mt-1 font-medium'>
                                    {errors?.nominationStartTime?.message}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
                <div className='flex flex-col gap-2'>
                    <div className='flex gap-2 items-center'>
                        <p>
                            Nomination End{" "}
                            <span className='text-red-500'>*</span>
                        </p>
                        {disabled.nominationEnd && (
                            <InfoTooltip
                                message={DISABLED_MESSAGES["nominationEnd"]}
                            />
                        )}
                    </div>
                    <div className='flex gap-2'>
                        <div className='flex flex-col gap-1 flex-1'>
                            <Controller
                                name='nominationEndDate'
                                control={control}
                                disabled={disabled.nominationEnd}
                                rules={{
                                    required: "Nomination end date is required"
                                }}
                                render={({ field }) => (
                                    <DatePicker
                                        value={field.value}
                                        onChange={field.onChange}
                                        disabled={disabled.nominationEnd}
                                        disabledDate={{
                                            before: new Date(
                                                Math.max(
                                                    new Date(ns),
                                                    new Date()
                                                )
                                            )
                                        }}
                                    />
                                )}
                            />
                            {errors?.nominationEndDate && (
                                <p className='text-xs text-red-500 mt-1 font-medium'>
                                    {errors?.nominationEndDate?.message}
                                </p>
                            )}
                        </div>
                        <div className='flex flex-col gap-1 flex-1'>
                            <Controller
                                name='nominationEndTime'
                                control={control}
                                disabled={disabled.nominationEnd}
                                rules={{
                                    required: "Nomination end time is required"
                                }}
                                render={({ field }) => (
                                    <TimePicker
                                        value={field.value}
                                        onChange={field.onChange}
                                        disabled={disabled.nominationEnd}
                                    />
                                )}
                            />
                            {errors?.nominationEndTime && (
                                <p className='text-xs text-red-500 mt-1 font-medium'>
                                    {errors?.nominationEndTime?.message}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
                <div className='flex flex-col gap-2'>
                    <div className='flex gap-2 items-center'>
                        <p>
                            Voting Start <span className='text-red-500'>*</span>
                        </p>
                        {disabled.votingStart && (
                            <InfoTooltip
                                message={DISABLED_MESSAGES["votingStart"]}
                            />
                        )}
                    </div>
                    <div className='flex gap-2'>
                        <div className='flex flex-col gap-1 flex-1'>
                            <Controller
                                name='votingStartDate'
                                control={control}
                                disabled={disabled.votingStart}
                                rules={{
                                    required: "Voting start date is required"
                                }}
                                render={({ field }) => (
                                    <DatePicker
                                        value={field.value}
                                        onChange={field.onChange}
                                        disabled={disabled.votingStart}
                                        disabledDate={{
                                            before: new Date(
                                                Math.max(
                                                    new Date(ne),
                                                    new Date()
                                                )
                                            )
                                        }}
                                    />
                                )}
                            />
                            {errors?.votingStartDate && (
                                <p className='text-xs text-red-500 mt-1 font-medium'>
                                    {errors?.votingStartDate?.message}
                                </p>
                            )}
                        </div>
                        <div className='flex flex-col gap-1 flex-1'>
                            <Controller
                                name='votingStartTime'
                                control={control}
                                disabled={disabled.votingStart}
                                rules={{
                                    required: "Voting start time is required"
                                }}
                                render={({ field }) => (
                                    <TimePicker
                                        value={field.value}
                                        onChange={field.onChange}
                                        disabled={disabled.votingStart}
                                    />
                                )}
                            />
                            {errors?.votingStartTime && (
                                <p className='text-xs text-red-500 mt-1 font-medium'>
                                    {errors?.votingStartTime?.message}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
                <div className='flex flex-col gap-2'>
                    <div className='flex gap-2 items-center'>
                        <p>
                            Voting End <span className='text-red-500'>*</span>
                        </p>
                        {disabled.votingEnd && (
                            <InfoTooltip
                                message={DISABLED_MESSAGES["votingEnd"]}
                            />
                        )}
                    </div>
                    <div className='flex gap-2'>
                        <div className='flex flex-col gap-1 flex-1'>
                            <Controller
                                name='votingEndDate'
                                control={control}
                                disabled={disabled.votingEnd}
                                rules={{
                                    required: "Voting end date is required"
                                }}
                                render={({ field }) => (
                                    <DatePicker
                                        value={field.value}
                                        onChange={field.onChange}
                                        disabled={disabled.votingEnd}
                                        disabledDate={{
                                            before: new Date(
                                                Math.max(
                                                    new Date(vs),
                                                    new Date()
                                                )
                                            )
                                        }}
                                    />
                                )}
                            />
                            {errors?.votingEndDate && (
                                <p className='text-xs text-red-500 mt-1 font-medium'>
                                    {errors?.votingEndDate?.message}
                                </p>
                            )}
                        </div>
                        <div className='flex flex-col gap-1 flex-1'>
                            <Controller
                                name='votingEndTime'
                                control={control}
                                disabled={disabled.votingEnd}
                                rules={{
                                    required: "Voting end time is required"
                                }}
                                render={({ field }) => (
                                    <TimePicker
                                        value={field.value}
                                        onChange={field.onChange}
                                        disabled={disabled.votingEnd}
                                    />
                                )}
                            />
                            {errors?.votingEndTime && (
                                <p className='text-xs text-red-500 mt-1 font-medium'>
                                    {errors?.votingEndTime?.message}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
                <div className='flex flex-col gap-2 md:col-span-2'>
                    <div className='flex gap-2 items-center'>
                        <p>
                            Election End <span className='text-red-500'>*</span>
                        </p>
                        {disabled.electionEnd && (
                            <InfoTooltip
                                message={DISABLED_MESSAGES["electionEnd"]}
                            />
                        )}
                    </div>
                    <div className='flex gap-2'>
                        <div className='flex flex-col gap-1 flex-1'>
                            <Controller
                                name='electionEndDate'
                                control={control}
                                disabled={disabled.electionEnd}
                                rules={{
                                    required: "Election end date is required"
                                }}
                                render={({ field }) => (
                                    <DatePicker
                                        value={field.value}
                                        onChange={field.onChange}
                                        disabled={disabled.electionEnd}
                                        disabledDate={{
                                            before: new Date(
                                                Math.max(
                                                    new Date(ve),
                                                    new Date()
                                                )
                                            )
                                        }}
                                    />
                                )}
                            />
                            {errors?.electionEndDate && (
                                <p className='text-xs text-red-500 mt-1 font-medium'>
                                    {errors?.electionEndDate?.message}
                                </p>
                            )}
                        </div>
                        <div className='flex flex-col gap-1 flex-1'>
                            <Controller
                                name='electionEndTime'
                                control={control}
                                disabled={disabled.electionEnd}
                                rules={{
                                    required: "Election end time is required"
                                }}
                                render={({ field }) => (
                                    <TimePicker
                                        value={field.value}
                                        onChange={field.onChange}
                                        disabled={disabled.electionEnd}
                                    />
                                )}
                            />
                            {errors?.electionEndTime && (
                                <p className='text-xs text-red-500 mt-1 font-medium'>
                                    {errors?.electionEndTime?.message}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CreateElectionFormTimeline
