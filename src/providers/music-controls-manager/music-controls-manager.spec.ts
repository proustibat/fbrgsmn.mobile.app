import { TestBed, async, getTestBed } from '@angular/core/testing';

import { MusicControlsManagerProvider } from './music-controls-manager';

import { HttpClient, HttpHandler } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpLoaderFactory } from '../../app/app.module';

import { Events, Platform } from 'ionic-angular';
import { MusicControls } from '@ionic-native/music-controls';
import { TrackerService } from '../tracker-service/tracker-service';
import { GoogleAnalytics } from '@ionic-native/google-analytics';

import { PlatformMock } from '../../../test-config/mocks/platform-browser';
import { MusicControlsMocks } from '@ionic-native-mocks/music-controls';
import { GoogleAnalyticsMock } from '@ionic-native-mocks/google-analytics';
import { ICoverSong, ISong } from '../../interfaces';
import { Observable } from 'rxjs';

describe( 'Provider: MusicControlsManagerProvider', () => {

    let httpMock: HttpTestingController;
    let injector;
    let service;
    let originalTimeout;

    const moduleDef = {
        declarations: [

        ],

        imports: [
            HttpClientTestingModule,
            TranslateModule.forRoot( {
                loader: {
                    deps: [ HttpClient ],
                    provide: TranslateLoader,
                    useFactory: ( HttpLoaderFactory ),
                }
            } )
        ],

        providers: [
            MusicControlsManagerProvider,
            HttpClient,
            HttpHandler,
            TrackerService,
            Events,
            { provide: Platform, useClass: PlatformMock },
            { provide: MusicControls, useClass: MusicControlsMocks },
            { provide: GoogleAnalytics, useClass: GoogleAnalyticsMock },
        ],

    };

    beforeEach( async () => {
        TestBed.configureTestingModule( moduleDef );
    } );

    beforeEach( () => {
        originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
        injector = getTestBed();
        service = injector.get( MusicControlsManagerProvider );
        httpMock = injector.get( HttpTestingController );
    } );

    afterEach( () => {
        injector = null;
        httpMock = null;
        service = null;
        jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    } );

    it( 'should be created', () => {
        expect( service ).toBeTruthy();
        expect( service ).toBeDefined();
        expect( service instanceof MusicControlsManagerProvider ).toBe( true );
    } );

    it( 'should call onPlatformReady when calling init method then creates music contols', ( done ) => {
        service.plt.is = () => true;
        const spy = spyOn( service.plt, 'ready' ).and.callThrough();
        spyOn( service, 'onPlatformReady' ).and.callThrough();
        spyOn( service, 'destroyMusicControls' ).and.callThrough();
        spyOn( service, 'createMusicControls' ).and.callFake( () => {} );
        service.init( {
            artist: 'fakeArtist',
            cover: { jpg: 'fakeJpg', svg: 'fakeSvg' },
            title: 'fakeTitle',
            track: 'fakeTrack',
        }, true );

        spy.calls.mostRecent().returnValue.then( () => {
            expect( service.plt.ready ).toHaveBeenCalled();
            expect( service.onPlatformReady ).toHaveBeenCalled();
            expect( service.destroyMusicControls ).toHaveBeenCalled();
            expect( service.createMusicControls ).toHaveBeenCalled();
            done();
        } );
    } );

    it( 'should do nothing on platformReady if platform is not cordova', ( done ) => {
        service.plt.is = () => false;
        const spy = spyOn( service.plt, 'ready' ).and.callThrough();
        spyOn( service, 'onPlatformReady' ).and.callThrough();
        spyOn( service, 'destroyMusicControls' ).and.callFake( () => {} );
        spyOn( service, 'createMusicControls' ).and.callFake( () => {} );
        service.init( {
            artist: 'fakeArtist',
            cover: { jpg: 'fakeJpg', svg: 'fakeSvg' },
            title: 'fakeTitle',
            track: 'fakeTrack',
        }, true );

        spy.calls.mostRecent().returnValue.then( () => {
            expect( service.plt.ready ).toHaveBeenCalled();
            expect( service.onPlatformReady ).toHaveBeenCalled();
            expect( service.destroyMusicControls ).not.toHaveBeenCalled();
            expect( service.createMusicControls ).not.toHaveBeenCalled();
            done();
        } );
    } );

    it( 'should create controls and listen events', ( done ) => {
        const cover: ICoverSong = { jpg: 'fakeJpg', svg: 'fakeSvg' };
        const currentSong: ISong = {
            artist: 'fakeArtist',
            cover,
            title: 'fakeTitle',
            track: 'fakeTrack'
        };
        const spy = spyOn( service.musicControls, 'create' ).and.returnValue( Promise.resolve( true ) );
        spyOn( service.musicControls, 'subscribe' ).and.returnValue( new Observable( () => {} ) );
        // spyOn( service.musicControls, 'subscribe' ).and.callFake( () => {} );
        spyOn( service.musicControls, 'listen' ).and.callFake( () => {} );

        service.createMusicControls( currentSong, true );

        spy.calls.mostRecent().returnValue.then( () => {
            expect( service.musicControls.create ).toHaveBeenCalled();
            expect( service.musicControls.subscribe ).toHaveBeenCalled();
            expect( service.musicControls.listen ).toHaveBeenCalled();
            done();
        } );
    } );

    it( 'updates state if platform is cordova', () => {
        service.plt.is = () => true;
        spyOn( service.musicControls, 'updateIsPlaying' ).and.callFake( () => {} );
        service.updatePlayState( true );
        expect( service.musicControls.updateIsPlaying ).toHaveBeenCalledWith( true );
    } );

    it( 'doesn\'t updates state if platform is not cordova', () => {
        service.plt.is = () => false;
        spyOn( service.musicControls, 'updateIsPlaying' ).and.callFake( () => {} );
        service.updatePlayState( true );
        expect( service.musicControls.updateIsPlaying ).not.toHaveBeenCalled();
    } );

    it( 'handles musicControls events', async ( done ) => {
        service.onMusicControlsEvent( '{"message": "blabliblou"}' );
        expect().nothing();

        service.onMusicControlsEvent( '{"message": "music-controls-toggle-play-pause"}' );
        expect().nothing();

        spyOn( service, 'destroyMusicControls' ).and.callFake( () => {} );
        service.onMusicControlsEvent( '{"message": "music-controls-destroy"}' );
        expect( service.destroyMusicControls ).toHaveBeenCalled();

        service.events.subscribe( '[MusicControlsManager]play', () => {
            expect().nothing();
            done();
        } );
        service.events.subscribe( '[MusicControlsManager]pause', () => {
            expect().nothing();
            done();
        } );
        service.onMusicControlsEvent( '{"message": "music-controls-play"}' );
        service.onMusicControlsEvent( '{"message": "music-controls-pause"}' );

    } );

} );
