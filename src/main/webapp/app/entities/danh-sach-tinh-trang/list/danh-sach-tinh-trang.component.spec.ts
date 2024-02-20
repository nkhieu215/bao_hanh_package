import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { DanhSachTinhTrangService } from '../service/danh-sach-tinh-trang.service';

import { DanhSachTinhTrangComponent } from './danh-sach-tinh-trang.component';

describe('DanhSachTinhTrang Management Component', () => {
  let comp: DanhSachTinhTrangComponent;
  let fixture: ComponentFixture<DanhSachTinhTrangComponent>;
  let service: DanhSachTinhTrangService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [DanhSachTinhTrangComponent],
    })
      .overrideTemplate(DanhSachTinhTrangComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(DanhSachTinhTrangComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(DanhSachTinhTrangService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.danhSachTinhTrangs?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
