import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogProcesoComponent } from './dialog-proceso.component';

describe('DialogProcesoComponent', () => {
  let component: DialogProcesoComponent;
  let fixture: ComponentFixture<DialogProcesoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogProcesoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogProcesoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
