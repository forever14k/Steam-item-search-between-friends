import { of } from 'rxjs';

import { Executor, Job } from './executor';
import { subscribeOnExecutor } from './subcribe-on-executor';


describe('subscribeOnExecutor', () => {

    let executor: Executor;
    beforeEach(() => {
        executor = {
            execute: jasmine.createSpy('execute', (job: Job) => job.run()).and.callThrough(),
        };
    });

    it('should schedule jobs in executor', () => {
        const count = 14;
        const jobs = Array(count).fill(null).map((_, index) => jasmine.createSpy(`job ${index}`));
        for (const job of jobs) {
            of(null).pipe(subscribeOnExecutor(executor)).subscribe(job);
        }
        for (const job of jobs) {
            expect(job).toHaveBeenCalledTimes(1);
        }
        expect(executor.execute).toHaveBeenCalledTimes(count);
    });

});
