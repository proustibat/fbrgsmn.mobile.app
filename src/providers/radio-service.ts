import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GlobalService } from './global-service';
import { Events } from 'ionic-angular';
/* tslint:disable:no-import-side-effect */
import 'rxjs/add/operator/map';
/* tslint:enable:no-import-side-effect */
import { ICoverSong, ISong } from '../interfaces';

@Injectable()
export class RadioService {

    private static TAGS = {
        DEFAULT: [
            'sample',
            'jingle',
            'faubourg simone',
            'fabourg simone', // lol
            'flash calepin',
        ],
        FRIDAY_WEAR: [
            'Friday Wear',
        ],
        NOUVEAUTE: [
            'nouveauté',
            'nothing',
            'nouveaute',
            'college'
        ]
    };

    private loopInterval = 3000;
    private timer: any;
    private currentSong: ISong;
    private lastSongs: ISong[];

    constructor ( public http: HttpClient, private events: Events ) { }

    public initLoop ( interval?: number ) {
        if ( this.timer ) {
            clearTimeout( this.timer );
        }
        this.getApiSongs()
            .then( ( data: any ) => {
                const hasChanged = !this.currentSong || ( this.currentSong.title !== data.songs[0].title );
                if ( hasChanged ) {
                    this.lastSongs = data.songs.map( song => {
                        return {
                            artist: song.title.split( ' - ' )[0],
                            cover: song.cover,
                            title: song.title || '',
                            track: song.title.split( ' - ' )[1]
                        };
                    } );
                    this.currentSong = this.lastSongs.shift();
                    this.events.publish( '[RadioService]now-playing-change', this.currentSong, this.lastSongs );
                }
                this.timer = setTimeout( () => this.initLoop(), interval ? interval : this.loopInterval );
            } )
            .catch( error => {
                console.log( error );
                // TODO : verifier que c'est entendu
                this.events.publish( '[RadioService]error', error );
            } );
    }

    public getApiSongs (): Promise<any> {
        return new Promise( resolve => {
            this.http.get( GlobalService.URL_API_COVERS ).subscribe( data => {
                resolve( this.filterDefaultCovers( data ) );
            }, err => {
                return new Error( 'This request has failed ' + err );
            } );
        } );
    }

    /**
     * We may have to change the cover returned by theAPI
     * @param data
     * @returns {any}
     */
    private filterDefaultCovers ( data ): any {
        data.songs = data.songs.map( song => {

            let coverToGet: ICoverSong = null;

            if ( coverToGet == null ) {
                coverToGet = this.getMatchedCover( song );
            }

            if ( coverToGet === null ) {
                coverToGet = {
                    jpg: song.album_cover,
                    svg: song.album_cover
                };
            }

            return {
                cover: coverToGet,
                title: song.title
            };
        } );
        return data;
    }

    /**
     * Return a special cover if title of the song contains any
     * specific tags in RadioService.TAGS.DEFAULT,
     * RadioService.TAGS.NOUVEAUTE or in RadioService.TAGS.FRIDAY_WEAR.
     * Depending in which array the tag is matching,
     * returns a default Cover from GlobalService
     * @param song
     * @returns {ICoverSong}
     */
    private getMatchedCover( song: any ): ICoverSong {

        if ( song.album_cover.indexOf( 'pochette-default' ) > -1 ) {
            return GlobalService.COVER_DEFAULT;
        }

        let cover = null;

        const tagInIt = this.lookForMatch( song.title );

        if ( tagInIt === RadioService.TAGS.FRIDAY_WEAR ) {
            cover = GlobalService.COVER_DEFAULT_FRIDAY_WEAR;
        }
        if ( tagInIt === RadioService.TAGS.NOUVEAUTE ) {
            cover = GlobalService.COVER_DEFAULT_NOUVEAUTE;
        }
        if ( tagInIt === RadioService.TAGS.DEFAULT ) {
            cover = GlobalService.COVER_DEFAULT;
        }

        return cover;
    }

    /**
     * Checks if title contains any tag of the arrays (default friday
     * wear tags, default nouveaute tags, or simply default tags
     * If an array of tags matches, returns this array
     * @param {string} title
     * @returns {string[]}
     */
    private lookForMatch( title: string ): string[] {
        return [
            RadioService.TAGS.FRIDAY_WEAR,
            RadioService.TAGS.NOUVEAUTE,
            RadioService.TAGS.DEFAULT
        ]
            .find( tagArray => !!( tagArray.find( tag => title.toLowerCase().indexOf( tag.toLowerCase() ) > -1 ) ) );
    }
}
