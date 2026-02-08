// Load all dayjs locales eagerly so that they are available when needed. This is necessary because the app allows users to select their preferred locale, and we want to ensure that all locales are available without needing to load them on demand, which could cause delays or issues if the user selects a locale that hasn't been loaded yet.
import locales from "dayjs/locale.json";

for (const locale of locales) {
	await import(/* @vite-ignore */ `dayjs/locale/${locale}`);
}
