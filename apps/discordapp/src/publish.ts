import { REST, SlashCommandBuilder } from "discord.js";
import { getCommands } from "./commands";
import "dotenv/config";

const api = new REST()
    .setToken(process.env.DISCORD_BOT_TOKEN!);

const main = async () => {
    const commands = await getCommands();
    console.log("Publishing commands:", commands.map(cmd => cmd.name));

    const data = [];

    for(const command of commands) {
        data.push(
            new SlashCommandBuilder()
                .setName(command.name)
                .setDescription(command.description["en"] ?? "")
                .toJSON()
        );
    }

    await api.put(
        // Replace with your own application ID and guild ID
        `/applications/${process.env.DISCORD_APP_ID}/guilds/${process.env.DISCORD_GUILD_ID}/commands`,
        { body: data }
    );
};

main().catch(console.error);
