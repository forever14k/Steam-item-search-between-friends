import { MonoTypeOperatorFunction, Observable, Operator, Subscriber, Unsubscribable } from 'rxjs';

import { Executor } from './executor';


export function subscribeOnExecutor<T>(executor: Executor): MonoTypeOperatorFunction<T> {
    return (source: Observable<T>): Observable<T> => source.lift(new SubscribeOnExecutorOperator<T>(executor));
}


class SubscribeOnExecutorOperator<T> implements Operator<T, T> {
    constructor(private _executor: Executor) {
    }

    call(subscriber: Subscriber<T>, source: Observable<T>): Unsubscribable {
        return this._executor.execute({
            run: () => source.subscribe(subscriber),
        });
    }
}

