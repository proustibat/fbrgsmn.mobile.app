import { ComponentFixture, TestBed, async, fakeAsync } from '@angular/core/testing';
import { Events, IonicModule, LoadingController, Platform, ToastController } from 'ionic-angular';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { MusicControls } from '@ionic-native/music-controls';
import { MEDIA_ERROR, MEDIA_STATUS, Media, MediaObject } from '@ionic-native/media';
import { BackgroundMode } from '@ionic-native/background-mode';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { HttpLoaderFactory } from '../../app/app.module';

import { PlatformMock } from '../../../test-config/mocks/platform-browser';
import { GoogleAnalyticsMock } from '@ionic-native-mocks/google-analytics';
import { InAppBrowserMock, InAppBrowserObjectMock } from '@ionic-native-mocks/in-app-browser';
import { MusicControlsMocks } from '@ionic-native-mocks/music-controls';
import { BackgroundModeMock } from '@ionic-native-mocks/background-mode';
import { ToastControllerMock } from 'ionic-mocks';

import { GlobalService } from '../../providers/global-service';
import { PromptService } from '../../providers/prompt-service';
import { TrackerService } from '../../providers/tracker-service';
import { MusicControlsManagerProvider } from '../../providers/music-controls-manager/music-controls-manager';
import { PlayerComponent } from './player';
import { ShareButtonComponent } from '../../components/share-button/share-button';
import { LoadingControllerMock, MediaMock, MediaObjectMock, PromptServiceMock } from '../../../test-config/mocks/ionic';
// import { Observable } from 'rxjs/Rx';
// import { EventEmitter } from '@angular/core';
// import { Subscriber } from 'rxjs/Subscriber';

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
                { provide: MediaObject, useClass: MediaObjectMock },
                { provide: BackgroundMode, useClass: BackgroundModeMock },
                { provide: ToastController, useClass: ToastControllerMock },
                { provide: PromptService, useClass: PromptServiceMock },
                { provide: LoadingController, useClass: LoadingControllerMock },
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

    it( 'should do nothing on play if player is playing',  async () => {
        const player = ( component as any );
        player.isPlaying = true;
        spyOn( player, 'play' ).and.callThrough();
        player.play();
        expect().nothing();
    } );

    it( 'should do nothing on pause if player is not playing',  async () => {
        const player = ( component as any );
        player.isPlaying = false;
        spyOn( player, 'pause' ).and.callThrough();
        player.pause();
        expect().nothing();
    } );

    it( 'should call play when event [MusicControlsManager]play is published and player is not playing', async () => {
        const player = ( component as any );
        player.isPlaying = false;
        // const listener = jasmine.createSpy( 'listener', player.play.bind( player ) ).and.callThrough();
        spyOn( player, 'play' ).and.callThrough();
        spyOn( player, 'startStreamingMedia' ).and.callFake( () => {} );
        spyOn( player.prompt, 'presentLoading' ).and.callFake( () => {} );

        // player.musicControlsManager.events.subscribe( '[MusicControlsManager]play', listener );
        player.musicControlsManager.events.subscribe( '[MusicControlsManager]play', player.play.bind( player ) );
        player.musicControlsManager.events.publish( '[MusicControlsManager]play' );

        expect( player.play ).toHaveBeenCalled();
        expect( player.isButtonActive ).toBeFalsy();
        expect( player.prompt.presentLoading ).toHaveBeenCalledWith( true );
        expect( player.startStreamingMedia ).toHaveBeenCalled();
        expect( player.isPlaying ).toBeTruthy();
        expect( player.playPauseButton ).toEqual( 'pause' );
    } );

    it( 'should call pause when event [MusicControlsManager]pause is published and player is playing', async () => {
        const player = ( component as any );
        player.isPlaying = true;
        player.mediaObject = new MediaObjectMock();
        spyOn( player, 'pause' ).and.callThrough();
        spyOn( player.mediaObject, 'stop' ).and.callFake( () => {} );
        spyOn( player.musicControlsManager, 'updatePlayState' ).and.callFake( () => {} );

        player.musicControlsManager.events.subscribe( '[MusicControlsManager]pause', player.pause.bind( player ) );
        player.musicControlsManager.events.publish( '[MusicControlsManager]pause' );

        expect( player.pause ).toHaveBeenCalled();
        expect( player.mediaObject.stop ).toHaveBeenCalled();
        expect( player.musicControlsManager.updatePlayState ).toHaveBeenCalledWith( false );
        expect( player.playPauseButton ).toEqual( 'play' );
        expect( player.isPlaying ).toBeFalsy();
        expect( player.isLoading ).toBeTruthy();
    } );

    it( 'pauses correctly if cordova is not the platform', async () => {
        const player = ( component as any );
        player.mediaObject = new MediaObjectMock();
        player.isPlaying = true;
        player.plt.is = () => false;
        spyOn( player.mediaObject, 'stop' ).and.callFake( () => {} );
        player.pause();
        expect( player.mediaObject.stop ).not.toHaveBeenCalled();

    } );

    it( 'startStreamingMedia: should create the media if it doesn\'t exist', async () => {
        const player = ( component as any );
        player.mediaObject = undefined;
        const fakeCreateMedia = () => {
            player.mediaObject = new MediaObjectMock();
        };
        spyOn( player, 'createMedia' ).and.callFake( fakeCreateMedia );
        player.startStreamingMedia();
        expect( player.createMedia ).toHaveBeenCalled();
    } );

    it( 'startStreamingMedia: should play the media', async () => {
        const player = ( component as any );
        player.mediaObject = new MediaObjectMock();

        spyOn( player, 'createMedia' ).and.callFake( () => {} );
        spyOn( player.mediaObject, 'play' ).and.callFake( () => {} );

        player.startStreamingMedia();
        expect( player.mediaObject.play ).toHaveBeenCalled();
    } );

    it( 'startStreamingMedia: should call onTrackError if cordova is not the platform', async () => {
        const player = ( component as any );
        player.plt.is = () => false;
        spyOn( player, 'onTrackError' ).and.callFake( () => {} );

        player.startStreamingMedia();

        expect( player.onTrackError ).toHaveBeenCalled();
    } );

    it( 'calls onTrackLoaded on MEDIA_STATUS.RUNNING event received', async () => {
        const player = ( component as any );
        spyOn( player, 'onTrackLoaded' ).and.callThrough();
        spyOn( player.prompt, 'dismissLoading' ).and.callThrough();
        spyOn( player.musicControlsManager, 'updatePlayState' ).and.callThrough();

        player.onMediaStatusUpdate( MEDIA_STATUS.RUNNING );

        expect( player.onTrackLoaded ).toHaveBeenCalled();
        expect( player.isLoading ).toBeFalsy();
        expect( player.prompt.dismissLoading ).toHaveBeenCalled();
        expect( player.isPlaying ).toBeTruthy();
        expect( player.isButtonActive ).toBeTruthy();
        expect( player.musicControlsManager.updatePlayState ).toHaveBeenCalledWith( true );
    } );

    it( 'disables background on MEDIA_STATUS.STOPPED & MEDIA_STATUS.PAUSED events received', async () => {
        const player = ( component as any );
        spyOn( player.backgroundMode, 'disable' ).and.callThrough();

        player.onMediaStatusUpdate( MEDIA_STATUS.STOPPED );
        expect( player.backgroundMode.disable ).toHaveBeenCalled();

        player.onMediaStatusUpdate( MEDIA_STATUS.PAUSED );
        expect( player.backgroundMode.disable ).toHaveBeenCalled();
    } );

    it( 'calls onTrackError when receiving MediaError status', async () => {
        const player = ( component as any );
        spyOn( player, 'onTrackError' ).and.callThrough();

        player.onMediaError( MEDIA_ERROR.NETWORK );
        expect( player.onTrackError ).toHaveBeenCalledWith( MEDIA_ERROR.NETWORK );

        player.onMediaError( -999 );
        expect( player.onTrackError ).toHaveBeenCalledWith( { isFalseError: true } );
    } );

    it( 'updates musicControlsManager when receiving onTrackError and pauses player if playing', async () => {
        const player = ( component as any );
        player.isPlaying = true;
        spyOn( player, 'pause' ).and.callFake( () => {} );
        spyOn( player.musicControlsManager, 'updatePlayState' ).and.callThrough();

        player.onTrackError( MEDIA_ERROR.NETWORK );

        expect( player.pause ).toHaveBeenCalled();
        expect( player.musicControlsManager.updatePlayState ).toHaveBeenCalledWith( false );

    } );

    it( 'resets the UI onTrackError when cordova is not the platform', async ( done ) => {
        const player = ( component as any );
        spyOn( player, 'resetUi' ).and.callThrough();
        player.plt.is = () => false;

        player.onTrackError( MEDIA_ERROR.NETWORK );

        setTimeout( () => {
            expect( player.resetUi ).toHaveBeenCalled();
            expect( player.playPauseButton ).toEqual( 'play' );
            expect( player.isPlaying ).toBeFalsy();
            expect( player.isLoading ).toBeTruthy();
            done();
        }, 1 );
    } );

    it( 'togglePlayPause toggles correctly depending on isPlaying variable',  async () => {
        const player = ( component as any );

        spyOn( player, 'play' ).and.callFake( () => {} );
        spyOn( player, 'pause' ).and.callFake( () => {} );

        player.isPlaying = false;
        player.togglePlayPause();
        expect( player.play ).toHaveBeenCalled();

        player.isPlaying = true;
        player.togglePlayPause();
        expect( player.pause ).toHaveBeenCalled();
    } );

    it( 'updates data',  async () => {
        const player = ( component as any );

        spyOn( player, 'updateShareOptions' ).and.callFake( () => {} );
        spyOn( player, 'updateTrackingOptions' ).and.callFake( () => {} );
        spyOn( player.musicControlsManager, 'init' ).and.callFake( () => {} );

        player.isPlaying = true;
        const currentSong = 'blabliblou';
        player.updateMeta( currentSong );

        expect( player.updateShareOptions ).toHaveBeenCalled();
        expect( player.updateTrackingOptions ).toHaveBeenCalled();
        expect( player.musicControlsManager.init ).toHaveBeenCalledWith( currentSong, player.isPlaying );

    } );

    it( 'updates share options and tracking options',  async () => {
        const player = ( component as any );
        player.updateShareOptions();
        player.updateTrackingOptions();
        expect().nothing();
    } );
} );
