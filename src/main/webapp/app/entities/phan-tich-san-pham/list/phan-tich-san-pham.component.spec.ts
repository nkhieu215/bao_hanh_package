import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { PhanTichSanPhamService } from '../service/phan-tich-san-pham.service';

import { PhanTichSanPhamComponent } from './phan-tich-san-pham.component';

describe('PhanTichSanPham Management Component', () => {
  let comp: PhanTichSanPhamComponent;
  let fixture: ComponentFixture<PhanTichSanPhamComponent>;
  let service: PhanTichSanPhamService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [PhanTichSanPhamComponent],
    })
      .overrideTemplate(PhanTichSanPhamComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PhanTichSanPhamComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(PhanTichSanPhamService);

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
    expect(comp.phanTichSanPhams?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
