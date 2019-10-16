import { Subscription } from 'rxjs';
import { Inject, Injectable, InjectionToken, OnDestroy } from '@angular/core';

import { Executor, ExecutorSubscription, Job } from './executor';


const STEAM_INVENTORY_REQUEST_EXECUTOR_CONFIG =
    new InjectionToken<SteamInventoryRequestExecutorConfig>('SteamInventoryRequestExecutorConfig');

export interface SteamInventoryRequestExecutorConfig {
    // requests per minute
    rpm: number;
}


@Injectable()
export class SteamInventoryRequestExecutor implements Executor, OnDestroy {

    private _queue: Job[] = [];
    private _activeJob: Job;
    private _activeJobSubscription: Subscription = Subscription.EMPTY;
    private _resumeQueueExecution: Subscription = Subscription.EMPTY;
    private _resumeQueueDelay: number;
    private _resumeQueueTimer: ReturnType<typeof setTimeout>;


    constructor(@Inject(STEAM_INVENTORY_REQUEST_EXECUTOR_CONFIG) config: SteamInventoryRequestExecutorConfig) {
        this._resumeQueueDelay = getTimeBetweenRequests(config.rpm);
    }


    execute(job: Job): ExecutorSubscription {
        this._queue.push(job);
        if (!this._activeJob) {
            this.runNext();
        }
        return { unsubscribe: () => this.cancel(job) };
    }


    private runNext() {
        const job = this._queue.shift();
        if (job) {
            this._activeJob = job;
            this._activeJobSubscription = job.run();
            this._resumeQueueExecution = this._activeJobSubscription.add(() => {
                this._activeJobSubscription.remove(this._resumeQueueExecution); // strictly execute only once
                clearTimeout(this._resumeQueueTimer);
                this._resumeQueueTimer = setTimeout(() => {
                    this._activeJob = null;
                    this._activeJobSubscription = Subscription.EMPTY;
                    this.runNext();
                }, this._resumeQueueDelay);
            });
        }
    }


    private cancel(job: Job) {
        if (this._activeJob === job) {
            this._activeJobSubscription.unsubscribe();
            return;
        }

        const jobIdx = this._queue.indexOf(job);
        if (jobIdx >= 0) {
            this._queue.splice(jobIdx, 1);
        }
    }


    ngOnDestroy() {
        this._activeJobSubscription.remove(this._resumeQueueExecution); // to avoid run next
        clearTimeout(this._resumeQueueTimer);
        this._activeJobSubscription.unsubscribe();
    }

}


function getTimeBetweenRequests(rpm: number): number {
    return (1000 * 60)  / rpm;
}

