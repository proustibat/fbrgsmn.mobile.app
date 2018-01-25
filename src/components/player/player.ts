import { Component, Input } from '@angular/core';
import { TranslateService } from 'ng2-translate';
import { InAppBrowser, InAppBrowserObject } from '@ionic-native/in-app-browser';
import { MEDIA_ERROR, MEDIA_STATUS, Media, MediaObject } from '@ionic-native/media';
import { TrackerService } from '../../providers/tracker-service';
import { PromptService } from '../../providers/prompt-service';
import { Events, Platform } from 'ionic-angular';
import { MusicControls } from '@ionic-native/music-controls';
import { BackgroundMode } from '@ionic-native/background-mode';
import { GlobalService } from '../../providers/global-service';

@Component( {
    providers: [ MusicControls ],
    selector: 'player',
    templateUrl: 'player.html'
} )

export class PlayerComponent {

    @Input() private streamingUrl: string;
    @Input() private configReady: boolean;
    private browserPopup: InAppBrowserObject;
    private isPlaying = false;
    private isButtonActive = true;
    private playPauseButton = 'play';
    private mediaObject: MediaObject;
    private isLoading = true;
    private currentSong = { cover: { jpg: '', svg: '' }, title: '', artist: '', track: '' };
    private shareOptions: any;
    private trackingOptions: any;

    constructor( private translateService: TranslateService,
                 private iab: InAppBrowser,
                 private tracker: TrackerService,
                 private prompt: PromptService,
                 public plt: Platform,
                 private musicControls: MusicControls,
                 private media: Media,
                 private backgroundMode: BackgroundMode,
                 private events: Events,
    ) {
        console.log( 'Hello PlayerComponent' );
        this.currentSong = { cover: GlobalService.COVER_DEFAULT, title: 'Title', artist: 'Artist', track: 'Track' };
    }

    public updateMeta ( currentSong ) {
        this.currentSong = currentSong;
        this.updateShareOptions();
        this.updateTrackingOptions();

        this.plt.ready().then( () => {
            this.destroyMusicControls();
            this.createMusicControls();
        } );
    }

    private togglePlayPause () {
        this.translateService
            .get( [
                'TRACKING.PLAYER.CATEGORY',
                this.isPlaying ? 'TRACKING.PLAYER.ACTION.PAUSE' : 'TRACKING.PLAYER.ACTION.PLAY',
                'TRACKING.PLAYER.LABEL.PLAYER_BUTTONS'
            ] )
            .subscribe( ( result: string ) => {
                this.tracker.trackEventWithData(
                    result[ 'TRACKING.PLAYER.CATEGORY' ],
                    result[ this.isPlaying ? 'TRACKING.PLAYER.ACTION.PAUSE' : 'TRACKING.PLAYER.ACTION.PLAY' ],
                    result[ 'TRACKING.PLAYER.LABEL.PLAYER_BUTTONS' ] );
            }, error => console.log( error ) );
        // Do this after the tracking, otherwise `isPlaying will had been changed`
        this.isPlaying ? this.pause() : this.play();
    }

    private play () {
        if ( !this.isPlaying ) {
            this.isButtonActive = false;
            this.prompt.presentLoading( true );
            this.startStreamingMedia();
            this.isPlaying = true;
            this.playPauseButton = 'pause';
        }
    }

    private pause () {
        if ( this.isPlaying ) {
            if ( this.plt.is( 'cordova' ) &&
                this.musicControls &&
                typeof this.musicControls !== 'undefined' ) {
                this.mediaObject.stop();
                this.musicControls.updateIsPlaying( false );
            }
            this.playPauseButton = 'play';
            this.isPlaying = false;
            this.isLoading = true;
        }
    }

    private startStreamingMedia () {
        if ( this.plt.is( 'cordova' ) ) {

            // This is the first launch, we need to create the media object
            if ( !this.mediaObject ) {
                this.createMedia();
            }

            // Play the file
            this.mediaObject.play();
        } else {
            // TODO: fallback for browser ?
            this.onTrackError( 'Cordova is missing! ' +
                'If you\'re on a mobile device, please contact us at tech.team@faubourgsimone.com' );
        }
    }

    private createMedia () {
        this.mediaObject = this.media.create( this.streamingUrl );
        this.mediaObject.onStatusUpdate.subscribe( this.onMediaStatusUpdate.bind( this ) );
        this.mediaObject.onError.subscribe( this.onMediaError.bind( this ) );
    }

    private onMediaStatusUpdate( status ) {
        if ( status === MEDIA_STATUS.RUNNING ) {
            this.backgroundMode.enable();
            this.onTrackLoaded();

        }
        if ( ( status === MEDIA_STATUS.STOPPED || status === MEDIA_STATUS.PAUSED )
            && this.backgroundMode.isEnabled() ) {
            this.backgroundMode.disable();
        }
    }

    private onMediaError( error: MEDIA_ERROR ) {
        const possibleErrors = [
            MEDIA_ERROR.SUPPORTED,
            MEDIA_ERROR.DECODE,
            MEDIA_ERROR.ABORTED,
            MEDIA_ERROR.NETWORK];
        if ( possibleErrors.indexOf( error ) > 1 ) {
            this.onTrackError( error );
        } else {
            console.log( 'Media returns impossible error status !' );
            this.onTrackError( { isFalseError: true } );
        }
    }

    private onTrackLoaded ( event? ) {
        this.isLoading = false;
        this.prompt.dismissLoading();
        this.isPlaying = true;
        this.isButtonActive = true;
        if ( this.plt.is( 'cordova' ) &&
            this.musicControls &&
            typeof this.musicControls !== 'undefined' ) {
            this.musicControls.updateIsPlaying( true );
        }
    }

    private onTrackError ( event ) {
        this.prompt.dismissLoading();
        this.isButtonActive = true;
        if ( this.plt.is( 'cordova' ) ) {
            this.musicControls.updateIsPlaying( false );
        } else {
            // cordova is missing, just reset the ui (setTimeout to 0 is to run this immediately)
            setTimeout( () => {
                this.playPauseButton = 'play';
                this.isPlaying = false;
                this.isLoading = true;
            }, 0 );
        }
        if ( !event.isFalseError ) {
            if ( this.isPlaying ) {
                this.pause();
            }
            this.prompt.presentMessage( { message: event.toString(), classNameCss: 'error', duration: 6000 } );
        }
    }

    private destroyMusicControls () {
        if ( this.plt.is( 'cordova' ) ) {
            this.musicControls.destroy();

            this.tracker.translateAndTrack(
                'TRACKING.PLAYER.CATEGORY',
                'TRACKING.PLAYER.ACTION.DESTROY',
                'TRACKING.PLAYER.LABEL.MUSIC_CONTROLS'
            );
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
            this.pause();
        }

        if ( message === 'music-controls-play' ) {
            console.log( '#### PLAY' );
            this.play();
        }

        // Headset event headset-unplugged (Android only)
        if ( message === 'music-controls-headset-unplugged' ) {
            console.log( '### HEADSET UNPLUGGED' );
            this.pause();
        }

        // Headset event headset-plugged (Android only)
        if ( message === 'music-controls-headset-plugged' ) {
            console.log( '### HEADSET PLUGGED' );
            this.play();
        }

        // If it's one of those events, we track on the same way with just a different action parameter
        const eventsToTrack = [
            'pause',
            'play',
            'headset-unplugged',
            'headset-plugged'
        ];
        const indexOfEvent = eventsToTrack.map( evtName => `music-controls-${evtName}` ).indexOf( message );
        if ( indexOfEvent !== -1 ) {
            const eventToTrackKey = eventsToTrack[ indexOfEvent ].replace( '-', '_' ).toUpperCase();
            const actionKey = `TRACKING.PLAYER.ACTION.${ eventToTrackKey }`;
            this.tracker.translateAndTrack(
                'TRACKING.PLAYER.CATEGORY',
                actionKey,
                'TRACKING.PLAYER.LABEL.MUSIC_CONTROLS'
            );
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

        // Headset event media-button (Android only)
        if ( message === 'music-controls-media-button' ) {
            console.log( '### MEDIA BUTTON' );
            this.tracker.translateAndTrack(
                'TRACKING.PLAYER.CATEGORY',
                'TRACKING.PLAYER.ACTION.MEDIA_BUTTON',
                'TRACKING.PLAYER.LABEL.MUSIC_CONTROLS'
            );
        }
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

    private postToFeed () {
        // Escape HTML
        const el: HTMLElement = document.createElement( 'textarea' );
        el.innerHTML = this.currentSong.cover.jpg.toString();

        this.translateService
            .get( 'SHARING.CURRENT_SONG.FACEBOOK_FEED_DESCRIPTION',
                { track: this.currentSong.track, artist: this.currentSong.artist } )
            .subscribe( ( result: string ) => {
                const baseUrl = 'https://www.facebook.com/dialog/feed';
                const url = `${baseUrl}?app_id=419281238161744&name=${this.currentSong.title}
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
}
