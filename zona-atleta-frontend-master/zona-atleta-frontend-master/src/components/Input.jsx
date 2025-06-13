
function Input({
  className = '',
  value = '',
  onChange = () => { },
  placeholder = '',
  error = false,
  type = 'text',
  icon = <></>,
  disabled = false,
  reff,
  label = true,
  autoComplete = true
}) {
  return (
    <div className={className}>
      <div className="flex gap-8">
        {
          label
            ? <>
              <label
                className={`block text-gray-700 font-bold mb-2 ${error ? 'text-red-500' : ''}`} htmlFor={placeholder}
              >
                {placeholder}
                {
                  error
                    ? ' *'
                    : ''
                }
              </label>
            </>
            : <></>
        }
      </div>
      <div className="relative">
        {
          reff
            ? <input
              id={placeholder}
              className={`shadow appearance-none border rounded w-full py-3 px-5 text-gray-700 leading-tight focus:outline-red-400 focus:shadow-outline ${error ? 'border-red-500' : ''}`}
              value={value}
              onChange={onChange}
              type={type}
              placeholder={placeholder}
              disabled={disabled}
              autoComplete={autoComplete ? 'on' : 'off'}
              ref={reff}
            />
            : <input
              id={placeholder}
              className={`shadow appearance-none border rounded w-full py-3 px-5 text-gray-700 leading-tight focus:outline-red-400 focus:shadow-outline ${error ? 'border-red-500' : ''}`}
              value={value}
              onChange={onChange}
              type={type}
              placeholder={placeholder}
              disabled={disabled}
              autoComplete={autoComplete ? 'on' : 'off'}
            />
        }

        <div
          className={`w-min h-min bg-white px-2 block absolute right-2 top-0 bottom-0 m-auto *:fill-gray-700 ${error ? '*:fill-red-500' : ''}`}
        >
          {icon}
        </div>
      </div>
    </div>
  )
}

export default Input