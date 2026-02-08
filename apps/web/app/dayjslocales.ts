import "dayjs";
const locales = import.meta.glob("../node_modules/dayjs/esm/locale/*.js", { eager: true });
console.log("Loaded " + Object.keys(locales).length + " locales");
