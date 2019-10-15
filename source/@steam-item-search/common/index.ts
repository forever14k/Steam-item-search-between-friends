export interface SteamItemSearchEntry {
    id: string;
    name: string;

    tags: SteamItemSearchTag[];
}

export interface SteamItemSearchTag {
    category: SteamItemSearchTagCategory,
    name: string;
    color?: string;

    meta?: {
        forFilter?: boolean;
        forTooltip?: boolean;
    };
}

export enum SteamItemSearchTagCategory {
    COLOR,
}