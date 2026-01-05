import { githubAuth } from "@hono/oauth-providers/github";
import { discordAuth } from "@hono/oauth-providers/discord";
import { Hono } from "hono";
import { config } from "../config/env";

export const auth = new Hono()
    .get(
        "/auth/github",
        githubAuth({
            client_id: config.GITHUB_CLIENT_ID,
            client_secret: config.GITHUB_CLIENT_SECRET,
            scope: [
                "user:email"
            ],
        }),
        (c) => {
            const user = c.get("user-github");
            return c.json({ user });
        },
    )
    .get(
        "/auth/discord",
        discordAuth({
            client_id: config.DISCORD_CLIENT_ID,
            client_secret: config.DISCORD_CLIENT_SECRET,
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
