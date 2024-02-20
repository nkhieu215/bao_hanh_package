import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { PhanLoaiChiTietTiepNhanService } from '../service/phan-loai-chi-tiet-tiep-nhan.service';

import { PhanLoaiChiTietTiepNhanComponent } from './phan-loai-chi-tiet-tiep-nhan.component';

describe('PhanLoaiChiTietTiepNhan Management Component', () => {
  let comp: PhanLoaiChiTietTiepNhanComponent;
  let fixture: ComponentFixture<PhanLoaiChiTietTiepNhanComponent>;
  let service: PhanLoaiChiTietTiepNhanService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [PhanLoaiChiTietTiepNhanComponent],
    })
      .overrideTemplate(PhanLoaiChiTietTiepNhanComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PhanLoaiChiTietTiepNhanComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(PhanLoaiChiTietTiepNhanService);

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
    expect(comp.phanLoaiChiTietTiepNhans?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
