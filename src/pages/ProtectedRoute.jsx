import {
    Navigate,
    Outlet,
    useBlocker,
    useLocation,
    useMatches
} from "react-router-dom"
import {
    useAuthStore,
    useElectionStore,
    useModalStore,
    useNotificationStore,
    useTiedCandidatesStore
} from "../stores"
import Header from "../components/Header"
import ChangePasswordModal from "../components/ChangePasswordModal"
import { useEffect, useRef, useState } from "react"
import FullScreenLoader from "../components/FullScreenLoader"
import toast from "react-hot-toast"
import api from "../api/api"

const ProtectedRoute = () => {
    const [showChangePasswordModal, setShowChangePasswordModal] =
        useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [electionLoaded, setElectionLoaded] = useState(false)
    const [checkedIfSupervisor, setCheckedIfSupervisor] = useState(false)
    const [checkedTie, setCheckedTie] = useState(false)

    const { isAuthenticated, isUserLoaded, user, setRole } = useAuthStore()
    const { pathname } = useLocation()

    const matches = useMatches()
    const current = matches[matches.length - 1]

    const allowedRoles = current?.handle?.allowed

    const getTitle = (pathname) => {
        if (pathname.startsWith("/appeals/")) return "Appeal"

        const titles = {
            "/": "Dashboard",
            "/candidate-application": "Candidate Application",
            "/candidates": "Candidates",
            "/profile": "Profile",
            "/notifications": "Notifications",
            "/appeals": "Appeals",
            "/results": "Results",
            "/verify-voter": "Verify Voter",
            "/approve-applications": "Approve Applications",
            "/choose-supervisors": "Choose Supervisors",
            "/manage-election": "Manage Election",
            "/logs": "Audit Logs"
        }

        return titles[pathname]
    }

    const { election, setElection } = useElectionStore()
    const { setNotifications } = useNotificationStore()
    const { setTiedCandidatesData } = useTiedCandidatesStore()

    const isElectionScheduled = Object.keys(election).length > 0

    useEffect(() => {
        const fetchElection = async () => {
            try {
                setIsLoading(true)
                const res = await api.get("/elections")
                setElection(res.data)
            } catch (err) {
                toast.error(
                    err?.response?.data?.error || "Something went wrong!",
                    { id: "election-fetch-error" }
                )
            } finally {
                setIsLoading(false)
                setElectionLoaded(true)
            }
        }

        if (!isElectionScheduled && isAuthenticated) fetchElection()
    }, [setIsLoading, isElectionScheduled, setElection, isAuthenticated])

    useEffect(() => {
        const checkIfSupervisor = async () => {
            try {
                setIsLoading(true)
                const res = await api.get(
                    `/auth/me/check-role?election=${election.id}`
                )
                if (res.data.isSupervisor) setRole(res.data.effectiveRole)
            } catch (err) {
                toast.error(
                    err?.response?.data?.error || "Something went wrong!",
                    { id: "role-fetch-error" }
                )
            } finally {
                setCheckedIfSupervisor(true)
                setIsLoading(false)
            }
        }

        if (election.id && user?.role === "teacher" && isAuthenticated)
            checkIfSupervisor()
    }, [election.id, setRole, user?.role, isAuthenticated])

    useEffect(() => {
        if (
            !electionLoaded ||
            election?.status !== "post-voting" ||
            !user?.tutor_of
        )
            return

        const checkHasTie = async () => {
            try {
                setIsLoading(true)

                const res = await api.get(
                    `/elections/${election?.id}/classes/${user?.tutor_of}/tie-breaker`
                )

                setTiedCandidatesData(res.data)
            } catch (err) {
                toast.error(
                    err.response?.data?.error || "Something went wrong",
                    {
                        id: "tie-check-error"
                    }
                )
            } finally {
                setCheckedTie(true)
                setIsLoading(false)
            }
        }

        if (isAuthenticated) checkHasTie()
    }, [
        electionLoaded,
        election?.id,
        election?.status,
        setTiedCandidatesData,
        user?.tutor_of,
        isAuthenticated
    ])

    useEffect(() => {
        const fetchNotificaions = async () => {
            try {
                const res = await api.get("/notifications")
                setNotifications(res.data)
            } catch (err) {
                toast.error(
                    err?.response?.data?.error || "Something went wrong!",
                    { id: "notifications-fetch-error" }
                )
            }
        }

        if (isAuthenticated) fetchNotificaions()
    }, [setNotifications, isAuthenticated])

    // Block browser navigation when modals are open - close top modal on back press instead of navigating
    const stack = useModalStore((s) => s.stack)
    const requestCloseTopModal = useModalStore((s) => s.requestCloseTopModal)
    const blocker = useBlocker(stack.length > 0)
    const handledRef = useRef(false)

    useEffect(() => {
        // Clear blocker when all modals are closed
        if (stack.length === 0) {
            handledRef.current = false
            if (blocker.state === "blocked") {
                blocker.reset()
            }
            return
        }

        // Reset flag when navigation is not blocked
        if (blocker.state !== "blocked") {
            handledRef.current = false
            return
        }

        // Intercept back button: close top modal instead of navigating
        if (!handledRef.current) {
            handledRef.current = true
            requestCloseTopModal()

            // Reset blocker to allow next back press to be handled
            requestAnimationFrame(() => {
                blocker.reset()
            })
        }
    }, [blocker, stack.length, requestCloseTopModal])
    // -------------------------------------------------------------

    const INACTIVE_ALLOWED_ROUTES = [
        "/",
        "/notifications",
        "/profile",
        "/results"
    ]

    const ADMIN_EXTRA_ROUTES = ["/appeals", "/logs"]

    const isAllowedWhenInactive = (pathname) =>
        INACTIVE_ALLOWED_ROUTES.includes(pathname) ||
        (user?.role === "admin" &&
            ADMIN_EXTRA_ROUTES.some((r) => pathname.startsWith(r)))

    // CHECK IF THE USER HAVE AUTHORIZATION TO ACCESS THE PAGE
    const isUserAuthorized =
        !allowedRoles ||
        allowedRoles.includes(user?.role) ||
        (allowedRoles.includes("tutor") && user?.tutor_of !== null)

    if (
        !isUserLoaded ||
        (isAuthenticated &&
            ((!isElectionScheduled && !electionLoaded) ||
                (isElectionScheduled &&
                    election.id &&
                    user?.role === "teacher" &&
                    !checkedIfSupervisor) ||
                (isElectionScheduled &&
                    election.id &&
                    user?.tutor_of !== null &&
                    !checkedTie)))
    )
        return <FullScreenLoader />

    if (!isAuthenticated)
        return (
            <Navigate
                to='/login'
                replace
            />
        )

    if (
        !isElectionScheduled &&
        !isAllowedWhenInactive(pathname) &&
        electionLoaded
    ) {
        return (
            <Navigate
                to='/'
                replace
            />
        )
    }

    return (
        <div className='min-h-dvh w-full bg-bg-light dark:bg-bg-dark py-3 transition-all duration-100 flex flex-col'>
            {isUserAuthorized ? (
                <div className='flex flex-col py-3 px-4 flex-1 min-h-0'>
                    <Header
                        title={getTitle(pathname)}
                        setShowChangePasswordModal={setShowChangePasswordModal}
                    />
                    <div className='max-w-[1600px] mx-auto w-full flex flex-col flex-1 min-h-0'>
                        <Outlet context={{ isLoading, setIsLoading }} />
                    </div>
                    <ChangePasswordModal
                        isOpen={showChangePasswordModal}
                        setIsOpen={setShowChangePasswordModal}
                    />
                </div>
            ) : (
                <Navigate
                    to='/unauthorized'
                    replace
                />
            )}
            {isLoading && <FullScreenLoader />}
        </div>
    )
}

export default ProtectedRoute
