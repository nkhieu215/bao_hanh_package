import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { DanhSachTinhTrangService } from '../service/danh-sach-tinh-trang.service';
import { IDanhSachTinhTrang, DanhSachTinhTrang } from '../danh-sach-tinh-trang.model';

import { DanhSachTinhTrangUpdateComponent } from './danh-sach-tinh-trang-update.component';

describe('DanhSachTinhTrang Management Update Component', () => {
  let comp: DanhSachTinhTrangUpdateComponent;
  let fixture: ComponentFixture<DanhSachTinhTrangUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let danhSachTinhTrangService: DanhSachTinhTrangService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [DanhSachTinhTrangUpdateComponent],
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
      .overrideTemplate(DanhSachTinhTrangUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(DanhSachTinhTrangUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    danhSachTinhTrangService = TestBed.inject(DanhSachTinhTrangService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const danhSachTinhTrang: IDanhSachTinhTrang = { id: 456 };

      activatedRoute.data = of({ danhSachTinhTrang });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(danhSachTinhTrang));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<DanhSachTinhTrang>>();
      const danhSachTinhTrang = { id: 123 };
      jest.spyOn(danhSachTinhTrangService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ danhSachTinhTrang });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: danhSachTinhTrang }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(danhSachTinhTrangService.update).toHaveBeenCalledWith(danhSachTinhTrang);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<DanhSachTinhTrang>>();
      const danhSachTinhTrang = new DanhSachTinhTrang();
      jest.spyOn(danhSachTinhTrangService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ danhSachTinhTrang });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: danhSachTinhTrang }));
      saveSubject.complete();

      // THEN
      expect(danhSachTinhTrangService.create).toHaveBeenCalledWith(danhSachTinhTrang);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<DanhSachTinhTrang>>();
      const danhSachTinhTrang = { id: 123 };
      jest.spyOn(danhSachTinhTrangService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ danhSachTinhTrang });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(danhSachTinhTrangService.update).toHaveBeenCalledWith(danhSachTinhTrang);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
