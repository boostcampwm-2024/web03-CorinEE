type OrderInputProps = {
	label: string;
	value: string | undefined;
	onChange: (value: string) => void;
	placeholder?: string;
	errorMessage?: string;
};

function OrderInput({
	label,
	value,
	onChange,
	placeholder,
	errorMessage,
}: OrderInputProps) {
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newValue = e.target.value;
		if (newValue.startsWith('.')) {
			const numericValue = `0${newValue}`;
			onChange(numericValue);
			return;
		}
		const numericValue = newValue.replace(/[^\d.]/g, '');
		const dots = numericValue.split('.').length - 1;
		if (dots > 1) return;
		onChange(numericValue);
	};

	const inputClasses = [
		'w-full',
		'border-2',
		'border-solid',
		'rounded-md',
		'p-1',
		'transition-colors',
		'duration-200',
		errorMessage
			? ['border-red-500', 'focus:outline-red-500']
			: ['border-gray-300', 'focus:outline-blue-500', 'hover:border-blue-300'],
	]
		.flat()
		.join(' ');

	return (
		<label className="flex flex-col gap-1">
			<span>{label}</span>
			<input
				className={inputClasses}
				type="text"
				value={value}
				onChange={handleChange}
				placeholder={placeholder}
				inputMode="decimal"
			/>
			{errorMessage ? (
				<span className="text-sm text-red-500">{errorMessage}</span>
			) : null}
		</label>
	);
}

export default OrderInput;
