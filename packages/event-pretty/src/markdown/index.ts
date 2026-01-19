export const getClockEmoji = (time: string) => {
	const [hours, minutes] = time.split(":").map(Number);
	let hour12 = (hours ?? 0) % 12 || 12;
	const base = ((minutes ?? 0) >= 30) ? 0x1F55C : 0x1F550;
	return String.fromCodePoint(base + hour12 - 1);
};
