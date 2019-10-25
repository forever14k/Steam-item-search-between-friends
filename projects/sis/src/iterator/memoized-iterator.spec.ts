import { Observable, of } from 'rxjs';
import { takeWhile, tap } from 'rxjs/operators';

import { IteratorTrackBy } from './iterator-track-by';
import { IteratorDataSource, IteratorPartition, IteratorPartitionSelector } from './iterator-data-source';
import { IteratorResultFactory, MemoizedIterator, IterationsResults } from './memoized-iterator';



describe('MemoizedIterator', () => {
    interface TestEntity {
        id: string;
    }
    let entities: TestEntity[];
    let factory: IteratorResultFactory<TestEntity, any>;
    const trackBy: IteratorTrackBy<TestEntity> = entity => entity.id;
    beforeEach(() => {
        entities = [
            { id: '0' },
            { id: '1' },
            { id: '2' },
            { id: '3' },
            { id: '4' },
            { id: '5' },
            { id: '6' },
            { id: '7' },
        ];
        factory = jasmine.createSpy('factory').and.returnValue(of(null));
    });


    it('should get all results for provided data source', () => {
        const dataSource: IteratorDataSource<TestEntity> = {
            getPartition: (_selector?: IteratorPartitionSelector): Observable<IteratorPartition<TestEntity>> => {
                return of({
                    entities: entities,
                    total: entities.length,
                });
            },
        };
        const iterator = new MemoizedIterator(dataSource, factory, trackBy);
        let iterationsResults: IterationsResults<TestEntity, any>;
        const subscription = iterator.getResults().subscribe(results => iterationsResults = results);
        expect(factory).toHaveBeenCalledTimes(entities.length);
        expect(subscription.closed).toBeTruthy();
        expect(iterationsResults.results.length).toBe(entities.length);
        for (const result of iterationsResults.results) {
            const idx = entities.indexOf(result.entity);
            expect(idx).not.toBe(-1);
            entities.splice(idx, 1);
        }
    });

    it('should get all results for provided partial data source', () => {
        const limit = 2;
        const dataSource: IteratorDataSource<TestEntity> = {
            getPartition: (selector?: IteratorPartitionSelector): Observable<IteratorPartition<TestEntity>> => {
                const offset = selector && selector.offset !== undefined ? selector.offset : 0;
                return of({
                    entities: entities.slice(offset, limit + offset),
                    total: entities.length,
                });
            },
        };
        const iterator = new MemoizedIterator(dataSource, factory, trackBy);
        let iterationsResults: IterationsResults<TestEntity, any>;
        const subscription = iterator.getResults().subscribe(results => iterationsResults = results);
        expect(factory).toHaveBeenCalledTimes(entities.length);
        expect(subscription.closed).toBeTruthy();
        expect(iterationsResults.results.length).toBe(entities.length);
        for (const result of iterationsResults.results) {
            const idx = entities.indexOf(result.entity);
            expect(idx).not.toBe(-1);
            entities.splice(idx, 1);
        }
    });

    it('should support pausing results loading by unsubscribe', () => {
        const dataSource: IteratorDataSource<TestEntity> = {
            getPartition: (_selector?: IteratorPartitionSelector): Observable<IteratorPartition<TestEntity>> => {
                return of({
                    entities: entities,
                    total: entities.length,
                });
            },
        };
        const iterator = new MemoizedIterator(dataSource, factory, trackBy);
        const unsubscribeOnCount = 4;
        let iterationsResults: IterationsResults<TestEntity, any>;

        let subscription = iterator.getResults()
            .pipe(
                tap(result => iterationsResults = result),
                takeWhile(result => result.results.length < unsubscribeOnCount),
            )
            .subscribe();
        expect(iterationsResults.results.length).toBe(unsubscribeOnCount);
        expect(subscription.closed).toBeTruthy();
        expect(factory).toHaveBeenCalledTimes(entities.length);

        subscription = iterator.getResults().subscribe(result => {
            expect(result.results.length).toBeGreaterThanOrEqual(unsubscribeOnCount);
            iterationsResults = result;
        });
        expect(iterationsResults.results.length).toBe(entities.length);
        expect(subscription.closed).toBeTruthy();
        expect(factory).toHaveBeenCalledTimes(entities.length + (entities.length - unsubscribeOnCount));

        for (const result of iterationsResults.results) {
            const idx = entities.indexOf(result.entity);
            expect(idx).not.toBe(-1);
            entities.splice(idx, 1);
        }
    });

});
