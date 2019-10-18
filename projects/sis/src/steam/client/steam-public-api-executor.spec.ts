import { Subscription } from 'rxjs';
import { fakeAsync, tick, TestBed } from '@angular/core/testing';

import { Job } from '../../executor';
import {
    STEAM_PUBLIC_API_EXECUTOR_CONFIG, SteamPublicAPIExecutor, SteamPublicAPIExecutorConfig,
} from './steam-public-api-executor';


describe('SteamPublicAPIExecutor', () => {

    it('should execute jobs in provided order',  fakeAsync(() => {
        const rpm = 60;
        const delay = (1000 * 60) / rpm;
        TestBed.configureTestingModule({
            providers: [
                {
                    provide: STEAM_PUBLIC_API_EXECUTOR_CONFIG,
                    useValue: {
                        rpm: rpm,
                    } as SteamPublicAPIExecutorConfig,
                },
                SteamPublicAPIExecutor,
            ],
        });
        const executor = TestBed.get(SteamPublicAPIExecutor);

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
        tick(delay);
        expect(firstJob.run).toHaveBeenCalledTimes(1);
        expect(secondJob.run).toHaveBeenCalledTimes(1);
        expect(thirdJob.run).not.toHaveBeenCalled();

        secondSubscription.unsubscribe();
        tick(delay);
        expect(firstJob.run).toHaveBeenCalledTimes(1);
        expect(secondJob.run).toHaveBeenCalledTimes(1);
        expect(thirdJob.run).toHaveBeenCalledTimes(1);
    }));

    it('should execute jobs with delay between requests',  fakeAsync(() => {
        const rpm = 60;
        const halfDelay = ((1000 * 60) / rpm) / 2;
        TestBed.configureTestingModule({
            providers: [
                {
                    provide: STEAM_PUBLIC_API_EXECUTOR_CONFIG,
                    useValue: {
                        rpm: rpm,
                    } as SteamPublicAPIExecutorConfig,
                },
                SteamPublicAPIExecutor,
            ],
        });
        const executor = TestBed.get(SteamPublicAPIExecutor);

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
        tick(halfDelay);
        expect(firstJob.run).toHaveBeenCalledTimes(1);
        expect(secondJob.run).not.toHaveBeenCalled();
        expect(thirdJob.run).not.toHaveBeenCalled();
        tick(halfDelay);
        expect(firstJob.run).toHaveBeenCalledTimes(1);
        expect(secondJob.run).toHaveBeenCalledTimes(1);
        expect(thirdJob.run).not.toHaveBeenCalled();

        secondSubscription.unsubscribe();
        tick(halfDelay);
        expect(firstJob.run).toHaveBeenCalledTimes(1);
        expect(secondJob.run).toHaveBeenCalledTimes(1);
        expect(thirdJob.run).not.toHaveBeenCalled();
        tick(halfDelay);
        expect(firstJob.run).toHaveBeenCalledTimes(1);
        expect(secondJob.run).toHaveBeenCalledTimes(1);
        expect(thirdJob.run).toHaveBeenCalledTimes(1);
    }));

    it('should not reset delay if added empty job', fakeAsync(() => {
        const rpm = 60;
        const halfDelay = ((1000 * 60) / rpm) / 2;
        TestBed.configureTestingModule({
            providers: [
                {
                    provide: STEAM_PUBLIC_API_EXECUTOR_CONFIG,
                    useValue: {
                        rpm: rpm,
                    } as SteamPublicAPIExecutorConfig,
                },
                SteamPublicAPIExecutor,
            ],
        });
        const executor = TestBed.get(SteamPublicAPIExecutor);

        const firstSubscription = new Subscription();
        const firstJob: Job = {
            run: jasmine.createSpy('firstJob run').and.returnValue(firstSubscription),
        };
        const secondJob: Job = {
            run: jasmine.createSpy('secondJob run').and.returnValue(new Subscription()),
        };

        executor.execute(firstJob);
        tick();
        firstSubscription.unsubscribe();
        tick();
        expect(firstJob.run).toHaveBeenCalledTimes(1);
        executor.execute(secondJob);
        tick();
        expect(secondJob.run).not.toHaveBeenCalled();
        tick(halfDelay);
        expect(secondJob.run).not.toHaveBeenCalled();
        tick(halfDelay);
        expect(secondJob.run).toHaveBeenCalledTimes(1);
    }));

    it('should meet request per minute limit',  fakeAsync(() => {
        const rpm = 60;
        const delay = (1000 * 60) / rpm;
        TestBed.configureTestingModule({
            providers: [
                {
                    provide: STEAM_PUBLIC_API_EXECUTOR_CONFIG,
                    useValue: {
                        rpm: rpm,
                    } as SteamPublicAPIExecutorConfig,
                },
                SteamPublicAPIExecutor,
            ],
        });
        const executor = TestBed.get(SteamPublicAPIExecutor);
        const jobs: Job[] = Array(rpm * 2).fill(null).map((_, index) => ( {
            run: jasmine.createSpy(`run ${index}`).and.returnValue(Subscription.EMPTY),
        }));
        for (const job of jobs) {
            executor.execute(job);
        }
        tick((delay * rpm) - 1);
        expect(jobs[rpm - 1].run).toHaveBeenCalledTimes(1);
        expect(jobs[rpm].run).not.toHaveBeenCalled();
        tick(delay);
        expect(jobs[rpm].run).toHaveBeenCalledTimes(1);
        expect(jobs[jobs.length - 1].run).not.toHaveBeenCalled();
        tick(delay * jobs.length);
        expect(jobs[jobs.length - 1].run).toHaveBeenCalledTimes(1);
    }));

});
