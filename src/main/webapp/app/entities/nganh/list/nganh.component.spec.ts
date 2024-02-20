import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { NganhService } from '../service/nganh.service';

import { NganhComponent } from './nganh.component';

describe('Nganh Management Component', () => {
  let comp: NganhComponent;
  let fixture: ComponentFixture<NganhComponent>;
  let service: NganhService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [NganhComponent],
    })
      .overrideTemplate(NganhComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(NganhComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(NganhService);

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
    expect(comp.nganhs?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
