import { FaRegCalendar } from "react-icons/fa"

const formatDateParts = (value) => {
    const d = new Date(value)

    const date = d.toLocaleDateString("en-IN", {
        dateStyle: "medium"
    })

    const time = d
        .toLocaleTimeString("en-IN", {
            hour: "numeric",
            minute: "2-digit"
        })
        .replace(/\b(am|pm)\b/, (m) => m.toUpperCase())

    return { date, time }
}

const DateAndTimeDisplay = ({ timestamp }) => {
    const { date, time } = formatDateParts(timestamp)

    return (
        <p className='flex items-center flex-1 gap-2'>
            <FaRegCalendar className='text-accent' />
            <p className='flex max-sm:flex-col sm:gap-1 font-semibold'>
                <span>{date},</span>
                <span>{time}</span>
            </p>
        </p>
    )
}

export default DateAndTimeDisplay
