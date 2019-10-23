import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatProgressBarModule, MatFormFieldModule, MatInputModule, MatButtonModule } from '@angular/material';

import { STEAM_CLIENT_CONFIG, SteamClient, SteamClientConfig, SteamPublicAPIExecutor } from 'sis';

import { AppComponent } from './app.component';


@NgModule({
    declarations: [
        AppComponent,
    ],
    imports: [
        BrowserModule, BrowserAnimationsModule, FormsModule, ReactiveFormsModule, HttpClientModule, CommonModule,

        MatProgressBarModule, MatInputModule, MatFormFieldModule, MatButtonModule,
    ],
    providers: [
        {
            provide: STEAM_CLIENT_CONFIG,
            useValue: {
                executor: new SteamPublicAPIExecutor({ rpm: 30 }),
            } as SteamClientConfig,
        },
        SteamClient,
    ],
    bootstrap: [ AppComponent ],
})
export class AppModule {
}
