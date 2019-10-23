import { SchedulerLike } from 'rxjs';
import { fakeAsync, tick } from '@angular/core/testing';

import { Executor, Job } from './executor';
import { ExecutorScheduler } from './executor-scheduler';


describe('ExecutorScheduler', () => {

    let executor: Executor;
    let scheduler: SchedulerLike;
    beforeEach(() => {
        executor = {
            execute: jasmine.createSpy('execute', (job: Job) => job.run()).and.callThrough(),
        };
        scheduler = new ExecutorScheduler(executor);
    });

    it('should schedule jobs in executor', () => {
        const count = 14;
        const jobs = Array(count).fill(null).map((_, index) => jasmine.createSpy(`job ${index}`));
        for (const job of jobs) {
            scheduler.schedule(job);
        }
        for (const job of jobs) {
            expect(job).toHaveBeenCalledTimes(1);
        }
        expect(executor.execute).toHaveBeenCalledTimes(count);
    });

    it('should schedule jobs with delay', fakeAsync(() => {
        const delay = 1000;
        const halfDelay = delay / 2 ;
        const job = jasmine.createSpy(`job`);
        scheduler.schedule(job, delay);
        expect(job).not.toHaveBeenCalled();
        tick(halfDelay);
        expect(job).not.toHaveBeenCalled();
        tick(halfDelay);
        expect(job).toHaveBeenCalledTimes(1);
    }));

});
