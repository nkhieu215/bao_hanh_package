import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import dayjs from 'dayjs/esm';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IKho, Kho } from '../kho.model';

import { KhoService } from './kho.service';

describe('Kho Service', () => {
  let service: KhoService;
  let httpMock: HttpTestingController;
  let elemDefault: IKho;
  let expectedResult: IKho | IKho[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(KhoService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 0,
      maKho: 'AAAAAAA',
      tenKho: 'AAAAAAA',
      ngayTao: currentDate,
      username: 'AAAAAAA',
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign(
        {
          ngayTao: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a Kho', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
          ngayTao: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          ngayTao: currentDate,
        },
        returnedFromService
      );

      service.create(new Kho()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Kho', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          maKho: 'BBBBBB',
          tenKho: 'BBBBBB',
          ngayTao: currentDate.format(DATE_TIME_FORMAT),
          username: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          ngayTao: currentDate,
        },
        returnedFromService
      );

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Kho', () => {
      const patchObject = Object.assign(
        {
          maKho: 'BBBBBB',
          ngayTao: currentDate.format(DATE_TIME_FORMAT),
        },
        new Kho()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign(
        {
          ngayTao: currentDate,
        },
        returnedFromService
      );

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Kho', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          maKho: 'BBBBBB',
          tenKho: 'BBBBBB',
          ngayTao: currentDate.format(DATE_TIME_FORMAT),
          username: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          ngayTao: currentDate,
        },
        returnedFromService
      );

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a Kho', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addKhoToCollectionIfMissing', () => {
      it('should add a Kho to an empty array', () => {
        const kho: IKho = { id: 123 };
        expectedResult = service.addKhoToCollectionIfMissing([], kho);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(kho);
      });

      it('should not add a Kho to an array that contains it', () => {
        const kho: IKho = { id: 123 };
        const khoCollection: IKho[] = [
          {
            ...kho,
          },
          { id: 456 },
        ];
        expectedResult = service.addKhoToCollectionIfMissing(khoCollection, kho);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Kho to an array that doesn't contain it", () => {
        const kho: IKho = { id: 123 };
        const khoCollection: IKho[] = [{ id: 456 }];
        expectedResult = service.addKhoToCollectionIfMissing(khoCollection, kho);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(kho);
      });

      it('should add only unique Kho to an array', () => {
        const khoArray: IKho[] = [{ id: 123 }, { id: 456 }, { id: 97183 }];
        const khoCollection: IKho[] = [{ id: 123 }];
        expectedResult = service.addKhoToCollectionIfMissing(khoCollection, ...khoArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const kho: IKho = { id: 123 };
        const kho2: IKho = { id: 456 };
        expectedResult = service.addKhoToCollectionIfMissing([], kho, kho2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(kho);
        expect(expectedResult).toContain(kho2);
      });

      it('should accept null and undefined values', () => {
        const kho: IKho = { id: 123 };
        expectedResult = service.addKhoToCollectionIfMissing([], null, kho, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(kho);
      });

      it('should return initial array if no Kho is added', () => {
        const khoCollection: IKho[] = [{ id: 123 }];
        expectedResult = service.addKhoToCollectionIfMissing(khoCollection, undefined, null);
        expect(expectedResult).toEqual(khoCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
