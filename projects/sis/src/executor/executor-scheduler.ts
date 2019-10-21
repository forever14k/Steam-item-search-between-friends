import { of, SchedulerAction, SchedulerLike, Subscription, timer } from 'rxjs';

import { Executor, Job } from './executor';


// TODO: create custom operator to use executor
export class ExecutorScheduler implements SchedulerLike {

    constructor(private _executor: Executor) {
    }

    now(): number {
        return Date.now();
    }

    schedule<T>(work: (this: SchedulerAction<T>, state?: T) => void, delay?: number, state?: T): Subscription {
        return new ExecutorSchedulerAction(this._executor, work).schedule(state, delay);
    }

}

class ExecutorSchedulerAction<T> extends Subscription implements SchedulerAction<T>  {

    constructor(private _executor: Executor, private _work: (this: SchedulerAction<T>, state?: T) => void) {
        super();
    }

    schedule(state?: T, delay?: number): Subscription {
        this._executor.execute(this.createJob(state, delay));
        return this;
    }

    private createJob(state?: T, delay?: number): Job {
        return {
            run: () => {
                let job = of(null);
                if (delay !== undefined) {
                    job = timer(delay);
                }
                return job.subscribe(() =>
                    // TODO: work returns void, can not pass subscription to executor
                    this._work(state),
                );
            },
        };
    }

}
