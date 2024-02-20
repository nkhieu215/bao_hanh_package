import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { KhoService } from '../service/kho.service';

import { KhoComponent } from './kho.component';

describe('Kho Management Component', () => {
  let comp: KhoComponent;
  let fixture: ComponentFixture<KhoComponent>;
  let service: KhoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [KhoComponent],
    })
      .overrideTemplate(KhoComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(KhoComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(KhoService);

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
    expect(comp.khos?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
