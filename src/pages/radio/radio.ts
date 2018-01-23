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
import { InAppBrowser, InAppBrowserObject } from '@ionic-native/in-app-browser';
import { MEDIA_ERROR, MEDIA_STATUS, Media, MediaObject } from '@ionic-native/media';
import { BackgroundMode } from '@ionic-native/background-mode';

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
    private isButtonActive = true;
    private playPauseButton = 'play';
    private browserPopup: InAppBrowserObject;
    private hasLeft = false;
    private isLoading = true;
    private mediaObject: MediaObject;

    constructor ( public navCtrl: NavController,
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
                  private iab: InAppBrowser,
                  private media: Media,
                  private backgroundMode: BackgroundMode
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

    protected ionViewDidLoad () {
        this.events.subscribe( 'nowPlayingChanged', ( currentSong, lastSongs ) => {
            this.onNowPlayingChanged( currentSong, lastSongs );
        } );
        // TODO: verifier
        this.events.subscribe( 'onError', error => this.onRadioServiceError( error ) );
    }

    protected ionViewDidEnter () {
        this.hasLeft = false;
    }

    protected ionViewDidLeave () {
        this.hasLeft = true;
        this.prompt.dismissLoading();
    }

    private initPlayer () {
        this.playerReady = true;
        this.myOnlyTrack = {
            src: this.streamingUrl
        };
    }

    private onNowPlayingChanged ( currentSong, lastSongs ) {
        this.currentSong = currentSong;
        this.lastSongs = lastSongs;
        this.updateShareOptions();
        this.updateTrackingOptions();

        this.plt.ready().then( () => {
            this.destroyMusicControls();
            this.createMusicControls();
        } );
    }

    private updateShareOptions () {
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

    private updateTrackingOptions () {
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

    private onRadioServiceError ( error ) {
        this.prompt.presentMessage( { message: error.toString(), classNameCss: 'error' } );
    }

    private destroyMusicControls () {
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

    private createMusicControls () {
        if ( this.plt.is( 'cordova' ) ) {
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
                track: this.currentSong.track
            } );

            this.musicControls.subscribe().subscribe( action => {
                this.onMusicControlsEvent( action );
            } );

            // activates the observable above
            this.musicControls.listen();
        }
    }

    private onMusicControlsEvent ( action ) {
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

    private togglePlayPause () {
        let trackingAction;
        if ( this.isPlaying ) {
            this.pause();
            trackingAction = { translate: 'TRACKING.PLAYER.ACTION.PAUSE' };
        } else {
            this.play();
            trackingAction = { translate: 'TRACKING.PLAYER.ACTION.PLAY' };
        }

        this.tracker.trackEventWithI18n(
            { translate: 'TRACKING.PLAYER.CATEGORY' },
            trackingAction,
            { translate: 'TRACKING.PLAYER.LABEL.PLAYER_BUTTONS', params: { date: Date.now().toString() } }
        );
    }

    private postToFeed () {
        // Escape HTML
        const el: HTMLElement = document.createElement( 'textarea' );
        el.innerHTML = this.currentSong.cover.jpg.toString();

        this.translateService
            .get( 'SHARING.CURRENT_SONG.FACEBOOK_FEED_DESCRIPTION',
                { track: this.currentSong.track, artist: this.currentSong.artist } )
            .subscribe( ( result: string ) => {
                const url = `https://www.facebook.com/dialog/feed?app_id=419281238161744&name=${this.currentSong.title}
                &display=popup&caption=http://faubourgsimone.paris/application-mobile
                &description=${result}
                &link=faubourgsimone.paris/application-mobile
                &picture=${el.innerHTML}`;
                this.browserPopup = this.iab.create( url, '_blank' );
                // This check is because of a crash when simulated on desktop browser
                if ( typeof this.browserPopup.on( 'loadstop' ).subscribe === 'function' ) {
                    this.browserPopup.on( 'loadstop' ).subscribe( ( evt ) => {
                        if ( evt.url === 'https://www.facebook.com/dialog/return/close?#_=_' ) {
                            this.closePopUp();
                        }
                    } );
                }
            } );
    }

    private closePopUp () {
        this.browserPopup.close();
    }

    private play () {
        this.isButtonActive = false;
        this.prompt.presentLoading( true );
        this.isPlaying = true;
        this.startStreamingMedia();
        this.playPauseButton = 'pause';
    }

    private pause () {
        if ( this.plt.is( 'cordova' ) && this.musicControls && typeof this.musicControls !== 'undefined' ) {
            this.mediaObject.stop();
            this.musicControls.updateIsPlaying( false );
        }
        this.playPauseButton = 'play';
        this.isPlaying = false;
        this.isLoading = true;
    }

    private startStreamingMedia () {
        if ( this.plt.is( 'cordova' ) ) {
            this.mediaObject = this.media.create( this.myOnlyTrack.src );

            this.mediaObject.onStatusUpdate.subscribe( status => {
                if ( status === MEDIA_STATUS.RUNNING ) {
                    this.backgroundMode.enable();
                    this.onTrackLoaded();

                }
                if ( ( status === MEDIA_STATUS.STOPPED || status === MEDIA_STATUS.PAUSED )
                    && this.backgroundMode.isEnabled() ) {
                    this.backgroundMode.disable();
                }
            } );

            this.mediaObject.onError.subscribe( ( error: MEDIA_ERROR ) => {
                const possibleErrors = [
                    MEDIA_ERROR.SUPPORTED,
                    MEDIA_ERROR.DECODE,
                    MEDIA_ERROR.ABORTED,
                    MEDIA_ERROR.NETWORK ];
                if ( possibleErrors.indexOf( error ) > 1 ) {
                    this.onTrackError( error );
                } else {
                    console.log( 'Media returns impossible error status !' );
                    this.onTrackError( { isFalseError: true } );
                }
            } );

            // play the file
            this.mediaObject.play();
        } else {
            // TODO: fallback fro browser ?
            this.onTrackError( 'Cordova is missing! ' +
                'If you\'re on a mobile device, please contact us at tech.team@faubourgsimone.com' );
        }
    }

    private onTrackLoaded ( event? ) {
        this.isLoading = false;
        this.prompt.dismissLoading();
        this.isPlaying = true;
        this.isButtonActive = true;
        if ( this.plt.is( 'cordova' ) ) {
            this.musicControls.updateIsPlaying( true );
        }
    }

    private onTrackError ( event ) {
        this.prompt.dismissLoading();
        this.isButtonActive = true;
        if ( this.plt.is( 'cordova' ) ) {
            this.musicControls.updateIsPlaying( false );
        }
        if ( !event.isFalseError ) {
            if ( this.isPlaying ) {
                this.pause();
            }
            this.prompt.presentMessage( { message: event.toString(), classNameCss: 'error', duration: 6000 } );
        }
    }
}
