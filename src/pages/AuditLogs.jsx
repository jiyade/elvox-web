import { useEffect, useRef, useState } from "react"
import AuditLogsHeader from "../components/AuditLogsHeader"
import toast from "react-hot-toast"
import api from "../api/api"
import { useElectionStore } from "../stores"
import FullScreenLoader from "../components/FullScreenLoader"

const formatDate = (value) => {
    if (!value) return "—"
    return new Date(value).toLocaleString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
    })
}

const LIVE_SEPARATOR = {
    _type: "separator"
}

const AuditLogs = () => {
    const { election } = useElectionStore()

    const [electionId, setElectionId] = useState(election?.id)
    const [timeRange, setTimeRange] = useState("7d")
    const [elections, setElections] = useState([])
    const [logs, setLogs] = useState([])
    const [electionsLoading, setElectionsLoading] = useState(false)
    const [logsLoading, setLogsLoading] = useState(false)
    const [logMode, setLogMode] = useState("live")
    const [status, setStatus] = useState("disconnected")

    const logContainer = useRef(null)
    const sseRef = useRef(null)

    useEffect(() => {
        const fetchElections = async () => {
            try {
                setElectionsLoading(true)
                const res = await api.get("/elections/all")
                const electionsData = res.data

                setElections(electionsData)
                setElectionId(election?.id ?? electionsData[0]?.id)
            } catch (err) {
                if (err.response)
                    toast.error(err.response?.data?.error, {
                        id: "elections-fetch-error"
                    })
            } finally {
                setElectionsLoading(false)
            }
        }

        fetchElections()
    }, [election.id])

    useEffect(() => {
        if (!electionId) return

        const fetchLogs = async () => {
            try {
                setLogsLoading(true)
                const res = await api.get(
                    `/elections/${electionId}/logs?range=${electionId !== election?.id ? "all" : timeRange}`
                )

                setLogs(res.data)
            } catch (err) {
                if (err.response)
                    toast.error(err.response?.data?.error, {
                        id: "logs-fetch-error"
                    })
            } finally {
                setLogsLoading(false)
            }
        }

        fetchLogs()
    }, [electionId, logMode, timeRange, election?.id])

    useEffect(() => {
        if (!electionId || logsLoading || logMode !== "live") {
            setStatus("disconnected")
            return
        }

        // close existing before creating new one
        if (sseRef.current) {
            sseRef.current.close()
            sseRef.current = null
        }

        setStatus("connecting")

        const es = new EventSource(
            `${import.meta.env.VITE_API_URL}/elections/${electionId}/sse/logs`,
            {
                withCredentials: true
            }
        )

        sseRef.current = es

        es.onopen = () => {
            setStatus("connected")

            setLogs((prev) => {
                // don't add twice
                if (prev.some((l) => l._type === "separator")) return prev

                return [...prev, LIVE_SEPARATOR]
            })
        }

        es.onmessage = (e) => {
            const log = JSON.parse(e.data)
            setLogs((prev) => [...prev, log])
        }

        es.onerror = () => {
            setStatus("disconnected")
            es.close()
            sseRef.current = null
        }

        return () => {
            setStatus("disconnected")
            es.close()
            sseRef.current = null
        }
    }, [electionId, logMode, logsLoading])

    useEffect(() => {
        if (electionId !== election.id) {
            setLogMode("past")
            setTimeRange("all")
        } else {
            setLogMode("live")
            setTimeRange("7d")
        }
    }, [electionId, election.id, setLogMode, setTimeRange])

    useEffect(() => {
        if (logContainer.current && logs.length > 0) {
            logContainer.current.scrollTop = logContainer.current.scrollHeight
        }
    }, [elections, electionId, logs])

    return (
        <div className='flex flex-col px-2 flex-1 py-5'>
            <title>Audit Logs</title>
            <div className='flex flex-col md:px-3 lg:px-7 text-sm flex-1 gap-3 sm:py-3 text-primary-light dark:text-primary-dark'>
                {elections.length > 0 && (
                    <AuditLogsHeader
                        elections={elections.map((el) => {
                            return { value: el.id, label: el.name }
                        })}
                        electionId={electionId}
                        setElectionId={setElectionId}
                        timeRange={timeRange}
                        setTimeRange={setTimeRange}
                        logMode={logMode}
                        setLogMode={setLogMode}
                        sseRef={sseRef}
                        status={status}
                    />
                )}
                <div
                    className={`flex flex-col flex-[1_1_0px] gap-1.5 border border-gray-500 py-3 px-2 overflow-y-auto custom-scrollbar font-mono tabular-nums ${
                        electionId === election.id &&
                        logMode === "live" &&
                        !logsLoading &&
                        logs.length > 0
                            ? "pb-48"
                            : ""
                    }`}
                    ref={logContainer}
                >
                    {!logsLoading &&
                        logs.length > 0 &&
                        logs.map((log, index) => {
                            if (log?._type === "separator") {
                                return (
                                    <div
                                        key='live-separator'
                                        className='my-1 flex items-center gap-3 text-xs'
                                    >
                                        <div className='flex-1 h-[0.5px] bg-gray-500/70' />
                                        <span>
                                            {status === "connected"
                                                ? "Connected — showing live logs"
                                                : status === "connecting"
                                                  ? "Connecting to live logs…"
                                                  : "Disconnected — live updates paused"}
                                        </span>
                                        <div className='flex-1 h-[0.5px] bg-gray-500/70' />
                                    </div>
                                )
                            }

                            return (
                                <div
                                    key={log?.id ?? `log-${index}`}
                                    className='flex flex-col max-sm:gap-1 sm:grid sm:grid-cols-[auto_8ch_1fr]'
                                >
                                    <p className='text-secondary-light dark:text-secondary-dark pr-3'>
                                        [{formatDate(log?.created_at, true)}]
                                    </p>
                                    <div className='grid grid-cols-[8ch_1fr] max-sm:pl-8 sm:contents'>
                                        <p
                                            className={
                                                log?.level === "error"
                                                    ? "text-[#df0000] dark:text-red-500"
                                                    : log?.level === "warning"
                                                      ? "text-[#cb9100] dark:text-yellow-500"
                                                      : ""
                                            }
                                        >
                                            {log?.level?.toUpperCase()}
                                        </p>
                                        <p
                                            className={
                                                log?.level === "error"
                                                    ? "text-[#df0000] dark:text-red-500"
                                                    : log?.level === "warning"
                                                      ? "text-[#cb9100] dark:text-yellow-500"
                                                      : ""
                                            }
                                        >
                                            {log?.message}
                                        </p>
                                    </div>
                                </div>
                            )
                        })}
                    {logsLoading && !electionsLoading && (
                        <div className='flex items-center justify-center flex-1'>
                            <div className='w-5.5 h-5.5 border border-b-transparent dark:border-b-transparent border-accent dark:border-[#ab8cff] rounded-full inline-block loader' />
                        </div>
                    )}
                    {logs.length === 0 &&
                        !logsLoading &&
                        !electionsLoading &&
                        status !== "connecting" && (
                            <div className='flex justify-center items-center flex-1'>
                                <p className='text-base text-center text-primary-light dark:text-primary-dark'>
                                    {elections.length === 0
                                        ? "No elections found"
                                        : "There are no logs available for this election during this period"}
                                </p>
                            </div>
                        )}
                </div>
            </div>

            {electionsLoading && (
                <div className='flex justify-between items-center'>
                    <FullScreenLoader />
                </div>
            )}
        </div>
    )
}

export default AuditLogs
