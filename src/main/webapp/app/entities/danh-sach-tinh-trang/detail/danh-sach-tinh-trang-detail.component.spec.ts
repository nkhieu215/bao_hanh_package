import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { DanhSachTinhTrangDetailComponent } from './danh-sach-tinh-trang-detail.component';

describe('DanhSachTinhTrang Management Detail Component', () => {
  let comp: DanhSachTinhTrangDetailComponent;
  let fixture: ComponentFixture<DanhSachTinhTrangDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DanhSachTinhTrangDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ danhSachTinhTrang: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(DanhSachTinhTrangDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(DanhSachTinhTrangDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load danhSachTinhTrang on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.danhSachTinhTrang).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
