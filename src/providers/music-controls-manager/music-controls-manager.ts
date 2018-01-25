import { Injectable } from '@angular/core';
import { MusicControls } from '@ionic-native/music-controls';
import { Events, Platform } from 'ionic-angular';
import { TrackerService } from '../tracker-service';
import { ISong } from '../../interfaces';

@Injectable()
export class MusicControlsManagerProvider {

    constructor( private plt: Platform,
                 private musicControls: MusicControls,
                 private tracker: TrackerService,
                 private events: Events,
    ) {}

    public init ( currentSong: ISong, isPlaying: boolean ) {
        this.plt.ready().then( () => {
            if ( this.plt.is( 'cordova' ) &&
                this.musicControls &&
                typeof this.musicControls !== 'undefined' ) {
                this.destroyMusicControls();
                this.createMusicControls( currentSong, isPlaying );
            }
        } );
    }

    public updatePlayState( isPlaying: boolean ) {
        if ( this.plt.is( 'cordova' ) &&
            this.musicControls &&
            typeof this.musicControls !== 'undefined' ) {
            this.musicControls.updateIsPlaying( isPlaying );
        }
    }

    private createMusicControls ( currentSong: ISong, isPlaying: boolean ) {
        this.musicControls.create( {
            album: 'Faubourg Simone Radio', // iOS only
            artist: currentSong.artist,
            cover: currentSong.cover.jpg,
            dismissable: true,
            hasClose: false, // show close button, optional, default: false
            hasNext: false, // show next button, optional, default: true
            hasPrev: false, // show previous button, optional, default: true
            hasScrubbing: false, // iOS only
            isPlaying,
            ticker: `# Faubourg Simone # ${ currentSong.title }`, // Android only
            track: currentSong.track
        } );

        this.musicControls.subscribe().subscribe( action => {
            this.onMusicControlsEvent( action );
        } );

        // activates the observable above
        this.musicControls.listen();
    }

    private onMusicControlsEvent ( action ) {
        const message = JSON.parse( action ).message;

        // Headset event headset-unplugged (Android only)
        if ( message === 'music-controls-pause' || message === 'music-controls-headset-unplugged' ) {
            this.events.publish( '[MusicControlsManager]pause' );
        }

        // Headset event headset-plugged (Android only)
        if ( message === 'music-controls-play' || message === 'music-controls-headset-plugged' ) {
            this.events.publish( '[MusicControlsManager]play' );
        }

        this.trackEventIfNeeded( message );

        if ( message === 'music-controls-destroy' ) {
            this.destroyMusicControls();
        }

        // External controls (iOS only)
        if ( message === 'music-controls-toggle-play-pause' ) {
            // TODO : how to know if we must call play or pause
        }
    }

    private trackEventIfNeeded( msg ) {
        // If it's one of those events, we track on the same way with just a different action parameter
        const eventsToTrack = [
            'pause',
            'play',
            'headset-unplugged',
            'headset-plugged',
            'media-button'
        ];
        const indexOfEvent = eventsToTrack.map( evtName => `music-controls-${ evtName }` ).indexOf( msg );
        if ( indexOfEvent !== -1 ) {
            const eventToTrackKey = eventsToTrack[ indexOfEvent ].replace( '-', '_' ).toUpperCase();
            const actionKey = `TRACKING.PLAYER.ACTION.${ eventToTrackKey }`;
            this.tracker.translateAndTrack(
                'TRACKING.PLAYER.CATEGORY',
                actionKey,
                'TRACKING.PLAYER.LABEL.MUSIC_CONTROLS'
            );
        }
    }

    private destroyMusicControls () {
        this.musicControls.destroy();

        // this.tracker.translateAndTrack(
        //     'TRACKING.PLAYER.CATEGORY',
        //     'TRACKING.PLAYER.ACTION.DESTROY',
        //     'TRACKING.PLAYER.LABEL.MUSIC_CONTROLS'
        // );
    }

}
