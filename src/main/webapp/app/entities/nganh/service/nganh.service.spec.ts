import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import dayjs from 'dayjs/esm';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { INganh, Nganh } from '../nganh.model';

import { NganhService } from './nganh.service';

describe('Nganh Service', () => {
  let service: NganhService;
  let httpMock: HttpTestingController;
  let elemDefault: INganh;
  let expectedResult: INganh | INganh[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(NganhService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 0,
      maNganh: 'AAAAAAA',
      tenNganh: 'AAAAAAA',
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

    it('should create a Nganh', () => {
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

      service.create(new Nganh()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Nganh', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          maNganh: 'BBBBBB',
          tenNganh: 'BBBBBB',
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

    it('should partial update a Nganh', () => {
      const patchObject = Object.assign(
        {
          tenNganh: 'BBBBBB',
          ngayTao: currentDate.format(DATE_TIME_FORMAT),
        },
        new Nganh()
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

    it('should return a list of Nganh', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          maNganh: 'BBBBBB',
          tenNganh: 'BBBBBB',
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

    it('should delete a Nganh', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addNganhToCollectionIfMissing', () => {
      it('should add a Nganh to an empty array', () => {
        const nganh: INganh = { id: 123 };
        expectedResult = service.addNganhToCollectionIfMissing([], nganh);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(nganh);
      });

      it('should not add a Nganh to an array that contains it', () => {
        const nganh: INganh = { id: 123 };
        const nganhCollection: INganh[] = [
          {
            ...nganh,
          },
          { id: 456 },
        ];
        expectedResult = service.addNganhToCollectionIfMissing(nganhCollection, nganh);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Nganh to an array that doesn't contain it", () => {
        const nganh: INganh = { id: 123 };
        const nganhCollection: INganh[] = [{ id: 456 }];
        expectedResult = service.addNganhToCollectionIfMissing(nganhCollection, nganh);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(nganh);
      });

      it('should add only unique Nganh to an array', () => {
        const nganhArray: INganh[] = [{ id: 123 }, { id: 456 }, { id: 70357 }];
        const nganhCollection: INganh[] = [{ id: 123 }];
        expectedResult = service.addNganhToCollectionIfMissing(nganhCollection, ...nganhArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const nganh: INganh = { id: 123 };
        const nganh2: INganh = { id: 456 };
        expectedResult = service.addNganhToCollectionIfMissing([], nganh, nganh2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(nganh);
        expect(expectedResult).toContain(nganh2);
      });

      it('should accept null and undefined values', () => {
        const nganh: INganh = { id: 123 };
        expectedResult = service.addNganhToCollectionIfMissing([], null, nganh, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(nganh);
      });

      it('should return initial array if no Nganh is added', () => {
        const nganhCollection: INganh[] = [{ id: 123 }];
        expectedResult = service.addNganhToCollectionIfMissing(nganhCollection, undefined, null);
        expect(expectedResult).toEqual(nganhCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
