import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { SanPhamService } from '../service/san-pham.service';
import { ISanPham, SanPham } from '../san-pham.model';
import { INhomSanPham } from 'app/entities/nhom-san-pham/nhom-san-pham.model';
import { NhomSanPhamService } from 'app/entities/nhom-san-pham/service/nhom-san-pham.service';
import { IKho } from 'app/entities/kho/kho.model';
import { KhoService } from 'app/entities/kho/service/kho.service';
import { INganh } from 'app/entities/nganh/nganh.model';
import { NganhService } from 'app/entities/nganh/service/nganh.service';

import { SanPhamUpdateComponent } from './san-pham-update.component';

describe('SanPham Management Update Component', () => {
  let comp: SanPhamUpdateComponent;
  let fixture: ComponentFixture<SanPhamUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let sanPhamService: SanPhamService;
  let nhomSanPhamService: NhomSanPhamService;
  let khoService: KhoService;
  let nganhService: NganhService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [SanPhamUpdateComponent],
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
      .overrideTemplate(SanPhamUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(SanPhamUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    sanPhamService = TestBed.inject(SanPhamService);
    nhomSanPhamService = TestBed.inject(NhomSanPhamService);
    khoService = TestBed.inject(KhoService);
    nganhService = TestBed.inject(NganhService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call NhomSanPham query and add missing value', () => {
      const sanPham: ISanPham = { id: 456, name: '' };
      const nhomSanPham: INhomSanPham = { id: 56276 };
      sanPham.nhomSanPham = nhomSanPham;

      const nhomSanPhamCollection: INhomSanPham[] = [{ id: 91246 }];
      jest.spyOn(nhomSanPhamService, 'query').mockReturnValue(of(new HttpResponse({ body: nhomSanPhamCollection })));
      const additionalNhomSanPhams = [nhomSanPham];
      const expectedCollection: INhomSanPham[] = [...additionalNhomSanPhams, ...nhomSanPhamCollection];
      jest.spyOn(nhomSanPhamService, 'addNhomSanPhamToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ sanPham });
      comp.ngOnInit();

      expect(nhomSanPhamService.query).toHaveBeenCalled();
      expect(nhomSanPhamService.addNhomSanPhamToCollectionIfMissing).toHaveBeenCalledWith(nhomSanPhamCollection, ...additionalNhomSanPhams);
      expect(comp.nhomSanPhamsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Kho query and add missing value', () => {
      const sanPham: ISanPham = { id: 456, name: '' };
      const kho: IKho = { id: 27464 };
      sanPham.kho = kho;

      const khoCollection: IKho[] = [{ id: 76950 }];
      jest.spyOn(khoService, 'query').mockReturnValue(of(new HttpResponse({ body: khoCollection })));
      const additionalKhos = [kho];
      const expectedCollection: IKho[] = [...additionalKhos, ...khoCollection];
      jest.spyOn(khoService, 'addKhoToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ sanPham });
      comp.ngOnInit();

      expect(khoService.query);
      expect(khoService.addKhoToCollectionIfMissing);
      expect(comp.khosSharedCollection);
    });

    it('Should call Nganh query and add missing value', () => {
      const sanPham: ISanPham = { id: 456, name: '' };
      const nganh: INganh = { id: 78379 };
      sanPham.nganh = nganh;

      const nganhCollection: INganh[] = [{ id: 94500 }];
      jest.spyOn(nganhService, 'query').mockReturnValue(of(new HttpResponse({ body: nganhCollection })));
      const additionalNganhs = [nganh];
      const expectedCollection: INganh[] = [...additionalNganhs, ...nganhCollection];
      jest.spyOn(nganhService, 'addNganhToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ sanPham });
      comp.ngOnInit();

      expect(nganhService.query);
      expect(nganhService.addNganhToCollectionIfMissing);
      expect(comp.nganhsSharedCollection);
    });

    it('Should update editForm', () => {
      const sanPham: ISanPham = { id: 456, name: '' };
      const nhomSanPham: INhomSanPham = { id: 5332 };
      sanPham.nhomSanPham = nhomSanPham;
      const kho: IKho = { id: 56022 };
      sanPham.kho = kho;
      const nganh: INganh = { id: 65369 };
      sanPham.nganh = nganh;

      activatedRoute.data = of({ sanPham });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(sanPham));
      expect(comp.nhomSanPhamsSharedCollection).toContain(nhomSanPham);
      expect(comp.khosSharedCollection).toContain(kho);
      expect(comp.nganhsSharedCollection).toContain(nganh);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<SanPham>>();
      const sanPham = { id: 123, name: '' };
      jest.spyOn(sanPhamService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ sanPham });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: sanPham }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(sanPhamService.update);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<SanPham>>();
      const sanPham = new SanPham();
      jest.spyOn(sanPhamService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ sanPham });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: sanPham }));
      saveSubject.complete();

      // THEN
      expect(sanPhamService.create);
      expect(comp.isSaving);
      expect(comp.previousState);
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<SanPham>>();
      const sanPham = { id: 123 };
      jest.spyOn(sanPhamService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ sanPham });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(sanPhamService.update);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackNhomSanPhamById', () => {
      it('Should return tracked NhomSanPham primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackNhomSanPhamById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackKhoById', () => {
      it('Should return tracked Kho primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackKhoById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackNganhById', () => {
      it('Should return tracked Nganh primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackNganhById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
