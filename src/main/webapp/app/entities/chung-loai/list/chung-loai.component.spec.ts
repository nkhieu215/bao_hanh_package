import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { ChungLoaiService } from '../service/chung-loai.service';

import { ChungLoaiComponent } from './chung-loai.component';

describe('ChungLoai Management Component', () => {
  let comp: ChungLoaiComponent;
  let fixture: ComponentFixture<ChungLoaiComponent>;
  let service: ChungLoaiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ChungLoaiComponent],
    })
      .overrideTemplate(ChungLoaiComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ChungLoaiComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(ChungLoaiService);

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
    expect(comp.chungLoais?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
