import { TestBed, fakeAsync, getTestBed, tick } from '@angular/core/testing';
import { LoadingController, Toast, ToastController } from 'ionic-angular';
import { PromptService } from './prompt-service';
import { GlobalService } from './global-service';
import { LoadingControllerMock, MockToastCtrl } from '../../test-config/mocks/ionic';
import { Observable } from 'rxjs';

describe( 'Provider: PromptService', () => {

    let injector;
    let service;
    const moduleDef = {
        declarations: [],

        providers: [
            PromptService,
            GlobalService,
            { provide: LoadingController, useClass: LoadingControllerMock },
            { provide: ToastController, useClass: MockToastCtrl },
        ],

        imports: [],
    };

    beforeEach( () => {
        injector = getTestBed();
        TestBed.configureTestingModule( moduleDef );
        service = injector.get( PromptService );
    } );

    it( 'should be created', () => {
        expect( service ).toBeTruthy();
        expect( service ).toBeDefined();
        expect( service instanceof PromptService ).toBe( true );
    } );

    it( 'presentLoading with message posts by default', () => {

        spyOn( service.loadingCtrl.component, 'present' ).and.callThrough();
        spyOn( GlobalService, 'getRandomMessageIn' ).and.callThrough();
        service.presentLoading();
        expect( service.loadingCtrl.component.present ).toHaveBeenCalled();
        expect( GlobalService.getRandomMessageIn ).toHaveBeenCalledWith( GlobalService.loadingMsgPosts );
    } );

    it( 'presentLoading for radio by default', () => {
        spyOn( service.loadingCtrl.component, 'present' ).and.callThrough();
        spyOn( GlobalService, 'getRandomMessageIn' ).and.callThrough();
        service.presentLoading( true );
        expect( service.loadingCtrl.component.present ).toHaveBeenCalled();
        expect( GlobalService.getRandomMessageIn ).toHaveBeenCalledWith( GlobalService.loadingMsgRadio );
    } );

    it( 'dismissLoading if there is a loader', () => {
        spyOn( service.loadingCtrl.component, 'dismiss' ).and.callThrough();
        service.presentLoading();
        service.dismissLoading();
        expect( service.loadingCtrl.component.dismiss ).toHaveBeenCalled();
    } );

    it( 'dismissLoading if there is not a loader', () => {
        spyOn( service.loadingCtrl.component, 'dismiss' ).and.callThrough();
        service.dismissLoading();
        expect( service.loadingCtrl.component.dismiss ).not.toHaveBeenCalled();
        expect().nothing();
    } );

    it( 'presentMessage creates a Toast instance, displays it, dismiss it and run callback if needed', () => {
        const options = {
            closeButtonText: 'x',
            cssClass: '',
            dismissOnPageChange: true,
            duration: 5000,
            message: 'hello',
            position: 'bottom',
            showCloseButton: true
        };
        const observer = { callback: () => { console.log( 'coucou' ); } };
        spyOn( service.toastCtrl, 'create' ).and.callThrough();
        spyOn( service.toastCtrl.instance, 'present' ).and.callThrough();
        spyOn( service.toastCtrl.instance, 'onDidDismiss' ).and.callThrough();
        spyOn( observer, 'callback' ).and.callThrough();

        service.presentMessage( { message: 'hello', callback: observer.callback } );
        expect( service.toastCtrl.create ).toHaveBeenCalledWith( options );
        expect( service.toastCtrl.instance.present ).toHaveBeenCalled();
        expect( service.toastCtrl.instance.onDidDismiss ).toHaveBeenCalled();
        expect( observer.callback ).toHaveBeenCalled();
    } );

    it( 'presentMessage don\'t run callback', () => {
        service.presentMessage( { message: 'hello' } );
        expect().nothing();
    } );

    it( 'presentMessage dismiss current Toast if it exists', () => {
        service.messageToast = service.toastCtrl.create( {
            closeButtonText: 'x',
            cssClass: '',
            dismissOnPageChange: true,
            duration: 5000,
            message: 'hello',
            position: 'bottom',
            showCloseButton: true
        } );
        spyOn( service.toastCtrl.instance, 'dismiss' ).and.callThrough();
        service.presentMessage( { message: 'hello' } );
        expect( service.toastCtrl.instance.dismiss ).toHaveBeenCalled();
    } );

} );
