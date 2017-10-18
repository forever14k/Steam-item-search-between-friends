export interface SisbfItem {
    id: string;
    name: string;

    tags: SisbfItemTag[];
}

export interface SisbfItemTag {
    category: SisbfItemTagCategory,
    name: string;
    color?: string;

    meta?: {
        forFilter?: boolean;
        forTooltip?: boolean;
    };
}

export enum SisbfItemTagCategory {
    COLOR,
}