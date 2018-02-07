import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { IonicModule, NavController, Platform, ViewController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { MusicControls } from '@ionic-native/music-controls';
import { Media } from '@ionic-native/media';
import { BackgroundMode } from '@ionic-native/background-mode';

import { PlatformMock } from '../../../test-config/mocks/platform-browser';
import { NavControllerMock, ViewControllerMock } from 'ionic-mocks';
import { StatusBarMock } from '@ionic-native-mocks/status-bar';
import { SplashScreenMock } from '@ionic-native-mocks/splash-screen';
import { GoogleAnalyticsMock } from '@ionic-native-mocks/google-analytics';
import { InAppBrowserMock } from '@ionic-native-mocks/in-app-browser';
import { MusicControlsMocks } from '@ionic-native-mocks/music-controls';
import { MediaMock } from '@ionic-native-mocks/media';
import { BackgroundModeMock } from '@ionic-native-mocks/background-mode';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { HttpLoaderFactory } from '../../app/app.module';

import { RadioPage } from './radio';
import { GlobalService } from '../../providers/global-service';
import { InitService } from '../../providers/init-service';
import { PromptService } from '../../providers/prompt-service';
import { RadioService } from '../../providers/radio-service';
import { TrackerService } from '../../providers/tracker-service';
import { MusicControlsManagerProvider } from '../../providers/music-controls-manager/music-controls-manager';

import { MainHeaderComponent } from '../../components/main-header/main-header';
import { PlayerComponent } from '../../components/player/player';
import { ShareButtonComponent } from '../../components/share-button/share-button';

describe( 'RadioPage', () => {
    let component: RadioPage;
    let fixture: ComponentFixture<RadioPage>;

    beforeEach( async( () => {
        TestBed.configureTestingModule( {
            declarations: [ RadioPage, MainHeaderComponent, PlayerComponent, ShareButtonComponent ],
            imports: [
                IonicModule.forRoot( RadioPage ),
                TranslateModule.forRoot( {
                    loader: {
                        deps: [ HttpClient ],
                        provide: TranslateLoader,
                        useFactory: ( HttpLoaderFactory ),
                    }
                } )
            ],
            providers: [
                InitService,
                PromptService,
                GlobalService,
                RadioService,
                TrackerService,
                MusicControlsManagerProvider,
                HttpClient,
                HttpHandler,
                { provide: NavController, useFactory: () => NavControllerMock.instance() },
                { provide: ViewController, useFactory: () => ViewControllerMock.instance() },
                { provide: Platform, useClass: PlatformMock},
                { provide: StatusBar, useClass: StatusBarMock },
                { provide: SplashScreen, useClass: SplashScreenMock },
                { provide: GoogleAnalytics, useClass: GoogleAnalyticsMock },
                { provide: MusicControls, useClass: MusicControlsMocks },
                { provide: InAppBrowser, useClass: InAppBrowserMock },
                { provide: Media, useClass: MediaMock },
                { provide: BackgroundMode, useClass: BackgroundModeMock },
            ]
        } );
    } ) );

    beforeEach( () => {
        // create component and test fixture
        fixture = TestBed.createComponent( RadioPage );

        // get test component from the fixture
        component = fixture.componentInstance;
    } );

    afterEach( () => {
        fixture.destroy();
        component = null;
    } );

    it( 'should be created', async () => {
        expect( fixture ).toBeTruthy();
        expect( fixture ).toBeDefined();

        expect( component ).toBeTruthy();
        expect( component ).toBeDefined();
        expect( component instanceof RadioPage ).toBe( true );
    } );

    // it( 'should have expected <h3> text', () => {
    //     fixture.detectChanges();
    //     const h3 = de.nativeElement;
    //     expect( h3.innerText ).toMatch( /ionic/i,
    //         '<h3> should say something about "Ionic"' );
    // } );
    //
    // it( 'should show the favicon as <img>', () => {
    //     fixture.detectChanges();
    //     const img: HTMLImageElement = fixture.debugElement.query( By.css( 'img' ) ).nativeElement;
    //     expect( img.src ).toContain( 'assets/icon/favicon.ico' );
    // } );
} );
