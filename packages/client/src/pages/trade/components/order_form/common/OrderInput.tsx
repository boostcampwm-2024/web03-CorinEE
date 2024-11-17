type OrderInputProps = {
	label: string;
	value: string | undefined;
	onChange: (value: string) => void;
	placeholder?: string;
};

function OrderInput({ label, value, onChange, placeholder }: OrderInputProps) {
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

	return (
		<label className="flex flex-col gap-1">
			<span>{label}</span>
			<input
				className="w-full border-2 border-solid border-gray-300 rounded-md focus:outline-blue-500 p-1 hover:border-blue-300 transition-colors duration-200"
				type="text"
				value={value}
				onChange={handleChange}
				placeholder={placeholder}
				inputMode="decimal"
			/>
		</label>
	);
}

export default OrderInput;
