import type { app } from './app'
import { hc } from 'hono/client'

// trick
export type Client = ReturnType<typeof hc<typeof app>>

export const hcTyped = (...args: Parameters<typeof hc>): Client =>
    hc<typeof app>(...args);
