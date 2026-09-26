import { createContext } from 'react';

// turns a plan's share code into a short link; the host app supplies it, and without it the planner
// shares the long link that carries the whole code
export type CreateShareLink = (code: string) => Promise<string>;

export const ShareLinkContext = createContext<CreateShareLink | undefined>(undefined);
