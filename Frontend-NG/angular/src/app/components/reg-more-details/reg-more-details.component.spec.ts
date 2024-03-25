import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegMoreDetailsComponent } from './reg-more-details.component';

describe('RegMoreDetailsComponent', () => {
  let component: RegMoreDetailsComponent;
  let fixture: ComponentFixture<RegMoreDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegMoreDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RegMoreDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
