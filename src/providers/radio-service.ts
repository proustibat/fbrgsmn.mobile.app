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

    private loopInterval = 3000;
    private timer: any;
    private currentSong: ISong;
    private lastSongs: ISong[];
    constructor ( public http: HttpClient, private vars: GlobalService, private events: Events ) { }

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

    public getApiSongs () {
        return new Promise( resolve => {
            this.http.get( GlobalService.URL_API_COVERS ).subscribe( data => {
                resolve( this.filterDefaultCovers( data ) );
            }, err => {
                return new Error( 'This request has failed ' + err );
            } );
        } );
    }

    public filterDefaultCovers ( data ) {
        const defaultTags = [
            'sample',
            'jingle',
            'faubourg simone',
            'fabourg simone', // lol
            'flash calepin'
        ];

        const dfltTagsFridayWear = [
            'Friday Wear'
        ];

        const dfltTagsNouveaute = [
            'nouveauté',
            'nothing',
            'nouveaute'
        ];

        data.songs = data.songs.map( song => {

            const checkIfTagFor = ( titleToCompare: string, tagArray: string[], coverIfFound: any ) : any => {
                // todo: remoe that dirty stuff
                /* tslint:disable:no-shadowed-variable */
                let coverToGet = null;
                // Vérifie si le tableau de tags comprend une expression dans
                // le titre courant si c'est le cas, renvoie la cover associee
                tagArray.forEach( ( tag, index ) => {
                    if ( titleToCompare.toLowerCase().indexOf( tag.toLowerCase() ) > -1 ) {
                        coverToGet = coverIfFound;
                        return false;
                    }
                } );
                return coverToGet;
                /* tslint:enable:no-shadowed-variable */
            };

            let coverToGet: ICoverSong = null;
            if ( song.album_cover.indexOf( 'pochette-default' ) > -1 ) {
                coverToGet = GlobalService.COVER_DEFAULT;
            }
            // url de friday wear
            if ( coverToGet === null ) {
                coverToGet = checkIfTagFor( song.title, dfltTagsFridayWear, GlobalService.COVER_DEFAULT_FRIDAY_WEAR );
            }
            // url des nouveautés
            if ( coverToGet === null ) {
                coverToGet = checkIfTagFor( song.title, dfltTagsNouveaute, GlobalService.COVER_DEFAULT_NOUVEAUTE );
            }
            // url si tag par défaut
            if ( coverToGet === null ) {
                coverToGet = checkIfTagFor( song.title, defaultTags, GlobalService.COVER_DEFAULT );
            }
            // url de l'api
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
}
