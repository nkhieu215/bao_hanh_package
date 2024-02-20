import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { NhomKhachHangService } from '../service/nhom-khach-hang.service';

import { NhomKhachHangComponent } from './nhom-khach-hang.component';

describe('NhomKhachHang Management Component', () => {
  let comp: NhomKhachHangComponent;
  let fixture: ComponentFixture<NhomKhachHangComponent>;
  let service: NhomKhachHangService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [NhomKhachHangComponent],
    })
      .overrideTemplate(NhomKhachHangComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(NhomKhachHangComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(NhomKhachHangService);

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
    expect(comp.nhomKhachHangs?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
