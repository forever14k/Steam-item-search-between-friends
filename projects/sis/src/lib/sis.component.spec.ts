import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SisComponent } from './sis.component';

describe('SisComponent', () => {
    let component: SisComponent;
    let fixture: ComponentFixture<SisComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ SisComponent ],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SisComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
