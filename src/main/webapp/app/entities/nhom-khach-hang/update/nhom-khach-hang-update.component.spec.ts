import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { NhomKhachHangService } from '../service/nhom-khach-hang.service';
import { INhomKhachHang, NhomKhachHang } from '../nhom-khach-hang.model';

import { NhomKhachHangUpdateComponent } from './nhom-khach-hang-update.component';

describe('NhomKhachHang Management Update Component', () => {
  let comp: NhomKhachHangUpdateComponent;
  let fixture: ComponentFixture<NhomKhachHangUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let nhomKhachHangService: NhomKhachHangService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [NhomKhachHangUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(NhomKhachHangUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(NhomKhachHangUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    nhomKhachHangService = TestBed.inject(NhomKhachHangService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const nhomKhachHang: INhomKhachHang = { id: 456 };

      activatedRoute.data = of({ nhomKhachHang });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(nhomKhachHang));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<NhomKhachHang>>();
      const nhomKhachHang = { id: 123 };
      jest.spyOn(nhomKhachHangService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ nhomKhachHang });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: nhomKhachHang }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(nhomKhachHangService.update).toHaveBeenCalledWith(nhomKhachHang);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<NhomKhachHang>>();
      const nhomKhachHang = new NhomKhachHang();
      jest.spyOn(nhomKhachHangService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ nhomKhachHang });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: nhomKhachHang }));
      saveSubject.complete();

      // THEN
      expect(nhomKhachHangService.create).toHaveBeenCalledWith(nhomKhachHang);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<NhomKhachHang>>();
      const nhomKhachHang = { id: 123 };
      jest.spyOn(nhomKhachHangService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ nhomKhachHang });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(nhomKhachHangService.update).toHaveBeenCalledWith(nhomKhachHang);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
