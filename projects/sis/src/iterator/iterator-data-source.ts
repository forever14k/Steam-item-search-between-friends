import { Observable } from 'rxjs';


export interface IteratorDataSource<E> {
    getPartition(selector?: IteratorPartitionSelector): Observable<IteratorPartition<E>>;
}

export interface IteratorPartition<E> {
    entities: E[];
    total: number;
}

export interface IteratorPartitionSelector {
    offset?: number;
}
