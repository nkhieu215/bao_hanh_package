import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { NhomSanPhamService } from '../service/nhom-san-pham.service';
import { INhomSanPham, NhomSanPham } from '../nhom-san-pham.model';
import { IChungLoai } from 'app/entities/chung-loai/chung-loai.model';
import { ChungLoaiService } from 'app/entities/chung-loai/service/chung-loai.service';

import { NhomSanPhamUpdateComponent } from './nhom-san-pham-update.component';

describe('NhomSanPham Management Update Component', () => {
  let comp: NhomSanPhamUpdateComponent;
  let fixture: ComponentFixture<NhomSanPhamUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let nhomSanPhamService: NhomSanPhamService;
  let chungLoaiService: ChungLoaiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [NhomSanPhamUpdateComponent],
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
      .overrideTemplate(NhomSanPhamUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(NhomSanPhamUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    nhomSanPhamService = TestBed.inject(NhomSanPhamService);
    chungLoaiService = TestBed.inject(ChungLoaiService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call ChungLoai query and add missing value', () => {
      const nhomSanPham: INhomSanPham = { id: 456 };
      const chungLoai: IChungLoai = { id: 4029 };
      nhomSanPham.chungLoai = chungLoai;

      const chungLoaiCollection: IChungLoai[] = [{ id: 22334 }];
      jest.spyOn(chungLoaiService, 'query').mockReturnValue(of(new HttpResponse({ body: chungLoaiCollection })));
      const additionalChungLoais = [chungLoai];
      const expectedCollection: IChungLoai[] = [...additionalChungLoais, ...chungLoaiCollection];
      jest.spyOn(chungLoaiService, 'addChungLoaiToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ nhomSanPham });
      comp.ngOnInit();

      expect(chungLoaiService.query).toHaveBeenCalled();
      expect(chungLoaiService.addChungLoaiToCollectionIfMissing).toHaveBeenCalledWith(chungLoaiCollection, ...additionalChungLoais);
      expect(comp.chungLoaisSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const nhomSanPham: INhomSanPham = { id: 456 };
      const chungLoai: IChungLoai = { id: 56471 };
      nhomSanPham.chungLoai = chungLoai;

      activatedRoute.data = of({ nhomSanPham });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(nhomSanPham));
      expect(comp.chungLoaisSharedCollection).toContain(chungLoai);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<NhomSanPham>>();
      const nhomSanPham = { id: 123 };
      jest.spyOn(nhomSanPhamService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ nhomSanPham });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: nhomSanPham }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(nhomSanPhamService.update).toHaveBeenCalledWith(nhomSanPham);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<NhomSanPham>>();
      const nhomSanPham = new NhomSanPham();
      jest.spyOn(nhomSanPhamService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ nhomSanPham });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: nhomSanPham }));
      saveSubject.complete();

      // THEN
      expect(nhomSanPhamService.create).toHaveBeenCalledWith(nhomSanPham);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<NhomSanPham>>();
      const nhomSanPham = { id: 123 };
      jest.spyOn(nhomSanPhamService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ nhomSanPham });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(nhomSanPhamService.update).toHaveBeenCalledWith(nhomSanPham);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackChungLoaiById', () => {
      it('Should return tracked ChungLoai primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackChungLoaiById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
