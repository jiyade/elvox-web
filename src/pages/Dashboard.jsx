import ElectionDetails from "../components/ElectionDetails"
import DashboardOptionsStudent from "../components/DashboardOptionsStudent"
import DashboardOptionsTeacher from "../components/DashboardOptionsTeacher"
import NotificationAndResults from "../components/NotificationAndResults"
import DashboardOptionsSupervisor from "../components/DashboardOptionsSupervisor"
import DashboardOptionsAdmin from "../components/DashboardOptionsAdmin"
import {
    useAuthStore,
    useElectionStore,
    useTiedCandidatesStore
} from "../stores"
import NoActiveElectionAdminDashboard from "../components/NoActiveElectionAdminDashboard"
import { useOutletContext } from "react-router-dom"
import NoActiveElectionCommon from "../components/NoActiveElectionCommon"
import CreateElectionModal from "../components/CreateElectionModal"
import { useState } from "react"

const Dashboard = () => {
    const [showCreateElectionModal, setShowCreateElectionModal] =
        useState(false)

    const {
        user: { role }
    } = useAuthStore()

    const { isLoading } = useOutletContext()

    const dashboardOptions = {
        student: DashboardOptionsStudent,
        teacher: DashboardOptionsTeacher,
        supervisor: DashboardOptionsSupervisor,
        admin: DashboardOptionsAdmin
    }

    const DashboardOptions = dashboardOptions[role]

    const { election } = useElectionStore()
    const { tiedCandidatesData: hasTie } = useTiedCandidatesStore()

    const isElectionScheduled = Object.keys(election).length > 0

    return (
        <div className={`flex flex-col px-2 flex-1 py-5`}>
            <title>Dashboard</title>
            {!isLoading && (
                <div
                    className={`flex flex-col md:px-3 lg:px-7 text-sm flex-1 gap-6 sm:py-3`}
                >
                    {isElectionScheduled ? (
                        <>
                            <ElectionDetails />
                            <DashboardOptions hasTie={hasTie} />
                        </>
                    ) : role === "admin" ? (
                        <NoActiveElectionAdminDashboard
                            setShowCreateElectionModal={
                                setShowCreateElectionModal
                            }
                        />
                    ) : (
                        <NoActiveElectionCommon />
                    )}
                    <NotificationAndResults />
                </div>
            )}

            {showCreateElectionModal && (
                <CreateElectionModal
                    isOpen={showCreateElectionModal}
                    setIsOpen={setShowCreateElectionModal}
                />
            )}
        </div>
    )
}

export default Dashboard
