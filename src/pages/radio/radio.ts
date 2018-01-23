import { Component } from '@angular/core';
import { Events, NavController, Platform, ViewController } from 'ionic-angular';

import { GlobalService } from '../../providers/global-service';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { InitService } from '../../providers/init-service';
import { PromptService } from '../../providers/prompt-service';
import { RadioService } from '../../providers/radio-service';
import { TranslateService } from 'ng2-translate';
import { MusicControls } from '@ionic-native/music-controls';
import { TrackerService } from '../../providers/tracker-service';

/* tslint:disable:no-unused-variable */
declare let cordova: any;
declare let FB: any;
/* tslint:enable:no-unused-variable */

@Component( {
    providers: [ MusicControls ],
    selector: 'page-radio',
    templateUrl: 'radio.html'
} )
export class RadioPage {

    private currentSong = { cover: { jpg: '', svg: '' }, title: '', artist: '', track: '' };
    private streamingUrl: string;
    private configReady = true;
    private playerReady = false;
    private myOnlyTrack: any;
    private lastSongs: Array<{ cover: { jpg: '', svg: '' }, title: string, artist: string, track: string }>;
    private shareOptions: any;
    private trackingOptions: any;
    private isPlaying = false;

    constructor( public navCtrl: NavController,
                 private vars: GlobalService,
                 public plt: Platform,
                 private ga: GoogleAnalytics,
                 public viewCtrl: ViewController,
                 private initService: InitService,
                 private prompt: PromptService,
                 private radioService: RadioService,
                 private events: Events,
                 private translateService: TranslateService,
                 private musicControls: MusicControls,
                 private tracker: TrackerService,
    ) {
        this.currentSong = { cover: this.vars.COVER_DEFAULT, title: 'Title', artist: 'Artist', track: 'Track' };
        this.plt.ready().then( ( readySource ) => {
            console.log( 'Platform ready from', readySource );

            this.ga.trackView( this.viewCtrl.name );

            // Look for streaming address in a json file on a server or local
            this.initService.getInitData().then( ( data: any ) => {
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

    protected ionViewDidLoad() {
        this.events.subscribe( 'nowPlayingChanged', ( currentSong, lastSongs ) => {
            this.onNowPlayingChanged( currentSong, lastSongs );
        } );
        // TODO: verifier
        this.events.subscribe( 'onError', error => this.onRadioServiceError( error ) );
    }

    private initPlayer() {
        this.playerReady = true;
        this.myOnlyTrack = {
            src: this.streamingUrl
        };
    }

    private onNowPlayingChanged( currentSong, lastSongs ) {
        console.log( '############## onNowPlayingChanged' );
        this.currentSong = currentSong;
        this.lastSongs = lastSongs;
        this.updateShareOptions();
        this.updateTrackingOptions();

        this.plt.ready().then( () => {
            this.destroyMusicControls();
            this.createMusicControls();
        } );
    }

    private updateShareOptions() {
        this.translateService
            .get(
                [ 'SHARING.CURRENT_SONG.MESSAGE', 'SHARING.CURRENT_SONG.SUBJECT', 'SHARING.CURRENT_SONG.URL' ],
                { title: this.currentSong.title }
            )
            .subscribe( ( result: string ) => {
                this.shareOptions = {
                    image: this.currentSong.cover.jpg,
                    message: result[ 'SHARING.CURRENT_SONG.MESSAGE' ],
                    subject: result[ 'SHARING.CURRENT_SONG.SUBJECT' ],
                    url: result[ 'SHARING.CURRENT_SONG.URL' ]
                };
            } );
    }

    private updateTrackingOptions() {
        this.translateService
            .get( [
                'TRACKING.SHARE.CURRENT_SONG.CATEGORY',
                'TRACKING.SHARE.CURRENT_SONG.ACTION',
                'TRACKING.SHARE.CURRENT_SONG.LABEL'
            ], {
                title: this.currentSong.title
            } )
            .subscribe( ( result: string ) => {
                this.trackingOptions = {
                    action: result[ 'TRACKING.SHARE.CURRENT_SONG.ACTION' ],
                    category: result[ 'TRACKING.SHARE.CURRENT_SONG.CATEGORY' ],
                    label: result[ 'TRACKING.SHARE.CURRENT_SONG.LABEL' ]
                };
            } );
    }

    private onRadioServiceError( error ) {
        this.prompt.presentMessage( { message: error.toString(), classNameCss: 'error' } );
    }

    private destroyMusicControls() {
        console.log( 'destroyMusicControls' );
        if ( this.plt.is( 'cordova' ) ) {
            this.musicControls.destroy();

            this.translateService
                .get( [
                    'TRACKING.PLAYER.CATEGORY',
                    'TRACKING.PLAYER.ACTION.DESTROY',
                    'TRACKING.PLAYER.LABEL.MUSIC_CONTROLS'
                ] )
                .subscribe( ( result: string ) => {
                    this.tracker.trackEventWithData(
                        result[ 'TRACKING.PLAYER.CATEGORY' ],
                        result[ 'TRACKING.PLAYER.LABEL.MUSIC_CONTROLS' ],
                        result[ 'TRACKING.PLAYER.ACTION.DESTROY' ] );
                }, error => console.log( error ) );
        }
    }

    private createMusicControls() {
        console.log( 'createMusicControls ' );

        if ( this.plt.is( 'cordova' ) ) {
            console.log( 'REALLY createMusicControls' );
            this.musicControls.create( {
                album: 'Faubourg Simone Radio', // iOS only
                artist: this.currentSong.artist,
                cover: this.currentSong.cover.jpg,
                dismissable: true,
                hasClose: false, // show close button, optional, default: false
                hasNext: false, // show next button, optional, default: true
                hasPrev: false, // show previous button, optional, default: true
                hasScrubbing: false, // iOS only
                isPlaying: this.isPlaying,
                ticker: `# Faubourg Simone # ${this.currentSong.title}`, // Android only
                track: this.currentSong.track,
            } );

            this.musicControls.subscribe().subscribe( action => {
                this.onMusicControlsEvent( action );
            } );

            // activates the observable above
            this.musicControls.listen();
        }
    }

    private onMusicControlsEvent( action ) {
        const message = JSON.parse( action ).message;
        if ( message === 'music-controls-pause' ) {
            console.log( '#### PAUSE' );
            // this.pause();
            this.translateService
                .get( [
                    'TRACKING.PLAYER.CATEGORY',
                    'TRACKING.PLAYER.ACTION.PAUSE',
                    'TRACKING.PLAYER.LABEL.MUSIC_CONTROLS'
                ] )
                .subscribe( ( result: string ) => {
                    this.tracker.trackEventWithData(
                        result[ 'TRACKING.PLAYER.CATEGORY' ],
                        result[ 'TRACKING.PLAYER.LABEL.MUSIC_CONTROLS' ],
                        result[ 'TRACKING.PLAYER.ACTION.PAUSE' ] );
                }, error => console.log( error ) );
        }

        if ( message === 'music-controls-play' ) {
            console.log( '#### PLAY' );
            // this.play();
            this.translateService
                .get( [
                    'TRACKING.PLAYER.CATEGORY',
                    'TRACKING.PLAYER.ACTION.PLAY',
                    'TRACKING.PLAYER.LABEL.MUSIC_CONTROLS'
                ] )
                .subscribe( ( result: string ) => {
                    this.tracker.trackEventWithData(
                        result[ 'TRACKING.PLAYER.CATEGORY' ],
                        result[ 'TRACKING.PLAYER.LABEL.MUSIC_CONTROLS' ],
                        result[ 'TRACKING.PLAYER.ACTION.PLAY' ] );
                }, error => console.log( error ) );
        }

        if ( message === 'music-controls-destroy' ) {
            console.log( '#### DESTROY' );
            this.destroyMusicControls();
        }

        // External controls (iOS only)
        if ( message === 'music-controls-toggle-play-pause' ) {
            console.log( '#### TOGGLE_PLAY_PAUSE IOS' );
            // Do something
        }

        // Headset events (Android only)
        // All media button events are listed below
        if ( message === 'music-controls-media-button' ) {
            console.log( '### MEDIA BUTTON' );
            this.translateService
                .get( [
                    'TRACKING.PLAYER.CATEGORY',
                    'TRACKING.PLAYER.ACTION.MEDIA_BUTTON',
                    'TRACKING.PLAYER.LABEL.MUSIC_CONTROLS'
                ] )
                .subscribe( ( result: string ) => {
                    this.tracker.trackEventWithData(
                        result[ 'TRACKING.PLAYER.CATEGORY' ],
                        result[ 'TRACKING.PLAYER.LABEL.MUSIC_CONTROLS' ],
                        result[ 'TRACKING.PLAYER.ACTION.MEDIA_BUTTON' ] );
                }, error => console.log( error ) );
        }

        if ( message === 'music-controls-headset-unplugged' ) {
            console.log( '### HEADSET UNPLUGGED' );
            // this.pause();
            this.translateService
                .get( [
                    'TRACKING.PLAYER.CATEGORY',
                    'TRACKING.PLAYER.ACTION.HEADSET_UNPLUGGED',
                    'TRACKING.PLAYER.LABEL.MUSIC_CONTROLS'
                ] )
                .subscribe( ( result: string ) => {
                    this.tracker.trackEventWithData(
                        result[ 'TRACKING.PLAYER.CATEGORY' ],
                        result[ 'TRACKING.PLAYER.LABEL.MUSIC_CONTROLS' ],
                        result[ 'TRACKING.PLAYER.ACTION.HEADSET_UNPLUGGED' ] );
                }, error => console.log( error ) );
        }

        if ( message === 'music-controls-headset-plugged' ) {
            console.log( '### HEADSET PLUGGED' );
            // this.play();
            this.translateService
                .get( [
                    'TRACKING.PLAYER.CATEGORY',
                    'TRACKING.PLAYER.ACTION.HEADSET_PLUGGED',
                    'TRACKING.PLAYER.LABEL.MUSIC_CONTROLS'
                ] )
                .subscribe( ( result: string ) => {
                    this.tracker.trackEventWithData(
                        result[ 'TRACKING.PLAYER.CATEGORY' ],
                        result[ 'TRACKING.PLAYER.LABEL.MUSIC_CONTROLS' ],
                        result[ 'TRACKING.PLAYER.ACTION.HEADSET_PLUGGED' ] );
                }, error => console.log( error ) );
        }
    }
}
