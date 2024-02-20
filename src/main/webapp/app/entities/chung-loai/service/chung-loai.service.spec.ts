import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import dayjs from 'dayjs/esm';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IChungLoai, ChungLoai } from '../chung-loai.model';

import { ChungLoaiService } from './chung-loai.service';

describe('ChungLoai Service', () => {
  let service: ChungLoaiService;
  let httpMock: HttpTestingController;
  let elemDefault: IChungLoai;
  let expectedResult: IChungLoai | IChungLoai[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ChungLoaiService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 0,
      maChungLoai: 'AAAAAAA',
      tenChungLoai: 'AAAAAAA',
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

    it('should create a ChungLoai', () => {
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

      service.create(new ChungLoai()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a ChungLoai', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          maChungLoai: 'BBBBBB',
          tenChungLoai: 'BBBBBB',
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

    it('should partial update a ChungLoai', () => {
      const patchObject = Object.assign(
        {
          ngayTao: currentDate.format(DATE_TIME_FORMAT),
          username: 'BBBBBB',
        },
        new ChungLoai()
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

    it('should return a list of ChungLoai', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          maChungLoai: 'BBBBBB',
          tenChungLoai: 'BBBBBB',
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

    it('should delete a ChungLoai', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addChungLoaiToCollectionIfMissing', () => {
      it('should add a ChungLoai to an empty array', () => {
        const chungLoai: IChungLoai = { id: 123 };
        expectedResult = service.addChungLoaiToCollectionIfMissing([], chungLoai);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(chungLoai);
      });

      it('should not add a ChungLoai to an array that contains it', () => {
        const chungLoai: IChungLoai = { id: 123 };
        const chungLoaiCollection: IChungLoai[] = [
          {
            ...chungLoai,
          },
          { id: 456 },
        ];
        expectedResult = service.addChungLoaiToCollectionIfMissing(chungLoaiCollection, chungLoai);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a ChungLoai to an array that doesn't contain it", () => {
        const chungLoai: IChungLoai = { id: 123 };
        const chungLoaiCollection: IChungLoai[] = [{ id: 456 }];
        expectedResult = service.addChungLoaiToCollectionIfMissing(chungLoaiCollection, chungLoai);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(chungLoai);
      });

      it('should add only unique ChungLoai to an array', () => {
        const chungLoaiArray: IChungLoai[] = [{ id: 123 }, { id: 456 }, { id: 75922 }];
        const chungLoaiCollection: IChungLoai[] = [{ id: 123 }];
        expectedResult = service.addChungLoaiToCollectionIfMissing(chungLoaiCollection, ...chungLoaiArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const chungLoai: IChungLoai = { id: 123 };
        const chungLoai2: IChungLoai = { id: 456 };
        expectedResult = service.addChungLoaiToCollectionIfMissing([], chungLoai, chungLoai2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(chungLoai);
        expect(expectedResult).toContain(chungLoai2);
      });

      it('should accept null and undefined values', () => {
        const chungLoai: IChungLoai = { id: 123 };
        expectedResult = service.addChungLoaiToCollectionIfMissing([], null, chungLoai, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(chungLoai);
      });

      it('should return initial array if no ChungLoai is added', () => {
        const chungLoaiCollection: IChungLoai[] = [{ id: 123 }];
        expectedResult = service.addChungLoaiToCollectionIfMissing(chungLoaiCollection, undefined, null);
        expect(expectedResult).toEqual(chungLoaiCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
