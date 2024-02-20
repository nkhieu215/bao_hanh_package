import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ChungLoaiService } from '../service/chung-loai.service';
import { IChungLoai, ChungLoai } from '../chung-loai.model';

import { ChungLoaiUpdateComponent } from './chung-loai-update.component';

describe('ChungLoai Management Update Component', () => {
  let comp: ChungLoaiUpdateComponent;
  let fixture: ComponentFixture<ChungLoaiUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let chungLoaiService: ChungLoaiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ChungLoaiUpdateComponent],
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
      .overrideTemplate(ChungLoaiUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ChungLoaiUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    chungLoaiService = TestBed.inject(ChungLoaiService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const chungLoai: IChungLoai = { id: 456 };

      activatedRoute.data = of({ chungLoai });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(chungLoai));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ChungLoai>>();
      const chungLoai = { id: 123 };
      jest.spyOn(chungLoaiService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ chungLoai });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: chungLoai }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(chungLoaiService.update).toHaveBeenCalledWith(chungLoai);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ChungLoai>>();
      const chungLoai = new ChungLoai();
      jest.spyOn(chungLoaiService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ chungLoai });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: chungLoai }));
      saveSubject.complete();

      // THEN
      expect(chungLoaiService.create).toHaveBeenCalledWith(chungLoai);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ChungLoai>>();
      const chungLoai = { id: 123 };
      jest.spyOn(chungLoaiService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ chungLoai });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(chungLoaiService.update).toHaveBeenCalledWith(chungLoai);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
