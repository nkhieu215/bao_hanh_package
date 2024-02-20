import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { TinhThanhService } from '../service/tinh-thanh.service';

import { TinhThanhComponent } from './tinh-thanh.component';

describe('TinhThanh Management Component', () => {
  let comp: TinhThanhComponent;
  let fixture: ComponentFixture<TinhThanhComponent>;
  let service: TinhThanhService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [TinhThanhComponent],
    })
      .overrideTemplate(TinhThanhComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(TinhThanhComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(TinhThanhService);

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
    expect(comp.tinhThanhs?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
