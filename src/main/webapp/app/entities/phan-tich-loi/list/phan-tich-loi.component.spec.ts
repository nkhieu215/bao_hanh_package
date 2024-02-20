import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { PhanTichLoiService } from '../service/phan-tich-loi.service';

import { PhanTichLoiComponent } from './phan-tich-loi.component';

describe('PhanTichLoi Management Component', () => {
  let comp: PhanTichLoiComponent;
  let fixture: ComponentFixture<PhanTichLoiComponent>;
  let service: PhanTichLoiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [PhanTichLoiComponent],
    })
      .overrideTemplate(PhanTichLoiComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PhanTichLoiComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(PhanTichLoiService);

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
    expect(comp.phanTichLois?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
