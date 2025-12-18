import { Client, Events } from "discord.js";
import { djsx } from "discord-jsx-renderer";

const client = new Client({ intents: [] });

client.once("ready", () => {
    console.log(`Logged in as ${client.user?.tag}!`);
});

client.on(Events.InteractionCreate, async interaction => {
    djsx.dispatchInteraction(interaction);
});

client.login(process.env.DISCORD_BOT_TOKEN);
