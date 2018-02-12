import { TestBed, async, getTestBed, inject } from '@angular/core/testing';

import { InitService } from './init-service';
import { GlobalService } from '../global-service/global-service';

import { HttpClient, HttpClientModule, HttpHandler } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpLoaderFactory } from '../../app/app.module';
import GlobalServiceMock from '../../../test-config/mocks/global-service';
import { Observable } from 'rxjs';

describe( 'Provider: InitService', () => {

    let httpMock: HttpTestingController;
    let injector;
    let service;
    let originalTimeout;

    const moduleDef = {
        declarations: [

        ],

        imports: [
            HttpClientModule,
            HttpClientTestingModule,
            TranslateModule.forRoot( {
                loader: {
                    deps: [ HttpClient ],
                    provide: TranslateLoader,
                    useFactory: ( HttpLoaderFactory ),
                }
            } )
        ],

        providers: [
            InitService,
            HttpClient,
            HttpHandler,
            { provide: GlobalService, useClass: GlobalServiceMock },
        ],

    };

    beforeEach( async () => {
        TestBed.configureTestingModule( moduleDef );
    } );

    beforeEach( () => {
        originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
        injector = getTestBed();
        service = injector.get( InitService );
        httpMock = injector.get( HttpTestingController );
        service.GlobalService = new GlobalServiceMock();
    } );

    afterEach( () => {
        injector = null;
        httpMock = null;
        service = null;
        jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    } );

    it( 'should be created', () => {
        expect( service ).toBeTruthy();
        expect( service ).toBeDefined();
        expect( service instanceof InitService ).toBe( true );
    } );

    it( 'gets dev data on init when DEVMODE is active', () => {
        GlobalService.DEV_MODE = true;
        spyOn( service, 'getFile' ).and.callFake( () => {} );
        service.getInitData();
        expect( service.getFile ).toHaveBeenCalledWith( GlobalService.URL_INFO_DEV );
    } );

    it( 'gets prod data on init when DEVMODE is inactive', () => {
        GlobalService.DEV_MODE = false;
        spyOn( service, 'getFile' ).and.callFake( () => {} );
        service.getInitData();
        expect( service.getFile ).toHaveBeenCalledWith( GlobalService.URL_INFO_PROD );
    } );

    it( 'gets dev data on init when forceDevMode param is true', () => {
        spyOn( service, 'getFile' ).and.callFake( () => {} );
        service.getInitData( true );
        expect( service.getFile ).toHaveBeenCalledWith( GlobalService.URL_INFO_DEV );
    } );

    it( 'gets file', ( done ) => {
        const spy = spyOn( service, 'getFile' ).and.callThrough();
        spyOn( service.http, 'get' ).and.returnValue( Observable.of( {} ) );

        const url = 'fakeUrl';

        service.getFile( url );

        spy.calls.mostRecent().returnValue.then( () => {
            expect( service.http.get ).toHaveBeenCalledWith( url );
            done();
        } );

        // spy.calls.mostRecent().returnValue.catch( () => {
        //     expect( service.http.get ).toHaveBeenCalledWith( url );
        //     done();
        // } );

    } );

} );
