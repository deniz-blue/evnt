// mantine styles
import "@mantine/core/styles.layer.css";
import "@mantine/dates/styles.css";
import "@mantine/notifications/styles.css";

// custom styles
import.meta.glob("./styles/**/*.css", { eager: true });

// atproto services
import "./lib/atproto/atproto-services";

// dayjs Locales
import "dayjs";
import.meta.glob("../node_modules/dayjs/esm/locale/*.js", { eager: true });

// events
import "./init-events";
