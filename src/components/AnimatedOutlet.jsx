import { Outlet, useLocation, useOutletContext } from "react-router-dom"
import { motion as Motion } from "framer-motion"

export default function AnimatedOutlet() {
    const location = useLocation()
    const context = useOutletContext()

    return (
        <Motion.div
            key={location.pathname}
            className='flex flex-col flex-1 min-h-0'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
        >
            <Outlet context={context} />
        </Motion.div>
    )
}
