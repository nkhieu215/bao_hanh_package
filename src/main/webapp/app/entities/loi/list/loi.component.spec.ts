import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { LoiService } from '../service/loi.service';

import { LoiComponent } from './loi.component';

describe('Loi Management Component', () => {
  let comp: LoiComponent;
  let fixture: ComponentFixture<LoiComponent>;
  let service: LoiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [LoiComponent],
    })
      .overrideTemplate(LoiComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(LoiComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(LoiService);

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
    expect(comp.lois?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
