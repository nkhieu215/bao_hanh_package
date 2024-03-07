import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ISanPham, SanPham } from '../san-pham.model';

import { SanPhamService } from './san-pham.service';

describe('SanPham Service', () => {
  let service: SanPhamService;
  let httpMock: HttpTestingController;
  let elemDefault: ISanPham;
  let expectedResult: ISanPham | ISanPham[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(SanPhamService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      name: 'AAAAAAA',
      sapCode: 'AAAAAAA',
      rdCode: 'AAAAAAA',
      tenChungLoai: 'AAAAAAA',
      donVi: 'AAAAAAA',
      toSanXuat: 'AAAAAAA',
      phanLoai: 'AAAAAAA',
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

    it('should create a SanPham', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new SanPham()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a SanPham', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          name: 'BBBBBB',
          sapCode: 'BBBBBB',
          rdCode: 'BBBBBB',
          tenChungLoai: 'BBBBBB',
          donVi: 'BBBBBB',
          toSanXuat: 'BBBBBB',
          phanLoai: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a SanPham', () => {
      const patchObject = Object.assign(
        {
          sapCode: 'BBBBBB',
          rdCode: 'BBBBBB',
          tenChungLoai: 'BBBBBB',
          phanLoai: 'BBBBBB',
        },
        new SanPham()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of SanPham', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          name: 'BBBBBB',
          sapCode: 'BBBBBB',
          rdCode: 'BBBBBB',
          tenChungLoai: 'BBBBBB',
          donVi: 'BBBBBB',
          toSanXuat: 'BBBBBB',
          phanLoai: 'BBBBBB',
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

    it('should delete a SanPham', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addSanPhamToCollectionIfMissing', () => {
      it('should add a SanPham to an empty array', () => {
        const sanPham: ISanPham = { id: 123, name: '' };
        expectedResult = service.addSanPhamToCollectionIfMissing([], sanPham);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(sanPham);
      });

      it('should not add a SanPham to an array that contains it', () => {
        const sanPham: ISanPham = { id: 123, name: '' };
        const sanPhamCollection: ISanPham[] = [
          {
            ...sanPham,
          },
          { id: 456, name: '' },
        ];
        expectedResult = service.addSanPhamToCollectionIfMissing(sanPhamCollection, sanPham);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a SanPham to an array that doesn't contain it", () => {
        const sanPham: ISanPham = { id: 123, name: '' };
        const sanPhamCollection: ISanPham[] = [{ id: 456, name: '' }];
        expectedResult = service.addSanPhamToCollectionIfMissing(sanPhamCollection, sanPham);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(sanPham);
      });

      it('should add only unique SanPham to an array', () => {
        const sanPhamArray: ISanPham[] = [
          { id: 123, name: '' },
          { id: 456, name: '' },
          { id: 54043, name: '' },
        ];
        const sanPhamCollection: ISanPham[] = [{ id: 123, name: '' }];
        expectedResult = service.addSanPhamToCollectionIfMissing(sanPhamCollection, ...sanPhamArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const sanPham: ISanPham = { id: 123, name: '' };
        const sanPham2: ISanPham = { id: 456, name: '' };
        expectedResult = service.addSanPhamToCollectionIfMissing([], sanPham, sanPham2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(sanPham);
        expect(expectedResult).toContain(sanPham2);
      });

      it('should accept null and undefined values', () => {
        const sanPham: ISanPham = { id: 123, name: '' };
        expectedResult = service.addSanPhamToCollectionIfMissing([], null, sanPham, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(sanPham);
      });

      it('should return initial array if no SanPham is added', () => {
        const sanPhamCollection: ISanPham[] = [{ id: 123, name: '' }];
        expectedResult = service.addSanPhamToCollectionIfMissing(sanPhamCollection, undefined, null);
        expect(expectedResult).toEqual(sanPhamCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
