export function formatUserName(username: string) {
	if (username.startsWith('guest_')) {
		const shortId = username.slice(6, 9);
		return `Guest_${shortId}`;
	}
	return username;
}
