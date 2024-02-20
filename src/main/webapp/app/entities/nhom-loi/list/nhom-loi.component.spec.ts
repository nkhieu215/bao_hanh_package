import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { NhomLoiService } from '../service/nhom-loi.service';

import { NhomLoiComponent } from './nhom-loi.component';

describe('NhomLoi Management Component', () => {
  let comp: NhomLoiComponent;
  let fixture: ComponentFixture<NhomLoiComponent>;
  let service: NhomLoiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [NhomLoiComponent],
    })
      .overrideTemplate(NhomLoiComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(NhomLoiComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(NhomLoiService);

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
    expect(comp.nhomLois?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
