import { TestBed, getTestBed, inject } from '@angular/core/testing';
import { RadioService } from './radio-service';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { Events } from 'ionic-angular';
import { EventsMock } from 'ionic-mocks';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { GlobalService } from '../global-service/global-service';

describe( 'Provider: RadioService', () => {

    let httpMock: HttpTestingController;
    let injector;
    let service;
    const moduleDef = {
        declarations: [

        ],

        providers: [
            RadioService,
            HttpClient,
            HttpHandler,
            { provide: Events, useClass: EventsMock },
        ],

        imports: [ HttpClientTestingModule ],
    };

    beforeEach( () => {
        injector = getTestBed();
        TestBed.configureTestingModule( moduleDef );
        service = injector.get( RadioService );
        httpMock = injector.get( HttpTestingController );
    } );

    it( 'should be created', () => {
        expect( service ).toBeTruthy();
        expect( service ).toBeDefined();
        expect( service instanceof RadioService ).toBe( true );
    } );

    it( 'initLoop', () => {
        service.initLoop();
        expect().nothing();
    } );

    it( 'filterDefaultCovers', () => {
        const songs = {songs: [
            {
                album_cover: 'https://lastfm-img2.akamaized.net/i/u/300x300/72ed10a859fb4c1fb29a546078ec737d.png',
                title: 'The Beatles - Drive My Car'
            },
            {
                album_cover: 'http://faubourgsimone.com/player/medias/imgs/pochette-default.jpg',
                title: 'Unknown - Sample faites attention'
            },
            {
                album_cover: 'https://lastfm-img2.akamaized.net/i/u/300x300/72ed10a859fb4c1fb29a546078ec737d.png',
                title: 'The Doors - Love Me Two Times'
            },
            {
                album_cover: 'https://lastfm-img2.akamaized.net/i/u/300x300/72ed10a859fb4c1fb29a546078ec737d.png',
                title: 'Jef Barbara - Theme From Our Weekend'
            },
            {
                album_cover: 'http://faubourgsimone.com/player/medias/imgs/pochette-default.jpg',
                title: 'Faubourg Simone - Flash Calepin Obsession Marlene'
            },
            {
                album_cover: 'http://faubourgsimone.com/player/medias/imgs/pochette-default.jpg',
                title: 'Unknown - Sample train'
            },
            {
                album_cover: 'https://lastfm-img2.akamaized.net/i/u/300x300/72ed10a859fb4c1fb29a546078ec737d.png',
                title: 'August Albert - Chagrin d Amour'
            },
            {
                album_cover: 'https://lastfm-img2.akamaized.net/i/u/300x300/72ed10a859fb4c1fb29a546078ec737d.png',
                title: 'The Seasons - The Way It Goes'
            },
            {
                album_cover: 'https://lastfm-img2.akamaized.net/i/u/300x300/6a20981e0f4df4fbce694890a976bd8b.png',
                title: 'Flow Dynamics - Live In the Mix'
            },
            {
                album_cover: 'http://faubourgsimone.com/player/medias/imgs/pochette-default.jpg',
                title: 'Unknown - sample yolalaitou'
            } ] };
        const data = service.filterDefaultCovers( songs );
        expect( typeof( data ) ).toEqual( 'object' );
    } );

    it( 'should be async', done => {
        service.someAsyncFunction().then( result => {
            expect( result ).toBe( 'coucou' );
            done();
        } );
    } );

    it( 'returns null if there\'s no match', () => {
        const song = {
            album_cover: 'https://lastfm-img2.akamaized.net/i/u/300x300/72ed10a859fb4c1fb29a546078ec737d.png',
            title: 'The Beatles - Drive My Car',
        };
        const matchSong = service.getMatchedCover( song );
        expect( matchSong ).toBeNull();
    } );

    it( 'returns default cover if it matches with', () => {
        const song = {
            album_cover: 'https://lastfm-img2.akamaized.net/i/u/300x300/72ed10a859fb4c1fb29a546078ec737d.png',
            title: 'sample',
        };
        const matchSong = service.getMatchedCover( song );
        expect( matchSong ).toEqual( GlobalService.COVER_DEFAULT );
    } );

    it( 'returns default friday wear if it matches with', () => {
        const song = {
            album_cover: 'https://lastfm-img2.akamaized.net/i/u/300x300/72ed10a859fb4c1fb29a546078ec737d.png',
            title: 'Friday Wear',
        };
        const matchSong = service.getMatchedCover( song );
        expect( matchSong ).toEqual( GlobalService.COVER_DEFAULT_FRIDAY_WEAR );
    } );

    it( 'returns default nouveaute if it matches with', () => {
        const song = {
            album_cover: 'https://lastfm-img2.akamaized.net/i/u/300x300/72ed10a859fb4c1fb29a546078ec737d.png',
            title: 'nouveaute',
        };
        const matchSong = service.getMatchedCover( song );
        expect( matchSong ).toEqual( GlobalService.COVER_DEFAULT_NOUVEAUTE );
    } );
} );
