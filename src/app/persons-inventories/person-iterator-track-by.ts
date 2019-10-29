import { IteratorTrackBy, SteamPerson } from 'sis';

export const steamPersonTrackBy: IteratorTrackBy<SteamPerson> = person => person.id64;
