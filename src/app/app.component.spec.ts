/* tslint:disable:no-submodule-imports */
import { TestBed, async } from '@angular/core/testing';
/* tslint:enable:no-submodule-imports */
import { IonicModule, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { MusicControlsManagerProvider } from '../providers/music-controls-manager/music-controls-manager';
import { PromptService } from '../providers/prompt-service';
import { TrackerService } from '../providers/tracker-service';
import { InitService } from '../providers/init-service';
import { GlobalService } from '../providers/global-service';
import { RadioService } from '../providers/radio-service';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { BackgroundMode } from '@ionic-native/background-mode';
import { SocialSharing } from '@ionic-native/social-sharing';
import { Screenshot } from '@ionic-native/screenshot';
import { Media } from '@ionic-native/media';
import { MusicControls } from '@ionic-native/music-controls';

import { FbrgSmnApp } from './app.component';
import { PlatformMock } from '../../test-config/mocks/platform-browser';

import { BrowserModule } from '@angular/platform-browser';
import { SwingModule } from 'angular2-swing';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpLoaderFactory } from './app.module';

import { GoogleAnalyticsMock } from '@ionic-native-mocks/google-analytics';
import { InAppBrowserMock } from '@ionic-native-mocks/in-app-browser';
import { BackgroundModeMock } from '@ionic-native-mocks/background-mode';
import { ScreenshotMock } from '@ionic-native-mocks/screenshot';
import { MediaMock } from '@ionic-native-mocks/media';
import { SocialSharingMock } from '@ionic-native-mocks/social-sharing';
import { MusicControlsMocks } from '@ionic-native-mocks/music-controls';

import { StatusBarMock } from '@ionic-native-mocks/status-bar';
import { SplashScreenMock } from '@ionic-native-mocks/splash-screen';

describe( 'FbrgSmnApp Component', () => {
    let fixture;
    let component;

    beforeEach( async( () => {
        // TestBed is a module provided by the Angular team to facilitate testing
        // https://angular.io/guide/testing
        TestBed.configureTestingModule( {
            declarations: [ FbrgSmnApp ],
            imports: [
                BrowserModule,
                IonicModule.forRoot( FbrgSmnApp ),
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
                GlobalService,
                InitService,
                PromptService,
                RadioService,
                TrackerService,
                MusicControlsManagerProvider,
                { provide: StatusBar, useClass: StatusBarMock },
                { provide: SplashScreen, useClass: SplashScreenMock },
                { provide: Platform, useClass: PlatformMock },
                { provide: GoogleAnalytics, useClass: GoogleAnalyticsMock },
                { provide: InAppBrowser, useClass: InAppBrowserMock },
                { provide: BackgroundMode, useClass: BackgroundModeMock },
                { provide: SocialSharing, useClass: SocialSharingMock },
                { provide: Screenshot, useClass: ScreenshotMock },
                { provide: Media, useClass: MediaMock },
                { provide: MusicControls, useClass: MusicControlsMocks },
            ]
        } );
    } ) );

    beforeEach( () => {
        fixture = TestBed.createComponent( FbrgSmnApp );
        component = fixture.componentInstance;
    } );

    it( 'should be created', () => {
        expect( component ).toBeDefined();
        expect( component instanceof FbrgSmnApp ).toBe( true );
    } );

    it( 'should have one pages', () => {
        expect( component.pages.length ).toBe( 1 );
    } );

} );
