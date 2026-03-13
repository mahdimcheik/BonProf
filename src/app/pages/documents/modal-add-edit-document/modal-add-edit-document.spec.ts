import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAddEditDocument } from './modal-add-edit-document';

describe('ModalAddEditDocument', () => {
  let component: ModalAddEditDocument;
  let fixture: ComponentFixture<ModalAddEditDocument>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalAddEditDocument]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalAddEditDocument);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
