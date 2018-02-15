import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { PromptService } from '../prompt-service/prompt-service';
import { IFBServiceRes, ISong } from '../../interfaces';

@Injectable()
export class FacebookServiceProvider {

    public isLogged = false;
    private permissions = [
        'public_profile',
        'email',
        'user_actions.music',
        'user_likes',
        'user_posts'
    ];

    private userId: string;
    private accessToken: string;

    constructor(
        public http: HttpClient,
        private fb: Facebook,
        private prompt: PromptService,
    ) {
        console.log( 'Hello FacebookServiceProvider Provider' );
    }

    public login() {
        console.log( 'FacebookService.login' );
        return new Promise( async ( resolve, reject ) => {
            await this.fb.getLoginStatus()
                .then( response => {
                    console.log( '  -> getLoginStatus: ', response );
                    this.isLogged = response.status === 'connected';
                    if ( this.isLogged ) {
                        this.userId = response.authResponse.userID;
                        this.accessToken = response.authResponse.accessToken;
                        resolve( true );
                    }
                } )
                .catch( reason => { reject( reason ); } );

            if ( !this.isLogged ) {
                await this.fb.login( this.permissions )
                    .then( ( res: FacebookLoginResponse ) => {
                        console.log( '  -> login: ', res );
                        this.userId = res.authResponse.userID;
                        this.accessToken = res.authResponse.accessToken;
                        this.isLogged = true;
                        resolve( true );
                    } )
                    .catch( reason => { reject( reason ); } );
            }
        } );
    }

    /**
     * getBasicInfo
     * @returns {Promise<IFBServiceRes>}
     */
    public async getBasicInfo(): Promise<any> {
        console.log( 'FacebookService.getBasicInfo' );
        const publicProfileDetails = [
            'id',
            'cover',
            'name',
            'first_name',
            'last_name',
            'age_range',
            'link',
            'gender',
            'locale',
            'picture',
            'timezone',
            'updated_time',
            'verified',
        ];
        const requestPath = `me?fields=${ publicProfileDetails.join( ',' ) },email`;
        return this.getApi( requestPath );
    }

    /**
     * getMusicListens
     * @returns {Promise<IFBServiceRes>}
     */
    public async getMusicListens(): Promise<any> {
        console.log( 'FacebookService.getMusicListens' );
        const requestPath = 'me/music.listens';
        return this.getApi( requestPath );
    }

    /**
     * getMusicListens
     * @returns {Promise<IFBServiceRes>}
     */
    public async getRadioStation(): Promise<any> {
        console.log( 'FacebookService.getRadioStation' );
        const requestPath = '/me/objects/music.radio_station';
        return this.getApi( requestPath );
    }

    /**
     * postDialogSimple
     * @param {ISong} song
     * @returns {Promise<any>}
     */
    public postDialogSimple( song: ISong ): Promise<any> {
        console.log( 'FacebookService.postDialogSimple' );
        const elImg: HTMLElement = document.createElement( 'textarea' );
        elImg.innerHTML = song.cover.jpg.toString();
        const options = {
            caption: 'En ce moment sur Faubourg Simone',
            description: `J'ecoute ${ song.track } par ${ song.artist }`,
            href: 'http://faubourgsimone.paris',
            method: 'share',
            picture: elImg.innerHTML,
            //     share_native: true //IOS ONLY
        };
        return this.fb.showDialog( options );
    }

    /**
     * postDialogMusicStation
     * @param {ISong} song
     * @returns {Promise<any>}
     */
    public postDialogMusicStation( song: ISong ): Promise<any> {
        console.log( 'FacebookService.postDialogMusicStation' );
        const obj = {};
        obj[ 'og:title' ] = 'En ce moment sur Faubourg Simone';
        obj[ 'og:type' ] =  'music.radio_station';
        obj[ 'og:image' ] =  song.cover.jpg;
        obj[ 'og:url' ] = 'http://faubourgsimone.paris';
        obj[ 'og:site_name' ] = 'Faubourg Simone';
        obj[ 'fb:app_id' ] = '419281238161744';
        obj[ 'og:description' ] = song.title;
        obj[ 'og:audio' ] = 'http://91.121.65.131:8000/;';

        const options = {
            action: 'music.radio_station', // Required
            action_type: 'music.listens',
            method: 'share_open_graph', // Required
            object: JSON.stringify( obj ) // Required
        };
        return this.fb.showDialog( options );
    }

    /**
     * postWithGraphApi
     * @param {ISong} song
     * @returns {Promise<any>}
     */
    public postWithGraphApi( song: ISong ): Promise<any> {
        console.log( 'FacebookService.postWithGraphApi' );
        const requestPath = `me/feed?post$message=allo&access_token=${ this.accessToken }`;
        return this.fb.api( requestPath, [ ...this.permissions, 'publish_actions'] );
    }

    public logout() {
        this.fb.logout()
            .then( () => {
                this.isLogged = false;
                this.prompt.presentMessage( {
                    classNameCss: 'info', duration: 4000,
                    message: `Successfully logged out from Facebook`
                } );
            } )
            .catch( reason  => {
                console.log( 'FacebookService.logout: error', reason );
                this.prompt.presentMessage( {
                    classNameCss: 'error', duration: 4000,
                    message: `Error when logging out from Facebook: ${ reason.toString() }`
                } );
            } );
    }

    /**
     * get Api
     * @returns {Promise<any>}
     */
    private async getApi( requestPath ): Promise<any> {
        return new Promise( async ( resolve, reject ) => {
            const result: IFBServiceRes = {
                error: false
            };
            await this.fb.api( requestPath, this.permissions )
                .then( response  => {
                    result.data = response;
                    resolve( result );
                } )
                .catch( reason  => {
                    result.error = true;
                    result.message = reason;
                    reject( result );
                } );
        } );
    }
}
