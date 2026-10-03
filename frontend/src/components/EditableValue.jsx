function EditableValue({
  className = '',
  isAdmin,
  onChange,
  value,
  variant = 'box',
}) {
  const inputClass =
    variant === 'plain'
      ? 'h-7 w-full rounded-sm border border-[#9f9f9f] bg-white px-1 text-center outline-none focus:border-[#001f70] focus:ring-1 focus:ring-[#001f70]'
      : 'h-[27px] w-full rounded-sm border border-[#9f9f9f] bg-white px-1 text-center text-sm outline-none focus:border-[#001f70] focus:ring-1 focus:ring-[#001f70]'

  if (isAdmin) {
    return (
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={`${inputClass} ${className}`}
        inputMode="numeric"
      />
    )
  }

  if (variant === 'plain') {
    return <span className={`font-semibold ${className}`}>{value}</span>
  }

  return (
    <div className={`h-[27px] rounded-sm border border-[#b9b9b9] bg-white px-1 text-center leading-[27px] ${className}`}>
      {value}
    </div>
  )
}

export default EditableValue
