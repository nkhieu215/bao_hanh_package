import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import dayjs from 'dayjs/esm';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { ILoi, Loi } from '../loi.model';

import { LoiService } from './loi.service';

describe('Loi Service', () => {
  let service: LoiService;
  let httpMock: HttpTestingController;
  let elemDefault: ILoi;
  let expectedResult: ILoi | ILoi[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(LoiService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 0,
      errCode: 'AAAAAAA',
      tenLoi: 'AAAAAAA',
      ngayTao: currentDate,
      ngayCapNhat: currentDate,
      username: 'AAAAAAA',
      chiChu: 'AAAAAAA',
      trangThai: 'AAAAAAA',
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign(
        {
          ngayTao: currentDate.format(DATE_TIME_FORMAT),
          ngayCapNhat: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a Loi', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
          ngayTao: currentDate.format(DATE_TIME_FORMAT),
          ngayCapNhat: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          ngayTao: currentDate,
          ngayCapNhat: currentDate,
        },
        returnedFromService
      );

      service.create(new Loi()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Loi', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          errCode: 'BBBBBB',
          tenLoi: 'BBBBBB',
          ngayTao: currentDate.format(DATE_TIME_FORMAT),
          ngayCapNhat: currentDate.format(DATE_TIME_FORMAT),
          username: 'BBBBBB',
          chiChu: 'BBBBBB',
          trangThai: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          ngayTao: currentDate,
          ngayCapNhat: currentDate,
        },
        returnedFromService
      );

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Loi', () => {
      const patchObject = Object.assign(
        {
          errCode: 'BBBBBB',
          tenLoi: 'BBBBBB',
          ngayCapNhat: currentDate.format(DATE_TIME_FORMAT),
          chiChu: 'BBBBBB',
        },
        new Loi()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign(
        {
          ngayTao: currentDate,
          ngayCapNhat: currentDate,
        },
        returnedFromService
      );

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Loi', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          errCode: 'BBBBBB',
          tenLoi: 'BBBBBB',
          ngayTao: currentDate.format(DATE_TIME_FORMAT),
          ngayCapNhat: currentDate.format(DATE_TIME_FORMAT),
          username: 'BBBBBB',
          chiChu: 'BBBBBB',
          trangThai: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          ngayTao: currentDate,
          ngayCapNhat: currentDate,
        },
        returnedFromService
      );

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a Loi', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addLoiToCollectionIfMissing', () => {
      it('should add a Loi to an empty array', () => {
        const loi: ILoi = { id: 123 };
        expectedResult = service.addLoiToCollectionIfMissing([], loi);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(loi);
      });

      it('should not add a Loi to an array that contains it', () => {
        const loi: ILoi = { id: 123 };
        const loiCollection: ILoi[] = [
          {
            ...loi,
          },
          { id: 456 },
        ];
        expectedResult = service.addLoiToCollectionIfMissing(loiCollection, loi);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Loi to an array that doesn't contain it", () => {
        const loi: ILoi = { id: 123 };
        const loiCollection: ILoi[] = [{ id: 456 }];
        expectedResult = service.addLoiToCollectionIfMissing(loiCollection, loi);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(loi);
      });

      it('should add only unique Loi to an array', () => {
        const loiArray: ILoi[] = [{ id: 123 }, { id: 456 }, { id: 10250 }];
        const loiCollection: ILoi[] = [{ id: 123 }];
        expectedResult = service.addLoiToCollectionIfMissing(loiCollection, ...loiArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const loi: ILoi = { id: 123 };
        const loi2: ILoi = { id: 456 };
        expectedResult = service.addLoiToCollectionIfMissing([], loi, loi2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(loi);
        expect(expectedResult).toContain(loi2);
      });

      it('should accept null and undefined values', () => {
        const loi: ILoi = { id: 123 };
        expectedResult = service.addLoiToCollectionIfMissing([], null, loi, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(loi);
      });

      it('should return initial array if no Loi is added', () => {
        const loiCollection: ILoi[] = [{ id: 123 }];
        expectedResult = service.addLoiToCollectionIfMissing(loiCollection, undefined, null);
        expect(expectedResult).toEqual(loiCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
