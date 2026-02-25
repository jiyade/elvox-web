import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import { IoMdInformationCircleOutline } from "react-icons/io"
import { IoWarningOutline } from "react-icons/io5"
import { IoMdCheckmarkCircleOutline } from "react-icons/io"
import { FiXCircle } from "react-icons/fi"
import { FaRegCircleCheck } from "react-icons/fa6"
import api from "../api/api"
import toast from "react-hot-toast"

dayjs.extend(relativeTime)

const timeAgo = (date) => {
    return dayjs(date).fromNow()
}

const formatDateTime = (value) => dayjs(value).format("DD MMM YYYY, hh:mm A")

const Notification = ({
    notification,
    markRead,
    showDate = false,
    showUnread = false
}) => {
    const markNotificationRead = async (id) => {
        try {
            markRead(id)
            await api.patch(`/notifications/${id}/read`)
        } catch (err) {
            if (err.response)
                toast.error(
                    err.response?.data?.error || "Something went wrong!",
                    {
                        id: "mark-notification-read-error"
                    }
                )
        }
    }

    return (
        <div
            className={`flex items-center justify-between gap-3 p-3 rounded-md text-primary-light dark:text-primary-dark even:dark:bg-[#16171d] even:bg-[#c4c9d4] odd:dark:bg-bg-dark odd:bg-bg-light ${
                !notification.is_read && showUnread
                    ? "border-l-6 border-accent"
                    : ""
            }`}
        >
            <div className='flex items-center gap-3'>
                <div>
                    {notification?.type === "info" && (
                        <IoMdInformationCircleOutline className='text-blue-500 text-xl' />
                    )}
                    {notification?.type === "warning" && (
                        <IoWarningOutline className='text-yellow-300 text-xl' />
                    )}
                    {notification?.type === "success" && (
                        <IoMdCheckmarkCircleOutline className='text-green-500 text-xl' />
                    )}
                    {notification?.type === "error" && (
                        <FiXCircle className='text-red-500 text-xl' />
                    )}
                </div>
                <div className='flex flex-col gap-2'>
                    <p className='text-sm'>{notification?.message}</p>
                    <p className='text-xs text-secondary-light dark:text-secondary-dark'>
                        {showDate
                            ? formatDateTime(notification?.created_at)
                            : timeAgo(notification?.created_at)}
                    </p>
                </div>
            </div>
            {!notification.is_read && showUnread && (
                <div>
                    <FaRegCircleCheck
                        className='text-xl cursor-pointer hover:text-primary-dark hover:bg-accent hover:rounded-full active:scale-70 transition-all duration-200'
                        onClick={() => markNotificationRead(notification.id)}
                    />
                </div>
            )}
        </div>
    )
}

export default Notification
