import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { NhomKhachHangDetailComponent } from './nhom-khach-hang-detail.component';

describe('NhomKhachHang Management Detail Component', () => {
  let comp: NhomKhachHangDetailComponent;
  let fixture: ComponentFixture<NhomKhachHangDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NhomKhachHangDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ nhomKhachHang: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(NhomKhachHangDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(NhomKhachHangDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load nhomKhachHang on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.nhomKhachHang).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
