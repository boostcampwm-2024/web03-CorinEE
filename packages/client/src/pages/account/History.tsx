import { useMyHistory } from '@/hooks/useMyHistory';


function History() {
	const histories = useMyHistory()

	console.log(histories)

	return <div>History</div>;
}

export default History;
