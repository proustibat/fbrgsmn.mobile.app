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
import { GlobalService } from '../../providers/global-service/global-service';
import { InitService } from '../../providers/init-service/init-service';
import { PromptService } from '../../providers/prompt-service/prompt-service';
import { RadioService } from '../../providers/radio-service/radio-service';
import { TrackerService } from '../../providers/tracker-service/tracker-service';
import { MusicControlsManagerProvider } from '../../providers/music-controls-manager/music-controls-manager';

import { MainHeaderComponent } from '../../components/main-header/main-header';
import { PlayerComponent } from '../../components/player/player';
import { ShareButtonComponent } from '../../components/share-button/share-button';

describe( 'RadioPage', () => {
    let component: RadioPage;
    let fixture: ComponentFixture<RadioPage>;
    let originalTimeout;

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
        originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;

        // create component and test fixture
        fixture = TestBed.createComponent( RadioPage );

        // get test component from the fixture
        component = fixture.componentInstance;
    } );

    afterEach( () => {
        fixture.destroy();
        component = null;
        jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    } );

    it( 'should be created', async () => {
        expect( component ).toBeTruthy();
        expect( component ).toBeDefined();
        expect( component instanceof RadioPage ).toBe( true );
    } );

    it( 'should getInitData from initService and prepare service', async ( done ) => {
        const radioComponent = ( component as any );

        spyOn( radioComponent.radioService, 'initLoop' ).and.callThrough();
        const spySuccess = spyOn( radioComponent.initService, 'getInitData' ).and.returnValue(
            Promise.resolve( {
                streamingUrl: 'fakeUrl'
            } )
        );

        radioComponent.onPlatformReady();

        spySuccess.calls.mostRecent().returnValue.then( () => {
            expect( radioComponent.initService.getInitData ).toHaveBeenCalled();
            expect( radioComponent.streamingUrl ).toBeDefined();
            expect( radioComponent.configReady ).toBeTruthy();
            expect( radioComponent.radioService.initLoop ).toHaveBeenCalled();
            done();
        } );
    } );

    it( 'should prompt error if getInitData returns wrong data', async ( done ) => {
        const radioComponent = ( component as any );

        spyOn( radioComponent.prompt, 'presentMessage' ).and.callFake( () => {} );
        const fakeData = {
            content: 'myFakeContent',
            error: 'fakeError',
        };
        const spyError = spyOn( radioComponent.initService, 'getInitData' ).and.returnValue(
            Promise.resolve( fakeData )
        );

        radioComponent.onPlatformReady();

        spyError.calls.mostRecent().returnValue.then( ( data: any ) => {
            expect( radioComponent.prompt.presentMessage ).toHaveBeenCalled();
            expect( data ).toEqual( fakeData );
            done();
        } );
    } );

    it( 'should prompt error if getInitData fails', async ( done ) => {
        const radioComponent = ( component as any );

        spyOn( radioComponent.prompt, 'presentMessage' ).and.callFake( () => {} );
        const spyError = spyOn( radioComponent.initService, 'getInitData' ).and.returnValue(
            Promise.reject( [ 'fakeReason1', 'fakeReason2' ] )
        );

        radioComponent.onPlatformReady();

        spyError.calls.mostRecent().returnValue.catch( errors  => {
            // TODO check if prompt message have been called
            expect().nothing();
            done();
        } );
    } );

    it( 'ionViewDidLoad', async () => {
        const radioComponent = ( component as any );
        radioComponent.ionViewDidLoad();
        expect().nothing();
    } );

    it( 'ionViewDidEnter', async () => {
        const radioComponent = ( component as any );
        radioComponent.ionViewDidEnter();
        expect().nothing();
    } );

    it( 'ionViewDidLeave', async () => {
        const radioComponent = ( component as any );
        radioComponent.ionViewDidLeave();
        expect().nothing();
    } );

    it( 'onNowPlayingChanged', async () => {
        const radioComponent = ( component as any );
        spyOn( radioComponent.player, 'updateMeta' ).and.callFake( () => {} );

        radioComponent.onNowPlayingChanged( {}, [] );
        expect( radioComponent.player.updateMeta ).toHaveBeenCalledWith( {} );
    } );

    it( 'onRadioServiceError', async () => {
        const radioComponent = ( component as any );
        spyOn( radioComponent.prompt, 'presentMessage' ).and.callFake( () => {} );
        radioComponent.onRadioServiceError( 'fakeError' );
        expect( radioComponent.prompt.presentMessage ).toHaveBeenCalled();
    } );
} );
