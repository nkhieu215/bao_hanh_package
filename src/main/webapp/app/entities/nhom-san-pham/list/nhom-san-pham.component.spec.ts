import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { NhomSanPhamService } from '../service/nhom-san-pham.service';

import { NhomSanPhamComponent } from './nhom-san-pham.component';

describe('NhomSanPham Management Component', () => {
  let comp: NhomSanPhamComponent;
  let fixture: ComponentFixture<NhomSanPhamComponent>;
  let service: NhomSanPhamService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [NhomSanPhamComponent],
    })
      .overrideTemplate(NhomSanPhamComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(NhomSanPhamComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(NhomSanPhamService);

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
    expect(comp.nhomSanPhams?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
