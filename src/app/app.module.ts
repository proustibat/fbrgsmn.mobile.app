// Angular libs
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

// Ionic libs
import { IonicApp, IonicModule } from 'ionic-angular';

// Main
import { FbrgSmnApp } from './app.component';

// Pages
import { Pages } from '../pages';

// Providers
import { CustomProviders, ExternalProviders } from '../providers';

// Components and Directives
import { CustomComponents, CustomDirectives, ExternalComponents } from '../components';

// Libs
import { SwingModule } from 'angular2-swing';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FacebookServiceProvider } from '../providers/facebook-service/facebook-service';

const appSettings = {
    backButtonText: 'Retour',
    // tabsLayout: 'title-hide',
    // pageTransition: 'ios-transition',
    // modalEnter: 'modal-slide-in',
    // modalLeave: 'modal-slide-out',
    statusbarPadding: true,
    tabsHideOnSubPages: true,
    // menuType: 'reveal'
    tabsHighlight: true,
    tabsPlacement: 'bottom'
};

// AoT requires an exported function for factories
export function HttpLoaderFactory( http: HttpClient ) {
    return new TranslateHttpLoader( http, './assets/i18n/', '.json' );
}

@NgModule( {
    bootstrap: [IonicApp],
    declarations: [
        FbrgSmnApp,
        ...Pages,
        ...CustomComponents,
        ...ExternalComponents,
        ...CustomDirectives
    ],
    entryComponents: [
        FbrgSmnApp,
        ...Pages,
        ...CustomComponents,
        ...ExternalComponents
    ],
    imports: [
        BrowserModule,
        IonicModule.forRoot( FbrgSmnApp, appSettings ),
        SwingModule,
        HttpClientModule,
        TranslateModule.forRoot( {
            loader: {
                deps: [ HttpClient ],
                provide: TranslateLoader,
                useFactory: ( HttpLoaderFactory ),
            }
        } )
    ],
    providers: [
        ...CustomProviders,
        ...ExternalProviders,
        FacebookServiceProvider
    ]
} )
export class AppModule {}
