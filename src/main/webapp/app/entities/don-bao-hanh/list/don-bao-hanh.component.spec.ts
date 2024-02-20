import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { DonBaoHanhService } from '../service/don-bao-hanh.service';

import { DonBaoHanhComponent } from './don-bao-hanh.component';

describe('DonBaoHanh Management Component', () => {
  let comp: DonBaoHanhComponent;
  let fixture: ComponentFixture<DonBaoHanhComponent>;
  let service: DonBaoHanhService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [DonBaoHanhComponent],
    })
      .overrideTemplate(DonBaoHanhComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(DonBaoHanhComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(DonBaoHanhService);

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
    expect(comp.donBaoHanhs?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
