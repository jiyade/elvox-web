import { useEffect, useRef, useState } from "react"
import { CircularProgressbar, buildStyles } from "react-circular-progressbar"
import "react-circular-progressbar/dist/styles.css"

const VerifyVoterOTP = ({ otpData, nextStep }) => {
    const durationMs = otpData.expiresInMs

    const startedAtMs = useRef(Date.now())
    const endsAtMs =
        startedAtMs.current !== null ? startedAtMs.current + durationMs : null

    const [timeLeft, setTimeLeft] = useState(() => Math.ceil(durationMs / 1000))

    const [percentage, setPercentage] = useState(100)

    useEffect(() => {
        if (!endsAtMs) return

        let timeoutId

        const interval = setInterval(() => {
            const remainingMs = Math.max(0, endsAtMs - Date.now())

            setTimeLeft(Math.ceil(remainingMs / 1000))
            setPercentage((remainingMs / durationMs) * 100)

            if (remainingMs === 0) {
                clearInterval(interval)
                timeoutId = setTimeout(nextStep, 1000)
            }
        }, 1000)

        return () => {
            clearInterval(interval)
            if (timeoutId) clearTimeout(timeoutId)
        }
    }, [endsAtMs, nextStep, durationMs])

    useEffect(() => {
        startedAtMs.current = Date.now()
    }, [otpData])

    useEffect(() => {
        const es = new EventSource(
            `${import.meta.env.VITE_API_URL}/elections/${otpData.electionId}/sse/otp`,
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
