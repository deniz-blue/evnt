import { readdirSync, writeFileSync, readFileSync } from "node:fs";

const vendors: string[] = readdirSync(new URL("../src/vendor", import.meta.url));

console.log("Found", vendors.length, "vendors");

const packagejson = JSON.parse(
	readFileSync(new URL("../package.json", import.meta.url), "utf-8")
);

packagejson.exports = {
	".": "./src/index.ts",
};
for (const vendor of vendors) {
	const vendorName = vendor.replace(/\.ts$/, "");
	packagejson.exports[`./vendor/${vendorName}`] = `./src/vendor/${vendorName}/index.ts`;
}

writeFileSync(new URL("../package.json", import.meta.url), JSON.stringify(packagejson, null, 2));

console.log("Updated package.json exports");

writeFileSync(
	new URL("../src/index.ts", import.meta.url),
	vendors
		.map((vendor) => {
			const vendorName = vendor.replace(/\.ts$/, "");
			return `export * as ${vendorName.replaceAll("-", "_")} from "./vendor/${vendorName}";`;
		})
		.join("\n")
);
console.log("Regenerated src/index.ts");
