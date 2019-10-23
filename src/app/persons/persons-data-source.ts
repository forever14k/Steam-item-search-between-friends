import { defer, Observable, of } from 'rxjs';
import { map, publishReplay, refCount } from 'rxjs/operators';
import { Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';

import { SteamPersonsDataSource, SteamPerson, toSteamId64, SteamPersons, SteamPersonsSelector } from 'sis';



@Injectable()
export class SISBFPersonsDataSource implements SteamPersonsDataSource {

    private _persons: Observable<SteamPersons>;


    constructor(@Inject(DOCUMENT) private _document: Document) {
        this._persons = defer(() => of(this.getPersonsFromDOM())).pipe(publishReplay(1), refCount());
    }


    getPersons(selector?: SteamPersonsSelector): Observable<SteamPersons> {
        if (selector && selector.offset !== undefined) {
            return this._persons.pipe(
                map(persons => {
                   return {
                       persons: persons.persons.slice(selector.offset),
                       total: persons.total,
                   };
                }),
            );
        }
        return this._persons;
    }


    private getPersonsFromDOM(): SteamPersons {
        const persons: SteamPerson[] = [];

        const elements = this._document.querySelectorAll('.profile_friends [data-miniprofile]');
        if (elements && elements.length) {
            for (let i = 0; i < elements.length; i++) {
                const element = elements[i] as Element;

                const id32 = element.getAttribute('data-miniprofile');
                if (!id32) {
                    continue;
                }

                const id64 = toSteamId64(id32);


                const content = element.querySelector('.friend_block_content');
                if (!content) {
                    continue;
                }

                const name = content && content.childNodes && content.childNodes[0] && content.childNodes[0].textContent
                    ? content.childNodes[0].textContent.trim()
                    : undefined;

                const statusTextElement = content.querySelector('.friend_small_text');
                const statusText = statusTextElement && statusTextElement.textContent
                    ? statusTextElement.textContent.trim()
                    : undefined;

                const avatarElement = (element.querySelector('.player_avatar img') as HTMLImageElement);
                const avatarUrl = avatarElement && avatarElement.src ? avatarElement.src : undefined;


                let status;
                if (element.classList.contains('offline')) {
                    status = SteamPerson.Status.Offline;
                }
                if (element.classList.contains('in-game')) {
                    status = SteamPerson.Status.InGame;
                }
                if (element.classList.contains('online')) {
                    status = SteamPerson.Status.Online;
                }


                persons.push({
                    id32:       id32,
                    id64:       id64,
                    status:     status,
                    name:       name,
                    statusText: statusText,
                    avatarUrl:  avatarUrl,
                });
            }
        }

        return {
            persons: persons,
            total: persons.length,
        };
    }


}
