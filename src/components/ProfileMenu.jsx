import { LuUserRound, LuLogOut, LuLock } from "react-icons/lu"
import { useAuthStore } from "../stores"
import { Link } from "react-router-dom"
import { notifyMobileLogout } from "../utils/mobileBridge"

const ProfileMenu = ({
    profileMenuRef,
    setShowChangePasswordModal,
    setShowProfileMenu
}) => {
    const { user, logout } = useAuthStore()

    return (
        <div
            className='flex flex-col absolute right-0 top-full bg-card-light dark:bg-card-dark text-primary-light dark:text-primary-dark shadow-lg dark:shadow-bg-dark rounded-md w-56 mt-2 px-3 py-4 text-sm z-20'
            ref={profileMenuRef}
        >
            <div className='flex items-center gap-3 border-b pb-3'>
                <img
                    src={user?.profile_pic}
                    alt={user?.name}
                    width={64}
                    className='rounded-full'
                />
                <p className='font-medium text-base'>{user.name}</p>
            </div>
            <div className='flex flex-col pt-3 gap-2'>
                <Link to='/profile'>
                    <button
                        className='flex items-center gap-2 cursor-pointer'
                        onClick={() => setShowProfileMenu(false)}
                    >
                        <LuUserRound className='text-base' />
                        <p>Profile</p>
                    </button>
                </Link>
                <button
                    className='flex items-center gap-2 cursor-pointer'
                    onClick={() => {
                        setShowChangePasswordModal(true)
                        setShowProfileMenu(false)
                    }}
                >
                    <LuLock className='text-base' />
                    <p>Change Password</p>
                </button>
                <button
                    className='flex items-center gap-2 cursor-pointer'
                    onClick={() => {
                        setShowProfileMenu(false)
                        logout()
                        notifyMobileLogout()
                    }}
                >
                    <LuLogOut className='text-base' />
                    <p>Logout</p>
                </button>
            </div>
        </div>
    )
}

export default ProfileMenu
