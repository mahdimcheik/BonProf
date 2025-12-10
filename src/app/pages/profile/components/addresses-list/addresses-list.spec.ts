import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddressesList } from './addresses-list';

describe('AddressesList', () => {
  let component: AddressesList;
  let fixture: ComponentFixture<AddressesList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddressesList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddressesList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
