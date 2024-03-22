import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegSpecialistComponent } from './reg-specialist.component';

describe('RegSpecialistComponent', () => {
  let component: RegSpecialistComponent;
  let fixture: ComponentFixture<RegSpecialistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegSpecialistComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RegSpecialistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
