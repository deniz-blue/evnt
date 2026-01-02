import { githubAuth } from "@hono/oauth-providers/github";
import { app } from "../app";
import z from "zod";
import { discordAuth } from "@hono/oauth-providers/discord";

const {
    GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET,
    DISCORD_CLIENT_ID,
    DISCORD_CLIENT_SECRET,
} = z.object({
    GITHUB_CLIENT_ID: z.string(),
    GITHUB_CLIENT_SECRET: z.string(),
    DISCORD_CLIENT_ID: z.string(),
    DISCORD_CLIENT_SECRET: z.string(),
}).parse(process.env);

app.get(
    "/auth/github",
    githubAuth({
        client_id: GITHUB_CLIENT_ID,
        client_secret: GITHUB_CLIENT_SECRET,
        scope: [
            "user:email"
        ],
    }),
    (c) => {
        const user = c.get("user-github");
        return c.json({ user });
    },
);

app.get(
    "/auth/discord",
    discordAuth({
        client_id: DISCORD_CLIENT_ID,
        client_secret: DISCORD_CLIENT_SECRET,
        scope: [
            "identify",
            "email",
        ],
    }),
    (c) => {
        const user = c.get("user-discord");
        return c.json({ user });
    },
)
