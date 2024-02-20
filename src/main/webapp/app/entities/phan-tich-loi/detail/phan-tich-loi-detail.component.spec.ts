import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { PhanTichLoiDetailComponent } from './phan-tich-loi-detail.component';

describe('PhanTichLoi Management Detail Component', () => {
  let comp: PhanTichLoiDetailComponent;
  let fixture: ComponentFixture<PhanTichLoiDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PhanTichLoiDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ phanTichLoi: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(PhanTichLoiDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(PhanTichLoiDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load phanTichLoi on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.phanTichLoi).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
