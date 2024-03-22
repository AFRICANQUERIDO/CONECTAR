import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecialistsProfileComponent } from './specialists-profile.component';

describe('SpecialistsProfileComponent', () => {
  let component: SpecialistsProfileComponent;
  let fixture: ComponentFixture<SpecialistsProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpecialistsProfileComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SpecialistsProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
