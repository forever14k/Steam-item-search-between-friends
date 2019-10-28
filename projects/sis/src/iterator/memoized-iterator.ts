import { merge, Observable, of } from 'rxjs';
import { map, publishReplay, refCount, switchMap, tap } from 'rxjs/operators';

import { IteratorDataSource, IteratorPartitionSelector } from './iterator-data-source';
import { IteratorTrackBy } from './iterator-track-by';


export class MemoizedIterator<E, R, I = any> {

    private _total: number = 0;
    private _order: I[] = [];
    private _entities: Map<I, E> = new Map();
    private _results: Map<I, R> = new Map();

    constructor(private _dataSource: IteratorDataSource<E>,
                private _factory: IteratorResultFactory<E, R>,
                private _trackBy: IteratorTrackBy<E, I>) {
    }


    getResults(): Observable<IterationsResults<E, R>> {
        return this.fetchResults({ offset: 0 }).pipe(
            map(() => {
                const results = this._order.map(id => {
                    return {
                        entity: this._entities.get(id),
                        result: this._results.get(id),
                    };
                });
                return {
                    results: results,
                    total: this._total,
                };
            }),
            publishReplay(1), refCount(),
        );
    }


    private fetchResults(selector: IteratorPartitionSelector): Observable<void> {
        return this._dataSource.getPartition(selector).pipe(
            switchMap(persons => {
                this._total = persons.total;
                return merge(
                        ...persons.entities
                            .filter(person => {
                                const id = this._trackBy(person);
                                this._entities.set(id, person);
                                return !this._results.has(id);
                            })
                            .map(person => this._factory(person).pipe(
                                tap(result => {
                                    const id = this._trackBy(person);
                                    this._results.set(id, result);
                                    const orderIdx = this._order.indexOf(id);
                                    if (orderIdx !== -1) {
                                        this._order.splice(orderIdx, 1);
                                    }
                                    this._order.push(id);
                                }),
                            )),
                    )
                    .pipe(
                        switchMap(() => {
                            const nextOffset = persons.entities.length + selector.offset;
                            if (this._results.size === nextOffset && nextOffset !== persons.total) {
                                return this.fetchResults({ offset: nextOffset });
                            }
                            return of(null);
                        }),
                    );
            }),
        );
    }

}

export type IteratorResultFactory<E, R> = (entity: E) => Observable<R>;

export interface IterationsResults<E, R> {
    results: IterationsResult<E, R>[];
    total: number;
}

export interface IterationsResult<E, R> {
    entity: E;
    result: R;
}
