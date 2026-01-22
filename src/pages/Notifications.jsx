import { useNotificationStore } from "../stores"
import Notification from "../components/Notification"
import NotificationFilterAndSort from "../components/NotificationFilterAndSort"
import { useEffect, useMemo, useState } from "react"
import api from "../api/api"
import toast from "react-hot-toast"
import { useOutletContext } from "react-router-dom"

const Notifications = () => {
    const [filter, setFilter] = useState("all")
    const [sort, setSort] = useState("latest")

    const { notifications, setNotifications, markRead } = useNotificationStore()

    const { isLoading, setIsLoading } = useOutletContext()

    const visibleNotifications = useMemo(() => {
        let list = [...notifications]

        // sort
        if (sort === "oldest") {
            list.sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
        } else if (sort === "latest") {
            list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        }

        // filter by type
        if (filter !== "all") {
            list = list.filter((l) => l.type.toLowerCase() === filter)
        }

        return list
    }, [notifications, filter, sort])

    useEffect(() => {
        const fetchNotificaions = async () => {
            try {
                setIsLoading(true)
                const res = await api.get("/notifications")
                setNotifications(res.data)
            } catch (err) {
                toast.error(
                    err?.response?.data?.error || "Something went wrong!",
                    { id: "notifications-fetch-error" }
                )
            } finally {
                setIsLoading(false)
            }
        }

        fetchNotificaions()
    }, [setNotifications, setIsLoading])

    if (isLoading) return null

    return (
        <div className='flex flex-col justify-center min-h-0 items-center px-2 md:px-5 lg:px-9 py-2 flex-1'>
            <title>Notifications</title>
            <div className='flex flex-col w-full gap-5 max-w-4xl flex-1 min-h-0'>
                {notifications?.length > 0 && (
                    <NotificationFilterAndSort
                        sort={sort}
                        setSort={setSort}
                        filter={filter}
                        setFilter={setFilter}
                    />
                )}
                {visibleNotifications?.length > 0 && (
                    <div className='flex flex-col flex-1 min-h-0 px-3 py-4 gap-8 rounded-md dark:bg-card-dark bg-card-light shadow-lg text-primary-light dark:text-primary-dark'>
                        <div className='flex flex-col gap-3 overflow-y-auto custom-scrollbar flex-[1_1_0px]'>
                            {visibleNotifications.map((notification) => (
                                <Notification
                                    key={notification.id}
                                    notification={notification}
                                    markRead={markRead}
                                    showDate
                                    showUnread
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
            {!visibleNotifications.length && (
                <div className='flex px-3 py-4 flex-1 items-center justify-center'>
                    <h2 className='text-center text-primary-light dark:text-primary-dark text-2xl md:text-3xl lg:text-4xl font-black'>
                        No Notifications To Show
                    </h2>
                </div>
            )}
        </div>
    )
}

export default Notifications
