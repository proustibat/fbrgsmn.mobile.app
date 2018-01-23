import { Component } from '@angular/core';
import { NavController, Platform, ViewController } from 'ionic-angular';

import { GlobalService } from '../../providers/global-service';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { InitService } from '../../providers/init-service';
import { PromptService } from '../../providers/prompt-service';
import { RadioService } from '../../providers/radio-service';

/* tslint:disable:no-unused-variable */
declare let cordova: any;
declare let FB: any;
/* tslint:enable:no-unused-variable */

@Component( {
    selector: 'page-radio',
    templateUrl: 'radio.html'
} )
export class RadioPage {

    private currentSong = { cover: { jpg: '', svg: '' }, title: '', artist: '', track: '' };
    private streamingUrl: string;
    private configReady = true;
    private playerReady = false;
    private myOnlyTrack: any;

    constructor( public navCtrl: NavController,
                 private vars: GlobalService,
                 public plt: Platform,
                 private ga: GoogleAnalytics,
                 public viewCtrl: ViewController,
                 private initService: InitService,
                 private prompt: PromptService,
                 private radioService: RadioService,
    ) {
        this.currentSong = { cover: this.vars.COVER_DEFAULT, title: 'Title', artist: 'Artist', track: 'Track' };
        console.log( this.currentSong );

        this.plt.ready().then( ( readySource ) => {
            console.log( 'Platform ready from', readySource );

            this.ga.trackView( this.viewCtrl.name );

            // Look for streaming address in a json file on a server or local
            this.initService.getInitData().then( ( data: any ) => {
                console.log( data );
                if ( data.error ) {
                    this.prompt.presentMessage( {
                        classNameCss: 'error',
                        message: `${ data.error.toString() } => Resolved by loading local config`
                    } );
                    data = data.content;
                }
                this.streamingUrl = data.streamingUrl ? data.streamingUrl : this.vars.URL_STREAMING_DEFAULT;
                this.radioService.initLoop( data.loop_interval );
                this.configReady = false;
                this.initPlayer();
            } ).catch( errors => this.prompt.presentMessage( {
                classNameCss: 'error',
                message: `⚠ ${ errors.join( ' ⚠ ' ) }`
            } ) );
        } );
    }

    private initPlayer() {
        this.playerReady = true;
        this.myOnlyTrack = {
            src: this.streamingUrl
        };
    }
}
