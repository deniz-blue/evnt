import encodeQR, { type QrOpts } from "qr";

// Code taken from tools.deniz.blue/qrcode

const bitmapSvgPath = (data: boolean[][]) => {
	let prev = { x: 0, y: 0 };
	let commands = [];
	for (let _y in data) {
		let y = Number(_y);
		for (let _x in data) {
			let x = Number(_x);

			if (!data[x]?.[y]) continue;

			// Determine the shortest way to represent the initial cursor movement.
			// M - Move cursor (without drawing) to absolute coordinate pair.
			let m = `M${x} ${y}`;
			// Only allow using the relative cursor move command if previous points
			// were drawn.
			if (prev) {
				// m - Move cursor (without drawing) to relative coordinate pair.
				const relM = `m${x - prev.x} ${y - prev.y}`;
				if (relM.length <= m.length) m = relM;
			}

			// Determine the shortest way to represent the cell's bottom line draw.
			// H - Draw line from cursor position to absolute x coordinate.
			// h - Draw line from cursor position to relative x coordinate.
			const bH = x < 10 ? `H${x}` : 'h-1';

			// v - Draw line from cursor position to relative y coordinate.
			// Z - Close path (draws line from cursor position to M coordinate).
			commands.push(`${m}h1v1${bH}Z`);
			prev = { x, y };
		}
	}
	return commands.join(" ");
};

/**
 * @param text Text
 * @param opts qr options
 * @returns data: URL of the image
 */
export const createQRCode = (text: string, opts?: QrOpts & {
	foreground?: string;
	background?: string;
	desiredSize?: number;
}) => {
	const raw = encodeQR(text, "raw", opts);
	const rawSize = raw.length;
	const sourcePath = `<path fill="${opts?.foreground || "#000000"}" d="${bitmapSvgPath(raw)}" />`;
	const sourceBg = `<rect width="100%" height="100%" fill="${opts?.background || "#ffffff"}" />`;
	const source = `<svg viewBox="0 0 ${rawSize} ${rawSize}" width="${opts?.desiredSize || (rawSize + "px")}" height="${opts?.desiredSize || (rawSize + "px")}" xmlns="http://www.w3.org/2000/svg">${sourceBg}${sourcePath}</svg>`;
	const uri = `data:image/svg+xml,${encodeURIComponent(source)}`;
	return uri;
};

export const QRCode = ({ value }: { value: string }) => {
	const qrCodeSrc = createQRCode(value, {
		desiredSize: 128,
	});
	return (
		<img
			src={qrCodeSrc}
			alt={value}
			style={{
				imageRendering: "pixelated",
				width: "100%",
				height: "auto",
			}}
		/>
	);
};
