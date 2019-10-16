import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ImmediateExecutor } from 'sis';

@NgModule({
    declarations: [
        AppComponent,
    ],
    imports: [
        BrowserModule,
    ],
    providers: [
        ImmediateExecutor,
    ],
    bootstrap: [ AppComponent ],
})
export class AppModule {
}
