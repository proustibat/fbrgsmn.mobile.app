import { TabsPage } from './tabs';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { IonicModule } from 'ionic-angular';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { HttpLoaderFactory } from '../../app/app.module';

describe( 'TabsPage', () => {
    let component: TabsPage;
    let fixture: ComponentFixture<TabsPage>;

    beforeEach( async ( () => {
        TestBed.configureTestingModule( {
            declarations: [ TabsPage ],
            imports: [
                IonicModule.forRoot( TabsPage ),
                TranslateModule.forRoot( {
                    loader: {
                        deps: [ HttpClient ],
                        provide: TranslateLoader,
                        useFactory: ( HttpLoaderFactory ),
                    }
                } ),
            ],
            providers: [
                HttpClient,
                HttpHandler,
            ]
        } );
    } ) );

    beforeEach( () => {
        // create component and test fixture
        fixture = TestBed.createComponent( TabsPage );

        // get test component from the fixture
        component = fixture.componentInstance;
    } );

    afterEach( () => {
        fixture.destroy();
        component = null;
    } );

    it( 'should be created', async () => {
        expect( component ).toBeTruthy();
        expect( component ).toBeDefined();
        expect( component instanceof TabsPage ).toBe( true );
    } );
} );
