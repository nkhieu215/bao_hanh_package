import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ITinhThanh, TinhThanh } from '../tinh-thanh.model';

import { TinhThanhService } from './tinh-thanh.service';

describe('TinhThanh Service', () => {
  let service: TinhThanhService;
  let httpMock: HttpTestingController;
  let elemDefault: ITinhThanh;
  let expectedResult: ITinhThanh | ITinhThanh[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(TinhThanhService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      idTinhThanh: 0,
      name: 'AAAAAAA',
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

    it('should create a TinhThanh', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new TinhThanh()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a TinhThanh', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          idTinhThanh: 1,
          name: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a TinhThanh', () => {
      const patchObject = Object.assign(
        {
          name: 'BBBBBB',
        },
        new TinhThanh()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of TinhThanh', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          idTinhThanh: 1,
          name: 'BBBBBB',
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

    it('should delete a TinhThanh', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addTinhThanhToCollectionIfMissing', () => {
      it('should add a TinhThanh to an empty array', () => {
        const tinhThanh: ITinhThanh = { id: 123 };
        expectedResult = service.addTinhThanhToCollectionIfMissing([], tinhThanh);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(tinhThanh);
      });

      it('should not add a TinhThanh to an array that contains it', () => {
        const tinhThanh: ITinhThanh = { id: 123 };
        const tinhThanhCollection: ITinhThanh[] = [
          {
            ...tinhThanh,
          },
          { id: 456 },
        ];
        expectedResult = service.addTinhThanhToCollectionIfMissing(tinhThanhCollection, tinhThanh);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a TinhThanh to an array that doesn't contain it", () => {
        const tinhThanh: ITinhThanh = { id: 123 };
        const tinhThanhCollection: ITinhThanh[] = [{ id: 456 }];
        expectedResult = service.addTinhThanhToCollectionIfMissing(tinhThanhCollection, tinhThanh);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(tinhThanh);
      });

      it('should add only unique TinhThanh to an array', () => {
        const tinhThanhArray: ITinhThanh[] = [{ id: 123 }, { id: 456 }, { id: 52712 }];
        const tinhThanhCollection: ITinhThanh[] = [{ id: 123 }];
        expectedResult = service.addTinhThanhToCollectionIfMissing(tinhThanhCollection, ...tinhThanhArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const tinhThanh: ITinhThanh = { id: 123 };
        const tinhThanh2: ITinhThanh = { id: 456 };
        expectedResult = service.addTinhThanhToCollectionIfMissing([], tinhThanh, tinhThanh2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(tinhThanh);
        expect(expectedResult).toContain(tinhThanh2);
      });

      it('should accept null and undefined values', () => {
        const tinhThanh: ITinhThanh = { id: 123 };
        expectedResult = service.addTinhThanhToCollectionIfMissing([], null, tinhThanh, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(tinhThanh);
      });

      it('should return initial array if no TinhThanh is added', () => {
        const tinhThanhCollection: ITinhThanh[] = [{ id: 123 }];
        expectedResult = service.addTinhThanhToCollectionIfMissing(tinhThanhCollection, undefined, null);
        expect(expectedResult).toEqual(tinhThanhCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
