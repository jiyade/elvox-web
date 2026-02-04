import { lazy, Suspense, useEffect, useState } from "react"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import FullScreenLoader from "./components/FullScreenLoader"
import useBlockImageAndLinkActions from "./hooks/useBlockImageAndLinkActions"
import { useThemeStore, useAuthStore } from "./stores"
import { Toaster } from "react-hot-toast"
import ProtectedRoute from "./pages/ProtectedRoute"

const SignUp = lazy(() => import("./pages/SignUp"))
const Login = lazy(() => import("./pages/Login"))
const Dashboard = lazy(() => import("./pages/Dashboard"))
const CandidateApplication = lazy(() => import("./pages/CandidateApplication"))
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"))
const Unauthorized = lazy(() => import("./pages/Unauthorized"))
const NotFound = lazy(() => import("./pages/NotFound"))
const ViewCandidates = lazy(() => import("./pages/ViewCandidates"))
const Profile = lazy(() => import("./pages/Profile"))
const Notifications = lazy(() => import("./pages/Notifications"))
const Appeals = lazy(() => import("./pages/Appeals"))
const AppealDetails = lazy(() => import("./pages/AppealDetails"))
const Results = lazy(() => import("./pages/Results"))
const ApproveApplications = lazy(() => import("./pages/ApproveApplications"))
const VerifyVoter = lazy(() => import("./pages/VerifyVoter"))
const ChooseSupervisors = lazy(() => import("./pages/ChooseSupervisors"))
const ManageElection = lazy(() => import("./pages/ManageElection"))
const AuditLogs = lazy(() => import("./pages/AuditLogs"))
const TieBreaker = lazy(() => import("./pages/TieBreaker"))

const ThemeToggle = ({ children }) => {
    const { theme } = useThemeStore()
    useEffect(() => {
        const root = window.document.documentElement
        if (theme === "dark") {
            root.classList.add("dark")
        } else {
            root.classList.remove("dark")
        }
    }, [theme])

    return children
}

const routes = [
    { path: "/login", element: <Login /> },
    { path: "/signup", element: <SignUp /> },
    { path: "/forgot-password", element: <ForgotPassword /> },
    {
        element: <ProtectedRoute />,
        children: [
            {
                path: "/",
                element: <Dashboard />
            },
            {
                path: "/candidate-application",
                element: <CandidateApplication />,
                handle: { allowed: ["student"] }
            },
            {
                path: "/candidates",
                element: <ViewCandidates />
            },
            {
                path: "/profile",
                element: <Profile />
            },
            {
                path: "/notifications",
                element: <Notifications />
            },
            {
                path: "/appeals",
                element: <Appeals />
            },
            {
                path: "/appeals/:id",
                element: <AppealDetails />
            },
            {
                path: "/results",
                element: <Results />
            },
            {
                path: "/verify-voter",
                element: <VerifyVoter />,
                handle: { allowed: ["supervisor"] }
            },
            {
                path: "/approve-applications",
                element: <ApproveApplications />,
                handle: { allowed: ["tutor"] }
            },
            {
                path: "/choose-supervisors",
                element: <ChooseSupervisors />,
                handle: { allowed: ["admin"] }
            },
            {
                path: "/manage-election",
                element: <ManageElection />,
                handle: { allowed: ["admin"] }
            },
            {
                path: "/logs",
                element: <AuditLogs />,
                handle: { allowed: ["admin"] }
            },
            {
                path: "/tie-break",
                element: <TieBreaker />,
                handle: { allowed: ["tutor"] }
            },
            {
                path: "/unauthorized",
                element: <Unauthorized />
            },
            {
                path: "*",
                element: <NotFound />
            }
        ]
    }
]

const router = createBrowserRouter(routes)

const App = () => {
    const [isLoading, setIsLoading] = useState(false)

    const { fetchMe } = useAuthStore()

    useBlockImageAndLinkActions() // Prevent image drag and link right-click

    useEffect(() => {
        fetchMe(setIsLoading)
    }, [fetchMe])

    return (
        <ThemeToggle>
            <Suspense fallback={<FullScreenLoader suspense />}>
                <Toaster
                    position='top-center'
                    toastOptions={{
                        className:
                            "text-center !bg-card-light dark:!bg-card-dark !text-primary-light dark:!text-primary-dark !shadow-xl !border !border-black/10 dark:!border-white/10",
                        duration: 3000,
                        removeDelay: 1000,
                        success: {
                            duration: 2500
                        }
                    }}
                />
                <RouterProvider router={router} />
                {isLoading && (
                    <div className='flex justify-between items-center'>
                        <FullScreenLoader />
                    </div>
                )}
            </Suspense>
        </ThemeToggle>
    )
}

export default App
