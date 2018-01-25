import { Component, ViewChild } from '@angular/core';
import { Events, NavController, Platform, ViewController } from 'ionic-angular';
import { GlobalService } from '../../providers/global-service';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { InitService } from '../../providers/init-service';
import { PromptService } from '../../providers/prompt-service';
import { RadioService } from '../../providers/radio-service';
import { PlayerComponent } from '../../components/player/player';
import { ISong } from '../../interfaces';

/* tslint:disable:no-unused-variable */
declare let cordova: any;
declare let FB: any;
/* tslint:enable:no-unused-variable */

@Component( {
    selector: 'page-radio',
    templateUrl: 'radio.html'
} )
export class RadioPage {

    @ViewChild( 'player' ) private player: PlayerComponent;

    private streamingUrl: string;
    private configReady = false;
    private lastSongs: ISong[];
    private hasLeft = false;

    constructor ( private plt: Platform,
                  private prompt: PromptService,
                  private ga: GoogleAnalytics,
                  private viewCtrl: ViewController,
                  private initService: InitService,
                  private radioService: RadioService,
                  private events: Events,
    ) {
        this.plt.ready().then( ( readySource ) => {
            // console.log( 'Platform ready from', readySource );
            if ( plt.is( 'cordova' ) ) {
                this.ga.trackView( this.viewCtrl.name );
            }

            // Look for streaming address in a json file (remote or local)
            this.initService.getInitData().then( ( data: any ) => {
                if ( data.error ) {
                    this.prompt.presentMessage( {
                        classNameCss: 'error',
                        message: `${ data.error.toString() } => Resolved by loading local config`
                    } );
                    data = data.content;
                }
                this.streamingUrl = data.streamingUrl ? data.streamingUrl : GlobalService.DEFAULT_URL_STREAMING;
                this.radioService.initLoop( data.loop_interval );
                this.configReady = true;
            } ).catch( errors => this.prompt.presentMessage( {
                classNameCss: 'error',
                message: `⚠ ${ errors.join( ' ⚠ ' ) }`
            } ) );
        } );
    }

    protected ionViewDidLoad () {
        // Event from RadioService
        this.events.subscribe( '[RadioService]now-playing-change', ( currentSong, lastSongs ) => {
            this.onNowPlayingChanged( currentSong, lastSongs );
        } );
        // Event from RadioService
        // TODO: verifier
        this.events.subscribe( '[RadioService]error', error => this.onRadioServiceError( error ) );
    }

    protected ionViewDidEnter () {
        this.hasLeft = false;
    }

    protected ionViewDidLeave () {
        this.hasLeft = true;
        this.prompt.dismissLoading();
    }

    private onNowPlayingChanged ( currentSong, lastSongs ) {
        this.lastSongs = lastSongs;
        this.player.updateMeta( currentSong );
    }

    private onRadioServiceError ( error ) {
        this.prompt.presentMessage( { message: error.toString(), classNameCss: 'error' } );
    }
}
