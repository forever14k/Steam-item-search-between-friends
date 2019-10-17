import { Subscription } from 'rxjs';
import { fakeAsync, tick, TestBed } from '@angular/core/testing';

import { Job } from './executor';
import {
    STEAM_INVENTORY_REQUEST_EXECUTOR_CONFIG, SteamInventoryRequestExecutor, SteamInventoryRequestExecutorConfig
} from './steam-inventory-request-executor';


describe('SteamInventoryRequestExecutor', () => {


    it('should execute jobs in provided order',  fakeAsync(() => {
        const rpm = 60;
        const delay = (1000 * 60) / rpm;
        TestBed.configureTestingModule({
            providers: [
                {
                    provide: STEAM_INVENTORY_REQUEST_EXECUTOR_CONFIG,
                    useValue: {
                        rpm: rpm,
                    } as SteamInventoryRequestExecutorConfig,
                },
                SteamInventoryRequestExecutor,
            ],
        });
        const executor = TestBed.get(SteamInventoryRequestExecutor);

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
                    provide: STEAM_INVENTORY_REQUEST_EXECUTOR_CONFIG,
                    useValue: {
                        rpm: rpm,
                    } as SteamInventoryRequestExecutorConfig,
                },
                SteamInventoryRequestExecutor,
            ],
        });
        const executor = TestBed.get(SteamInventoryRequestExecutor);

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

});
