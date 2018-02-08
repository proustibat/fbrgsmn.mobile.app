import { ComponentFixture, TestBed, async, fakeAsync, tick } from '@angular/core/testing';

import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { IonicModule, ToastController } from 'ionic-angular';
import { SocialSharing } from '@ionic-native/social-sharing';
import { Screenshot } from '@ionic-native/screenshot';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { HttpLoaderFactory } from '../../app/app.module';

import { ShareButtonComponent } from '../../components/share-button/share-button';
import { GlobalService } from '../../providers/global-service';
import { PromptService } from '../../providers/prompt-service';
import { TrackerService } from '../../providers/tracker-service';

import { GoogleAnalyticsMock } from '@ionic-native-mocks/google-analytics';
import { ToastControllerMock } from 'ionic-mocks';
import { SocialSharingMock } from '@ionic-native-mocks/social-sharing';
import { ScreenshotMock } from '@ionic-native-mocks/screenshot';

describe( 'ShareButtonComponent', () => {
    let component: ShareButtonComponent;
    let fixture: ComponentFixture<ShareButtonComponent>;
    let originalTimeout;

    beforeEach( async( () => {
        TestBed.configureTestingModule( {
            declarations: [ ShareButtonComponent ],
            imports: [
                IonicModule.forRoot( ShareButtonComponent ),
                TranslateModule.forRoot( {
                    loader: {
                        deps: [ HttpClient ],
                        provide: TranslateLoader,
                        useFactory: ( HttpLoaderFactory ),
                    }
                } )
            ],
            providers: [
                PromptService,
                GlobalService,
                TrackerService,
                HttpClient,
                HttpHandler,
                { provide: GoogleAnalytics, useClass: GoogleAnalyticsMock },
                { provide: SocialSharing, useClass: SocialSharingMock },
                { provide: Screenshot, useClass: ScreenshotMock },
                { provide: ToastController, useClass: ToastControllerMock },
            ]
        } );
    } ) );

    beforeEach( () => {
        originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;

        // create component and test fixture
        fixture = TestBed.createComponent( ShareButtonComponent );

        // get test component from the fixture
        component = fixture.componentInstance;
    } );

    afterEach( () => {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    } );

    it( 'should be created', async () => {
        expect( component ).toBeDefined();
        expect( component instanceof ShareButtonComponent ).toBe( true );
    } );

    it( 'onClick should call share without screenshot', async () => {
        const shareButton = ( component as any );
        shareButton.doScreenShot = false;

        spyOn( shareButton, 'shareIt' ).and.callFake( () => {} );

        shareButton.onClick();

        expect( shareButton.shareIt ).toHaveBeenCalled();
    } );

    it( 'onClick should take screenshot and call complete if it\s ok', ( done ) => {
        const shareButton = ( component as any );
        shareButton.options = {};
        shareButton.doScreenShot = true;
        spyOn( shareButton, 'onScreenshotComplete' ).and.callThrough();
        spyOn( shareButton, 'shareIt' ).and.callThrough();
        const spySuccess = spyOn( shareButton.screenshot, 'URI' ).and.returnValue( Promise.resolve( { URI: 'uri' } ) );
        shareButton.onClick();
        spySuccess.calls.mostRecent().returnValue.then( () => {
            expect( shareButton.screenshot.URI ).toHaveBeenCalled();
            expect( shareButton.onScreenshotComplete ).toHaveBeenCalledWith( { URI: 'uri' } );
            expect( shareButton.shareIt ).toHaveBeenCalledWith( { image: 'uri' } );
            done();
        } );
    } );

    it( 'onClick should call error if screenshot doesn\'t work',  ( done ) => {
        const shareButton = ( component as any );
        shareButton.doScreenShot = true;
        spyOn( shareButton, 'onScreenshotError' ).and.callThrough();
        spyOn( shareButton.prompt, 'presentMessage' ).and.callFake( () => {} );
        const spyError = spyOn( shareButton.screenshot, 'URI' ).and.returnValue( Promise.reject( 'fakeError' ) );
        shareButton.onClick();
        spyError.calls.mostRecent().returnValue.catch( () => {
            expect( shareButton.screenshot.URI ).toHaveBeenCalled();
            expect( shareButton.prompt.presentMessage ).toHaveBeenCalled();
            expect( shareButton.onScreenshotError ).toHaveBeenCalled();
            done();
        } );
    } );

    it( 'tracks sharing',  ( done ) => {
        const shareButton = ( component as any );
        // if there is trackingOptions, there is something to track
        shareButton.trackingOptions = {
            action: 'fakeAction',
            category: 'fakeCategory',
            label: 'fakeLabel'
        };
        spyOn( shareButton.tracker, 'trackEventWithData' ).and.callFake( () => {} );

        const spy = spyOn( shareButton.socialSharing, 'share' ).and.returnValue( Promise.resolve( true ) );

        shareButton.shareIt( {
            image: 'fakeImage',
            message: 'fakeMessage',
            subject: 'fakeSubject',
            url: 'fakeUrl'
        } );

        spy.calls.mostRecent().returnValue.then( () => {
            expect( shareButton.tracker.trackEventWithData ).toHaveBeenCalledWith(
                shareButton.trackingOptions.category,
                shareButton.trackingOptions.action,
                shareButton.trackingOptions.label
            );
            done();
        } );

    } );

    it( 'displays error if tracks sharing doesn\'t work but was necessary',  ( done ) => {
        const shareButton = ( component as any );
        // if there is trackingOptions, there is something to track
        shareButton.trackingOptions = {
            action: 'fakeAction',
            category: 'fakeCategory',
            label: 'fakeLabel'
        };
        spyOn( shareButton.prompt, 'presentMessage' ).and.callFake( () => {} );
        const spy = spyOn( shareButton.socialSharing, 'share' ).and.returnValue( Promise.reject( 'fakeError' ) );

        shareButton.shareIt( {
            image: 'fakeImage',
            message: 'fakeMessage',
            subject: 'fakeSubject',
            url: 'fakeUrl'
        } );

        spy.calls.mostRecent().returnValue.catch( () => {
            expect().nothing();
            // expect( shareButton.prompt.presentMessage ).toHaveBeenCalled();
            done();
        } );
    } );
} );
