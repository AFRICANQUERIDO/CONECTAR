import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateGigComponent } from './update-gig.component';

describe('UpdateGigComponent', () => {
  let component: UpdateGigComponent;
  let fixture: ComponentFixture<UpdateGigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateGigComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UpdateGigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
