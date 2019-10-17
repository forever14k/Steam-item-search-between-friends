import { async, TestBed } from '@angular/core/testing';

import { Executor, Job } from './executor';
import { ImmediateExecutor } from './immediate-executor';


describe('ImmediateExecutor', () => {
    let executor: Executor;
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            providers: [ ImmediateExecutor ],
        });
        executor = TestBed.get(ImmediateExecutor);
    }));

    it('should immediately execute job', () => {
        const job: Job = {
            run: jasmine.createSpy('run'),
        };
        executor.execute(job);
        expect(job.run).toHaveBeenCalledTimes(1);
    });

    it('should immediately execute multiple jobs', () => {
        const jobs: Job[] = Array(14).fill(null).map(() => ( {
            run: jasmine.createSpy('run'),
        }));
        for (const job of jobs) {
            executor.execute(job);
        }
        for (const job of jobs) {
            expect(job.run).toHaveBeenCalledTimes(1);
        }
    });
});
