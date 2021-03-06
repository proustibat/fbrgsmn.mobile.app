import { Component, ViewChild } from '@angular/core';
import { Events, NavController, Platform, ViewController } from 'ionic-angular';
import { GlobalService } from '../../providers/global-service/global-service';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { InitService } from '../../providers/init-service/init-service';
import { PromptService } from '../../providers/prompt-service/prompt-service';
import { RadioService } from '../../providers/radio-service/radio-service';
import { PlayerComponent } from '../../components/player/player';
import { ISong } from '../../interfaces';
import { HttpEvent, HttpEventType } from '@angular/common/http';

/* tslint:disable:no-unused-variable */
declare let cordova: any;
declare let FB: any;
/* tslint:enable:no-unused-variable */

@Component( {
    selector: 'page-radio',
    templateUrl: 'radio.html'
} )
export class RadioPage {

    // private apiData:any;

    @ViewChild( 'player' ) private player: PlayerComponent;

    private streamingUrl: string;
    private configReady: boolean;
    private lastSongs: ISong[];
    private hasLeft: boolean;

    constructor ( private plt: Platform,
                  private prompt: PromptService,
                  private ga: GoogleAnalytics,
                  private viewCtrl: ViewController,
                  private initService: InitService,
                  private radioService: RadioService,
                  private events: Events,
    ) {
        this.configReady = false;
        this.hasLeft = false;

        this.plt.ready().then( this.onPlatformReady.bind( this ) );
    }

    protected ionViewDidLoad () {
        // Event from RadioService
        this.events.subscribe( '[RadioService]now-playing-change', this.onNowPlayingChanged.bind( this ) );
        // Event from RadioService
        // TODO: verifier
        this.events.subscribe( '[RadioService]error', this.onRadioServiceError.bind( this ) );
    }

    protected ionViewDidEnter () {
        this.hasLeft = false;
    }

    protected ionViewDidLeave () {
        this.hasLeft = true;
        this.prompt.dismissLoading();
    }

    private onPlatformReady () {
        // console.log( 'Platform ready from', readySource );
        if ( this.plt.is( 'cordova' ) ) {
            this.ga.trackView( this.viewCtrl.name );
        }

        // Look for streaming address in a json file (remote or local)
        this.initService.getInitData()
            .then( this.onData.bind( this ) )
            .catch( () => {
                this.prompt.presentMessage( {
                    classNameCss: 'error',
                    message: `⚠ Error when loading prod config => Try to resolved by loading local config`
                } );
                this.initService.getInitData( true )
                    .then( this.onData.bind( this ) )
                    .catch( errors => {
                        this.prompt.presentMessage( {
                            classNameCss: 'error',
                            message: `⚠ ${ errors.join( ' ⚠ ' ) }`
                        } );
                    } );
            } );
    }

    private onData( data: any ) {
        this.streamingUrl = data.streamingUrl ? data.streamingUrl : GlobalService.DEFAULT_URL_STREAMING;
        this.radioService.initLoop( data.loop_interval );
        this.configReady = true;
    }

    private onNowPlayingChanged ( currentSong, lastSongs ) {
        this.lastSongs = lastSongs;
        this.player.updateMeta( currentSong );
    }

    private onRadioServiceError ( error ) {
        this.prompt.presentMessage( { message: error.toString(), classNameCss: 'error' } );
    }
}
