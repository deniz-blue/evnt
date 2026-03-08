import { decode } from "blurhash";

export interface BlurhashProps {
	hash: string;
	w?: number;
	h?: number;
	punch?: number;
}

export const Blurhash = ({
	hash,
	w = 128,
	h = 128,
	punch,
}: BlurhashProps) => {
	return (
		<canvas
			width={w}
			height={h}
			style={{ width: "100%", height: "100%" }}
			ref={(canvas) => {
				if (!canvas) return;
				const ctx = canvas.getContext("2d");
				if (!ctx) return;
				const pixels = decode(hash, w, h, punch);
				const imageData = new ImageData(w, h);
				imageData.data.set(pixels);
				ctx.putImageData(imageData, 0, 0);
				return () => { };
			}}
		/>
	);
};
