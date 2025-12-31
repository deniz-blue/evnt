import type { AppType } from './app'
import { hc } from 'hono/client'

// trick
export type Client = ReturnType<typeof hc<AppType>>

export const hcTyped = (...args: Parameters<typeof hc>): Client =>
    hc<AppType>(...args);
