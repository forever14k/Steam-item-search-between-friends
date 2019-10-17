import { Subscription } from 'rxjs';
import { Injectable, OnDestroy } from '@angular/core';
import { Executor, ExecutorSubscription, Job } from './executor';


@Injectable()
export class SequentialExecutor implements Executor, OnDestroy {

    private _queue: Job[] = [];
    private _activeJob: Job;
    private _activeJobSubscription: Subscription = Subscription.EMPTY;
    private _resumeQueueExecution: Subscription;


    execute(job: Job): ExecutorSubscription {
        this._queue.push(job);
        if (!this._activeJob) {
            this.next();
        }
        return {
            unsubscribe: () => this.cancel(job),
        };
    }


    protected dequeue() {
        this._activeJob = null;
        this._activeJobSubscription = Subscription.EMPTY;
        this.next();
    }


    private next() {
        const job = this._queue.shift();
        if (job) {
            this._activeJob = job;
            this._activeJobSubscription = job.run();
            this._resumeQueueExecution = this._activeJobSubscription.add(() => {
                this._activeJobSubscription.remove(this._resumeQueueExecution); // strictly execute only once
                this.dequeue();
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
        this._activeJobSubscription.unsubscribe();
    }

}
