function Checkbox({ checked, onChange, label, disabled = false }) {
    return (
        <label className='flex items-center gap-2 cursor-pointer select-none'>
            <input
                type='checkbox'
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
                disabled={disabled}
                className='sr-only'
            />

            <div
                className={`h-4 w-4 rounded border flex items-center justify-center
          ${checked ? "border-[#765ac1] bg-[#765ac1]" : "border-gray-400 bg-white"}
          ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        `}
            >
                {checked && (
                    <svg
                        viewBox='0 0 24 24'
                        className='h-3 w-3 text-white'
                        fill='none'
                        stroke='currentColor'
                        strokeWidth='3'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                    >
                        <polyline points='20 6 9 17 4 12' />
                    </svg>
                )}
            </div>

            {label && (
                <span className='text-sm text-secondary-light dark:text-secondary-dark'>
                    {label}
                </span>
            )}
        </label>
    )
}

export default Checkbox
