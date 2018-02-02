import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { IonicModule, Platform } from 'ionic-angular/index';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { MusicControls } from '@ionic-native/music-controls';
import { Media } from '@ionic-native/media';
import { BackgroundMode } from '@ionic-native/background-mode';

import { PlatformMock } from '../../../test-config/mocks/platform-browser';
import { GoogleAnalyticsMock } from '@ionic-native-mocks/google-analytics';
import { InAppBrowserMock } from '@ionic-native-mocks/in-app-browser';
import { MusicControlsMocks } from '@ionic-native-mocks/music-controls';
import { MediaMock } from '@ionic-native-mocks/media';
import { BackgroundModeMock } from '@ionic-native-mocks/background-mode';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { HttpLoaderFactory } from '../../app/app.module';

import { GlobalService } from '../../providers/global-service';
import { PromptService } from '../../providers/prompt-service';
import { TrackerService } from '../../providers/tracker-service';
import { MusicControlsManagerProvider } from '../../providers/music-controls-manager/music-controls-manager';

import { PlayerComponent } from './player';
import { ShareButtonComponent } from '../../components/share-button/share-button';
import {ToastControllerMock} from "ionic-mocks";
import {ToastController} from "ionic-angular";

describe( 'PlayerComponent', () => {
    let component: PlayerComponent;
    let fixture: ComponentFixture<PlayerComponent>;

    beforeEach( async( () => {
        TestBed.configureTestingModule( {
            declarations: [ PlayerComponent, ShareButtonComponent ],
            imports: [
                IonicModule.forRoot( PlayerComponent ),
                TranslateModule.forRoot( {
                    loader: {
                        deps: [ HttpClient ],
                        provide: TranslateLoader,
                        useFactory: ( HttpLoaderFactory ),
                    }
                } )
            ],
            providers: [
                PromptService,
                GlobalService,
                TrackerService,
                MusicControlsManagerProvider,
                HttpClient,
                HttpHandler,
                { provide: Platform, useClass: PlatformMock},
                { provide: GoogleAnalytics, useClass: GoogleAnalyticsMock },
                { provide: MusicControls, useClass: MusicControlsMocks },
                { provide: InAppBrowser, useClass: InAppBrowserMock },
                { provide: Media, useClass: MediaMock },
                { provide: BackgroundMode, useClass: BackgroundModeMock },
                { provide: ToastController, useClass: ToastControllerMock },
            ]
        } );
    } ) );

    beforeEach( () => {
        // create component and test fixture
        fixture = TestBed.createComponent( PlayerComponent );
        fixture.detectChanges();

        // get test component from the fixture
        component = fixture.componentInstance;
    } );

    afterEach( () => {
        fixture.destroy();
    } );

    it( 'should be created', async () => {
        expect( component ).toBeDefined();
        expect( component instanceof PlayerComponent ).toBe( true );
    } );

} );
