import type { Translations } from "@evnt/format";
import type { ChatInputCommandInteraction } from "discord.js";

export interface Command {
    name: string;
    description: Translations;

    execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
};

export const command = (x: Command): Command => x;
