import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ErrorHandler } from '@angular/core';
import { IonicErrorHandler } from 'ionic-angular';

import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { BackgroundMode } from '@ionic-native/background-mode';
import { SocialSharing } from '@ionic-native/social-sharing';
import { Screenshot } from '@ionic-native/screenshot';
import { Media } from '@ionic-native/media';
import { MusicControls } from '@ionic-native/music-controls';
import { Facebook } from '@ionic-native/facebook';
import { GlobalService } from './global-service/global-service';
import { InitService } from './init-service/init-service';
import { PromptService } from './prompt-service/prompt-service';
import { RadioService } from './radio-service/radio-service';
import { TrackerService } from './tracker-service/tracker-service';
import { MusicControlsManagerProvider } from './music-controls-manager/music-controls-manager';
import { FacebookServiceProvider } from './facebook-service/facebook-service';

export const CustomProviders = [
    GlobalService,
    InitService,
    PromptService,
    RadioService,
    TrackerService,
    MusicControlsManagerProvider,
    FacebookServiceProvider
];

export const ExternalProviders = [
    StatusBar,
    SplashScreen,
    GoogleAnalytics,
    InAppBrowser,
    BackgroundMode,
    SocialSharing,
    Screenshot,
    Media,
    MusicControls,
    Facebook,
    { provide: ErrorHandler, useClass: IonicErrorHandler }
];
