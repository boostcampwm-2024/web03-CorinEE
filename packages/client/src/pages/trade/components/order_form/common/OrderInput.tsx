type OrderInputProps = {
	label: string;
	value: number;
	onChange: (value: number) => void;
	placeholder?: string;
};

function OrderInput({ label, value, onChange, placeholder }: OrderInputProps) {
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const numericValue = e.target.value.replace(/[^\d]/g, '');

		if (numericValue === '') {
			onChange(0);
			return;
		}
		onChange(Number(numericValue));
	};

	return (
		<label className="flex flex-col gap-1">
			<span>{label}</span>
			<input
				className="w-full border-2 border-solid border-gray-300 rounded-md focus:outline-blue-500 p-1  hover:border-blue-300 transition-colors duration-200"
				type="text"
				value={value.toLocaleString()}
				onChange={handleChange}
				placeholder={placeholder}
				inputMode="numeric"
			/>
		</label>
	);
}

export default OrderInput;
