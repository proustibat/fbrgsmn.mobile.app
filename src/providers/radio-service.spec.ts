import { TestBed, async, getTestBed, inject } from '@angular/core/testing';
import { RadioService } from './radio-service';
import {HttpClient, HttpEvent, HttpEventType, HttpHandler} from '@angular/common/http';
import { Events } from 'ionic-angular';
import { EventsMock } from 'ionic-mocks';
import { GlobalService } from './global-service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

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

    // beforeEach( async( () => {
    //     TestBed.configureTestingModule( moduleDef ).compileComponents();
    // } ) );

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

    it( 'getMatchedCover: null', () => {
        const song = {
            title: 'The Beatles - Drive My Car',
            album_cover: 'https://lastfm-img2.akamaized.net/i/u/300x300/72ed10a859fb4c1fb29a546078ec737d.png'
        };
        const matchSong = service.getMatchedCover( song );
        expect( matchSong ).toBeNull();
    } );

    it( 'getMatchedCover: default', () => {
        const song = {
            title: 'sample',
            album_cover: 'https://lastfm-img2.akamaized.net/i/u/300x300/72ed10a859fb4c1fb29a546078ec737d.png'
        };
        const matchSong = service.getMatchedCover( song );
        expect( matchSong ).toEqual( GlobalService.COVER_DEFAULT );
    } );

    it( 'getMatchedCover: friday wear', () => {
        const song = {
            title: 'Friday Wear',
            album_cover: 'https://lastfm-img2.akamaized.net/i/u/300x300/72ed10a859fb4c1fb29a546078ec737d.png'
        };
        const matchSong = service.getMatchedCover( song );
        expect( matchSong ).toEqual( GlobalService.COVER_DEFAULT_FRIDAY_WEAR );
    } );

    it( 'getMatchedCover: nouveaute', () => {
        const song = {
            title: 'nouveaute',
            album_cover: 'https://lastfm-img2.akamaized.net/i/u/300x300/72ed10a859fb4c1fb29a546078ec737d.png'
        };
        const matchSong = service.getMatchedCover( song );
        expect( matchSong ).toEqual( GlobalService.COVER_DEFAULT_NOUVEAUTE );
    } );

    it( 'should be async', done => {
        service.someAsyncFunction().then( result => {
            expect( result ).toBe( 'coucou' );
            done();
        } );
    } );

    // it( 'should get users', () => {
    //     const dummySongs = { songs: [
    //             {
    //                 album_cover: 'https://lastfm-img2.akamaized.net/i/u/300x300/72ed10a859fb4c1fb29a546078ec737d.png',
    //                 title: 'The Beatles - Drive My Car'
    //             },
    //             {
    //                 album_cover: 'http://faubourgsimone.com/player/medias/imgs/pochette-default.jpg',
    //                 title: 'Unknown - Sample faites attention'
    //             },
    //             {
    //                 album_cover: 'https://lastfm-img2.akamaized.net/i/u/300x300/72ed10a859fb4c1fb29a546078ec737d.png',
    //                 title: 'The Doors - Love Me Two Times'
    //             },
    //             {
    //                 album_cover: 'https://lastfm-img2.akamaized.net/i/u/300x300/72ed10a859fb4c1fb29a546078ec737d.png',
    //                 title: 'Jef Barbara - Theme From Our Weekend'
    //             },
    //             {
    //                 album_cover: 'http://faubourgsimone.com/player/medias/imgs/pochette-default.jpg',
    //                 title: 'Faubourg Simone - Flash Calepin Obsession Marlene'
    //             },
    //             {
    //                 album_cover: 'http://faubourgsimone.com/player/medias/imgs/pochette-default.jpg',
    //                 title: 'Unknown - Sample train'
    //             },
    //             {
    //                 album_cover: 'https://lastfm-img2.akamaized.net/i/u/300x300/72ed10a859fb4c1fb29a546078ec737d.png',
    //                 title: 'August Albert - Chagrin d Amour'
    //             },
    //             {
    //                 album_cover: 'https://lastfm-img2.akamaized.net/i/u/300x300/72ed10a859fb4c1fb29a546078ec737d.png',
    //                 title: 'The Seasons - The Way It Goes'
    //             },
    //             {
    //                 album_cover: 'https://lastfm-img2.akamaized.net/i/u/300x300/6a20981e0f4df4fbce694890a976bd8b.png',
    //                 title: 'Flow Dynamics - Live In the Mix'
    //             },
    //             {
    //                 album_cover: 'http://faubourgsimone.com/player/medias/imgs/pochette-default.jpg',
    //                 title: 'Unknown - sample yolalaitou'
    //             } ] };
    //
    //     service.getThisFuckingData().subscribe( ( event: HttpEvent<any> ) => {
    //         switch ( event.type ) {
    //             case HttpEventType.Response:
    //                 expect( event.body ).toEqual( dummySongs );
    //         }
    //     } );
    //
    //     const mockReq = httpMock.expectOne( GlobalService.URL_API_COVERS );
    //
    //     expect( mockReq.cancelled ).toBeFalsy();
    //     expect( mockReq.request.responseType ).toEqual( 'json' );
    //
    //     mockReq.flush( dummySongs );
    //
    //     httpMock.verify();
    // } );

    // it( 'should return 10 songs', () => {
    //     const dummySongs = { songs: [
    //         {
    //             album_cover: 'https://lastfm-img2.akamaized.net/i/u/300x300/72ed10a859fb4c1fb29a546078ec737d.png',
    //             title: 'The Beatles - Drive My Car'
    //         },
    //         {
    //             album_cover: 'http://faubourgsimone.com/player/medias/imgs/pochette-default.jpg',
    //             title: 'Unknown - Sample faites attention'
    //         },
    //         {
    //             album_cover: 'https://lastfm-img2.akamaized.net/i/u/300x300/72ed10a859fb4c1fb29a546078ec737d.png',
    //             title: 'The Doors - Love Me Two Times'
    //         },
    //         {
    //             album_cover: 'https://lastfm-img2.akamaized.net/i/u/300x300/72ed10a859fb4c1fb29a546078ec737d.png',
    //             title: 'Jef Barbara - Theme From Our Weekend'
    //         },
    //         {
    //             album_cover: 'http://faubourgsimone.com/player/medias/imgs/pochette-default.jpg',
    //             title: 'Faubourg Simone - Flash Calepin Obsession Marlene'
    //         },
    //         {
    //             album_cover: 'http://faubourgsimone.com/player/medias/imgs/pochette-default.jpg',
    //             title: 'Unknown - Sample train'
    //         },
    //         {
    //             album_cover: 'https://lastfm-img2.akamaized.net/i/u/300x300/72ed10a859fb4c1fb29a546078ec737d.png',
    //             title: 'August Albert - Chagrin d Amour'
    //         },
    //         {
    //             album_cover: 'https://lastfm-img2.akamaized.net/i/u/300x300/72ed10a859fb4c1fb29a546078ec737d.png',
    //             title: 'The Seasons - The Way It Goes'
    //         },
    //         {
    //             album_cover: 'https://lastfm-img2.akamaized.net/i/u/300x300/6a20981e0f4df4fbce694890a976bd8b.png',
    //             title: 'Flow Dynamics - Live In the Mix'
    //         },
    //         {
    //             album_cover: 'http://faubourgsimone.com/player/medias/imgs/pochette-default.jpg',
    //             title: 'Unknown - sample yolalaitou'
    //         } ] };
    //     service.getCoversObservable().subscribe( results => {
    //         expect( true ).toBe( true );
    //         // expect( results ).toBeDefined();
    //         // expect( results.songs ).toBe( 10 );
    //     } );
    //
    //     // const req = httpMock.expectOne( GlobalService.URL_API_COVERS ) ;
    //     // expect( req.request.method ).toBe( 'GET' );
    //     // req.flush( dummySongs );
    // } );

} );
