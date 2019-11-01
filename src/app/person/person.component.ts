import { Component, Input } from '@angular/core';
import { SteamPerson } from 'sis/steam/person/person';

@Component({
    selector: 'sisbf-person',
    templateUrl: './person.component.html',
})
export class PersonComponent {

    @Input() person: SteamPerson;

}
