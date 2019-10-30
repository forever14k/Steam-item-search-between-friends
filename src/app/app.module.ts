import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
    STEAM_CLIENT_CONFIG, SteamClient, SteamClientConfig, SteamPublicAPIExecutor, TagParsersManager,
    TAG_PARSERS_MANAGER_PLUGIN, CommonColorTagParserManagerPlugin, CommonNameTagParserManagerPlugin,
    CommonTradableTagParserManagerPlugin, CommonExistingItemTagParserManagerPlugin, CommonImageTagParserManagerPlugin,
} from 'sis';

import { STEAM_MAX_RPM } from './app-config';
import { AppComponent } from './app.component';


@NgModule({
    declarations: [
        AppComponent,
    ],
    imports: [
        BrowserModule, BrowserAnimationsModule, FormsModule, ReactiveFormsModule, HttpClientModule, CommonModule,
    ],
    providers: [
        SteamClient,
            {
                provide: STEAM_CLIENT_CONFIG,
                useValue: {
                    executor: new SteamPublicAPIExecutor({ rpm: STEAM_MAX_RPM }),
                } as SteamClientConfig,
            },
        TagParsersManager,
            { provide: TAG_PARSERS_MANAGER_PLUGIN, multi: true, useClass: CommonNameTagParserManagerPlugin },
            { provide: TAG_PARSERS_MANAGER_PLUGIN, multi: true, useClass: CommonTradableTagParserManagerPlugin },
            { provide: TAG_PARSERS_MANAGER_PLUGIN, multi: true, useClass: CommonColorTagParserManagerPlugin },
            { provide: TAG_PARSERS_MANAGER_PLUGIN, multi: true, useClass: CommonExistingItemTagParserManagerPlugin },
            { provide: TAG_PARSERS_MANAGER_PLUGIN, multi: true, useClass: CommonImageTagParserManagerPlugin },
    ],
    bootstrap: [ AppComponent ],
})
export class AppModule {
}
