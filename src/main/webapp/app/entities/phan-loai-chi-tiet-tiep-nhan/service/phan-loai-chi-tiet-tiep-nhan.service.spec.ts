import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IPhanLoaiChiTietTiepNhan, PhanLoaiChiTietTiepNhan } from '../phan-loai-chi-tiet-tiep-nhan.model';

import { PhanLoaiChiTietTiepNhanService } from './phan-loai-chi-tiet-tiep-nhan.service';

describe('PhanLoaiChiTietTiepNhan Service', () => {
  let service: PhanLoaiChiTietTiepNhanService;
  let httpMock: HttpTestingController;
  let elemDefault: IPhanLoaiChiTietTiepNhan;
  let expectedResult: IPhanLoaiChiTietTiepNhan | IPhanLoaiChiTietTiepNhan[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(PhanLoaiChiTietTiepNhanService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      soLuong: 0,
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign({}, elemDefault);

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a PhanLoaiChiTietTiepNhan', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new PhanLoaiChiTietTiepNhan()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a PhanLoaiChiTietTiepNhan', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          soLuong: 1,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a PhanLoaiChiTietTiepNhan', () => {
      const patchObject = Object.assign({}, new PhanLoaiChiTietTiepNhan());

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of PhanLoaiChiTietTiepNhan', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          soLuong: 1,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a PhanLoaiChiTietTiepNhan', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addPhanLoaiChiTietTiepNhanToCollectionIfMissing', () => {
      it('should add a PhanLoaiChiTietTiepNhan to an empty array', () => {
        const phanLoaiChiTietTiepNhan: IPhanLoaiChiTietTiepNhan = { id: 123 };
        expectedResult = service.addPhanLoaiChiTietTiepNhanToCollectionIfMissing([], phanLoaiChiTietTiepNhan);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(phanLoaiChiTietTiepNhan);
      });

      it('should not add a PhanLoaiChiTietTiepNhan to an array that contains it', () => {
        const phanLoaiChiTietTiepNhan: IPhanLoaiChiTietTiepNhan = { id: 123 };
        const phanLoaiChiTietTiepNhanCollection: IPhanLoaiChiTietTiepNhan[] = [
          {
            ...phanLoaiChiTietTiepNhan,
          },
          { id: 456 },
        ];
        expectedResult = service.addPhanLoaiChiTietTiepNhanToCollectionIfMissing(
          phanLoaiChiTietTiepNhanCollection,
          phanLoaiChiTietTiepNhan
        );
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a PhanLoaiChiTietTiepNhan to an array that doesn't contain it", () => {
        const phanLoaiChiTietTiepNhan: IPhanLoaiChiTietTiepNhan = { id: 123 };
        const phanLoaiChiTietTiepNhanCollection: IPhanLoaiChiTietTiepNhan[] = [{ id: 456 }];
        expectedResult = service.addPhanLoaiChiTietTiepNhanToCollectionIfMissing(
          phanLoaiChiTietTiepNhanCollection,
          phanLoaiChiTietTiepNhan
        );
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(phanLoaiChiTietTiepNhan);
      });

      it('should add only unique PhanLoaiChiTietTiepNhan to an array', () => {
        const phanLoaiChiTietTiepNhanArray: IPhanLoaiChiTietTiepNhan[] = [{ id: 123 }, { id: 456 }, { id: 27914 }];
        const phanLoaiChiTietTiepNhanCollection: IPhanLoaiChiTietTiepNhan[] = [{ id: 123 }];
        expectedResult = service.addPhanLoaiChiTietTiepNhanToCollectionIfMissing(
          phanLoaiChiTietTiepNhanCollection,
          ...phanLoaiChiTietTiepNhanArray
        );
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const phanLoaiChiTietTiepNhan: IPhanLoaiChiTietTiepNhan = { id: 123 };
        const phanLoaiChiTietTiepNhan2: IPhanLoaiChiTietTiepNhan = { id: 456 };
        expectedResult = service.addPhanLoaiChiTietTiepNhanToCollectionIfMissing([], phanLoaiChiTietTiepNhan, phanLoaiChiTietTiepNhan2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(phanLoaiChiTietTiepNhan);
        expect(expectedResult).toContain(phanLoaiChiTietTiepNhan2);
      });

      it('should accept null and undefined values', () => {
        const phanLoaiChiTietTiepNhan: IPhanLoaiChiTietTiepNhan = { id: 123 };
        expectedResult = service.addPhanLoaiChiTietTiepNhanToCollectionIfMissing([], null, phanLoaiChiTietTiepNhan, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(phanLoaiChiTietTiepNhan);
      });

      it('should return initial array if no PhanLoaiChiTietTiepNhan is added', () => {
        const phanLoaiChiTietTiepNhanCollection: IPhanLoaiChiTietTiepNhan[] = [{ id: 123 }];
        expectedResult = service.addPhanLoaiChiTietTiepNhanToCollectionIfMissing(phanLoaiChiTietTiepNhanCollection, undefined, null);
        expect(expectedResult).toEqual(phanLoaiChiTietTiepNhanCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
