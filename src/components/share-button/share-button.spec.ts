import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { IonicModule } from 'ionic-angular/index';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { GoogleAnalyticsMock } from '@ionic-native-mocks/google-analytics';
import { SocialSharing } from '@ionic-native/social-sharing';
import { Screenshot } from '@ionic-native/screenshot';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { HttpLoaderFactory } from '../../app/app.module';

import { ShareButtonComponent } from '../../components/share-button/share-button';
import { GlobalService } from '../../providers/global-service';
import { PromptService } from '../../providers/prompt-service';
import { TrackerService } from '../../providers/tracker-service';

import { SocialSharingMock } from '@ionic-native-mocks/social-sharing';
import { ScreenshotMock } from '@ionic-native-mocks/screenshot';
import {ToastControllerMock} from "ionic-mocks";
import {ToastController} from "ionic-angular";

describe( 'ShareButtonComponent', () => {
    let component: ShareButtonComponent;
    let fixture: ComponentFixture<ShareButtonComponent>;

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
        // create component and test fixture
        fixture = TestBed.createComponent( ShareButtonComponent );

        // get test component from the fixture
        component = fixture.componentInstance;
    } );

    it( 'should be created', async () => {
        expect( component ).toBeDefined();
        expect( component instanceof ShareButtonComponent ).toBe( true );
    } );

} );
