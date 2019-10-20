export interface SteamPerson {

    id32: string;
    id64: string;

    status?: SteamPerson.Status;

    name?: string;
    statusText?: string;
    avatarUrl?: string;

}


export namespace SteamPerson {

    export enum Status {
        Offline,
        InGame,
        Online,
    }

}
