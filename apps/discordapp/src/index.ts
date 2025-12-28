import { Client, Events } from "discord.js";
import { djsx } from "discord-jsx-renderer";
import "dotenv/config";
import { getCommands } from "./commands";

const client = new Client({ intents: [] });

const commands = await getCommands();

client.once(Events.ClientReady, () => {
    console.log(`Logged in as ${client.user?.tag}!`);
});

client.on(Events.InteractionCreate, async interaction => {
    djsx.dispatchInteraction(interaction);

    if(interaction.isChatInputCommand()) {
        const command = commands.find(cmd => cmd.name === interaction.commandName);
        if(command) {
            await command.execute(interaction);
        }
    }
});

client.login(process.env.DISCORD_BOT_TOKEN);
