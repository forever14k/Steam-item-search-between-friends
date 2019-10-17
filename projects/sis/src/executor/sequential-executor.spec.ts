import { async, TestBed } from '@angular/core/testing';

import { Executor, Job } from './executor';
import { SequentialExecutor } from './sequential-executor';
import { Subscription } from 'rxjs';


describe('SequentialExecutor', () => {

    let executor: Executor;
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            providers: [ SequentialExecutor ],
        });
        executor = TestBed.get(SequentialExecutor);
    }));

    it('should execute jobs in provided order', () => {
        const firstSubscription = new Subscription();
        const firstJob: Job = {
            run: jasmine.createSpy('firstJob run').and.returnValue(firstSubscription),
        };
        const secondSubscription = new Subscription();
        const secondJob: Job = {
            run: jasmine.createSpy('secondJob run').and.returnValue(secondSubscription),
        };
        const thirdJob: Job = {
            run: jasmine.createSpy('thirdJob run').and.returnValue(new Subscription()),
        };

        executor.execute(firstJob);
        executor.execute(secondJob);
        executor.execute(thirdJob);

        expect(firstJob.run).toHaveBeenCalledTimes(1);
        expect(secondJob.run).not.toHaveBeenCalled();
        expect(thirdJob.run).not.toHaveBeenCalled();

        firstSubscription.unsubscribe();
        expect(firstJob.run).toHaveBeenCalledTimes(1);
        expect(secondJob.run).toHaveBeenCalledTimes(1);
        expect(thirdJob.run).not.toHaveBeenCalled();

        secondSubscription.unsubscribe();
        expect(firstJob.run).toHaveBeenCalledTimes(1);
        expect(secondJob.run).toHaveBeenCalledTimes(1);
        expect(thirdJob.run).toHaveBeenCalledTimes(1);
    });

});
