import { Inject, Injectable, InjectionToken, OnDestroy } from '@angular/core';

import { SequentialExecutor } from '../../executor';


export const STEAM_PUBLIC_API_EXECUTOR_CONFIG =
    new InjectionToken<SteamPublicAPIExecutorConfig>('SteamPublicAPIExecutorConfig');

export interface SteamPublicAPIExecutorConfig {
    // requests per minute
    rpm: number;
}


@Injectable()
export class SteamPublicAPIExecutor extends SequentialExecutor implements OnDestroy {

    private _delay: number;
    private _timer: ReturnType<typeof setTimeout>;


    constructor(@Inject(STEAM_PUBLIC_API_EXECUTOR_CONFIG) config: SteamPublicAPIExecutorConfig) {
        super();
        this._delay = getTimeBetweenRequests(config.rpm);
    }


    protected dequeue() {
        clearTimeout(this._timer);
        this._timer = setTimeout(() => super.dequeue(), this._delay);
    }


    ngOnDestroy() {
        clearTimeout(this._timer);
        super.ngOnDestroy();
    }

}


function getTimeBetweenRequests(rpm: number): number {
    return (1000 * 60)  / rpm;
}

