import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { TinhThanhDetailComponent } from './tinh-thanh-detail.component';

describe('TinhThanh Management Detail Component', () => {
  let comp: TinhThanhDetailComponent;
  let fixture: ComponentFixture<TinhThanhDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TinhThanhDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ tinhThanh: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(TinhThanhDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(TinhThanhDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load tinhThanh on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.tinhThanh).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
