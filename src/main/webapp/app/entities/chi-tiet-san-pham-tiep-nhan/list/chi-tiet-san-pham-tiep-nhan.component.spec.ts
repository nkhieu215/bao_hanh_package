import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { ChiTietSanPhamTiepNhanService } from '../service/chi-tiet-san-pham-tiep-nhan.service';

import { ChiTietSanPhamTiepNhanComponent } from './chi-tiet-san-pham-tiep-nhan.component';

describe('ChiTietSanPhamTiepNhan Management Component', () => {
  let comp: ChiTietSanPhamTiepNhanComponent;
  let fixture: ComponentFixture<ChiTietSanPhamTiepNhanComponent>;
  let service: ChiTietSanPhamTiepNhanService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ChiTietSanPhamTiepNhanComponent],
    })
      .overrideTemplate(ChiTietSanPhamTiepNhanComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ChiTietSanPhamTiepNhanComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(ChiTietSanPhamTiepNhanService);

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
    expect(comp.chiTietSanPhamTiepNhans?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
