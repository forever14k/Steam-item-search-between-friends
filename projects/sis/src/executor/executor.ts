import { Subscription, Unsubscribable } from 'rxjs';


export interface Executor {
    execute(job: Job): ExecutorSubscription;
}

export interface ExecutorSubscription extends Unsubscribable {
}


export interface Job {
    run(): Subscription;
}
