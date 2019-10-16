import { Executor, Job } from './executor';
import { ImmediateExecutor } from './immediate-executor';

describe('ImmediateExecutor', () => {

    let executor: Executor = new ImmediateExecutor();
    beforeEach(() => {
        executor = new ImmediateExecutor();
    });

    it('should immediately execute job', () => {
        const job: Job = {
            run: jasmine.createSpy('spy'),
        };
        executor.execute(job);
        expect(job.run).toHaveBeenCalledTimes(1);
    });

    it('should immediately execute multiple jobs', () => {
        const jobs: Job[] = Array(14).fill(null).map(() => ( {
            run: jasmine.createSpy('spy'),
        }));
        for (const job of jobs) {
            executor.execute(job);
        }
        for (const job of jobs) {
            expect(job.run).toHaveBeenCalledTimes(1);
        }
    });
});
