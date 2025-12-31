import type { EventData, Translations } from "@evnt/format";
import { command } from "../core/command";
import { djsx } from "discord-jsx-renderer";
import { EventCard } from "../components/event/EventCard";

export default command({
    name: "showevent",
    description: { en: "Show event details" } as any as Translations,
    async execute(interaction) {
        const data: EventData = {
            v: 0,
            name: { en: "Sample Event", es: "Evento de Ejemplo" },
            description: { en: "This is a sample event description.", es: "Esta es una descripción de evento de ejemplo." },
            instances: [],
            venues: [],
        };
        
        djsx.createMessage(interaction, (
            <message ephemeral>
                <EventCard value={data} />
            </message>
        ));
    },
});
