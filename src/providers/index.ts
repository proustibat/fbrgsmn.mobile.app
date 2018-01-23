import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ErrorHandler } from '@angular/core';
import { IonicErrorHandler } from 'ionic-angular';

import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { GlobalService } from './global-service';
import { InitService } from './init-service';
import { PromptService } from './prompt-service';

export const CustomProviders = [
    GlobalService,
    InitService,
    PromptService
];

export const ExternalProviders = [
    StatusBar,
    SplashScreen,
    GoogleAnalytics,
    { provide: ErrorHandler, useClass: IonicErrorHandler }
];
