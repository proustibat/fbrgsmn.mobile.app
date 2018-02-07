import {ComponentFixture, TestBed, async, fakeAsync} from '@angular/core/testing';
import { Events, IonicModule, LoadingController, Platform, ToastController } from 'ionic-angular';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { MusicControls } from '@ionic-native/music-controls';
import { Media, MediaObject } from '@ionic-native/media';
import { BackgroundMode } from '@ionic-native/background-mode';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { HttpLoaderFactory } from '../../app/app.module';

import { PlatformMock } from '../../../test-config/mocks/platform-browser';
import { GoogleAnalyticsMock } from '@ionic-native-mocks/google-analytics';
import {InAppBrowserMock, InAppBrowserObjectMock} from '@ionic-native-mocks/in-app-browser';
import { MusicControlsMocks } from '@ionic-native-mocks/music-controls';
// import { MediaMock } from '@ionic-native-mocks/media';
import { BackgroundModeMock } from '@ionic-native-mocks/background-mode';
import { ToastControllerMock } from 'ionic-mocks';

import { GlobalService } from '../../providers/global-service';
import { PromptService } from '../../providers/prompt-service';
import { TrackerService } from '../../providers/tracker-service';
import { MusicControlsManagerProvider } from '../../providers/music-controls-manager/music-controls-manager';
import { PlayerComponent } from './player';
import { ShareButtonComponent } from '../../components/share-button/share-button';
import { LoadingControllerMock, MediaMock, MediaObjectMock, PromptServiceMock } from '../../../test-config/mocks/ionic';
import {Observable} from "rxjs/Rx";
import {EventEmitter} from "@angular/core";
import {Subscriber} from "rxjs/Subscriber";

describe( 'PlayerComponent', () => {
    let component: PlayerComponent;
    let fixture: ComponentFixture<PlayerComponent>;
    let events: Events;

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

        events = new Events();
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

    // it( 'should call listener when event is published', () => {
    //     const eventParams = [{}, {}, {}];
    //
    //     const listener = jasmine.createSpy( 'listener' );
    //     events.subscribe( 'test', listener );
    //     events.publish( 'test', ...eventParams );
    //
    //     expect( listener ).toHaveBeenCalledWith( ...eventParams );
    // } );

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

    // it( 'creates Media', async () => {
    //     const player = ( component as any );
    //     player.media = new MediaMock();
    //     // player.mediaObject = new MediaObjectMock();
    //     const fakeCreateMedia = () => {
    //         player.mediaObject = new MediaObjectMock();
    //         player.mediaObject.onStatusUpdate = new Observable<any>( ( subscriber: Subscriber<string> ) => subscriber.complete() );
    //         spyOn( player.mediaObject.onStatusUpdate, 'subscribe' ).and.callFake( () => {} );
    //     };
    //     spyOn( player.media, 'create' ).and.callFake( fakeCreateMedia );
    //
    //     player.createMedia();
    //
    //     expect( player.media.create ).toHaveBeenCalledWith( player.streamingUrl );
    //     // expect( spy.calls.any() ).toHaveBeenCalled();
    // } );

} );
