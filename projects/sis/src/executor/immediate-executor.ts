import { Injectable } from '@angular/core';

import { Executor, ExecutorSubscription, Job } from './executor';


@Injectable()
export class ImmediateExecutor implements Executor {

    execute(job: Job): ExecutorSubscription {
        return job.run();
    }

}
