import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDishesComponent } from './add-dishes.component';

describe('AddDishesComponent', () => {
  let component: AddDishesComponent;
  let fixture: ComponentFixture<AddDishesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddDishesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddDishesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
