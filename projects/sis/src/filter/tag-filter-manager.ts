import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Inject, Injectable, InjectionToken, TemplateRef } from '@angular/core';

import { SisTag } from '../tag/tag';


export const TAG_FILTER_MANAGER_PLUGIN = new InjectionToken<TagFilterManagerPlugin>('TagFilterManagerPlugin');

export interface TagFilterManagerPlugin {
    supports(tag: SisTag['kind']): boolean;
    register(tag: SisTag): void;
    getFilters(): Observable<TagFilter[]>;
}

export interface TagFilter {
    label: TemplateRef<void>;
    option: TemplateRef<SisTag>;
}


@Injectable()
export class TagFilterManager {

    private _memoized: Map<SisTag['kind'], TagFilterManagerPlugin[]> = new Map();

    constructor(@Inject(TAG_FILTER_MANAGER_PLUGIN) private _plugins: TagFilterManagerPlugin[]) {
    }


    supports(kind: SisTag['kind']): boolean {
        return Boolean(this.findPlugins(kind).length);
    }

    register(tag: SisTag) {
        const plugins = this.findPlugins(tag.kind);
        if (plugins.length) {
            for (const plugin of plugins) {
                plugin.register(tag);
            }
        }
    }

    getFilter(): Observable<TagFilter[]> {
        return forkJoin(this._plugins.map(plugin => plugin.getFilters()))
            .pipe(map(filters => reduceFilters(filters)));
    }



    private findPlugins(kind: string): TagFilterManagerPlugin[] {
        const memoized = this._memoized.get(kind);
        if (memoized) {
            return memoized;
        }

        const candidate = this._plugins.filter(p => p.supports(kind));
        if (candidate) {
            this._memoized.set(kind, candidate);
            return candidate;
        }

        return null;
    }

}

function reduceFilters(tags: TagFilter[][]): TagFilter[] {
    return tags.reduce((result, part) => [...result, ...part], []);
}
