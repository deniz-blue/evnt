import { defineLexiconConfig } from "@atcute/lex-cli";

export default defineLexiconConfig({
	files: ["src/**/*.ts"],
	outdir: "dist/",
	export: {
		outdir: "../lexicons/",
		clean: true,
	},
});
