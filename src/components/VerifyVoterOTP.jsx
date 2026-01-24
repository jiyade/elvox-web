import { useEffect, useState } from "react"
import { CircularProgressbar, buildStyles } from "react-circular-progressbar"
import "react-circular-progressbar/dist/styles.css"

const VerifyVoterOTP = ({ otpData, nextStep }) => {
    const expiresAtMs = new Date(otpData.expiresAt).getTime()
    const issuedAtMs = new Date(otpData.issuedAt).getTime()

    const total = Math.ceil((expiresAtMs - issuedAtMs) / 1000)
    const initialTimeLeft = Math.max(
        0,
        Math.ceil((expiresAtMs - Date.now()) / 1000)
    )

    const [timeLeft, setTimeLeft] = useState(initialTimeLeft)
    const [percentage, setPercentage] = useState(
        (initialTimeLeft / total) * 100
    )

    useEffect(() => {
        let timeoutId

        const interval = setInterval(() => {
            const remainingMs = new Date(expiresAtMs) - Date.now()
            const remainingSec = Math.max(0, Math.ceil(remainingMs / 1000))

            setTimeLeft(remainingSec)
            setPercentage((remainingSec / total) * 100)

            if (remainingSec === 0) {
                clearInterval(interval)
                timeoutId = setTimeout(() => {
                    nextStep()
                }, 1000)
            }
        }, 1000)

        return () => {
            clearInterval(interval)
            if (timeoutId) clearTimeout(timeoutId)
        }
    }, [expiresAtMs, nextStep, total])

    useEffect(() => {
        const es = new EventSource(
            `${import.meta.env.VITE_API_URL}/elections/${otpData.electionId}/events/stream`,
            {
                withCredentials: true
            }
        )

        es.onmessage = (event) => {
            const data = JSON.parse(event.data)

            if (data.type === "otp-used" && data.admno === otpData.admno) {
                es.close()
                nextStep()
            }
        }

        es.onerror = () => {
            es.close()
        }

        return () => {
            es.close()
        }
    }, [otpData.admno, otpData.electionId, nextStep])

    return (
        <div className='flex flex-col items-center w-full gap-8 max-sm:px-6 max-sm:py-4'>
            <div className='flex flex-col items-center gap-6'>
                <p className='text-primary-light dark:text-primary-dark text-sm text-center select-none'>
                    Proceed to the voting system and enter this code
                </p>
                <h3 className='text-5xl text-accent font-semibold select-none'>
                    {otpData.otp}
                </h3>
            </div>
            <div className='flex w-24 select-none'>
                <CircularProgressbar
                    value={percentage}
                    text={`${timeLeft}s`}
                    strokeWidth={4}
                    counterClockwise
                    styles={buildStyles({
                        textColor: "var(--otp-text)",
                        pathColor: "var(--color-accent)",
                        trailColor: "var(--otp-trail)"
                    })}
                />
            </div>
        </div>
    )
}

export default VerifyVoterOTP
