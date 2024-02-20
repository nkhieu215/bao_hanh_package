import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IPhanTichSanPham, getPhanTichSanPhamIdentifier } from '../phan-tich-san-pham.model';

export type EntityResponseType = HttpResponse<IPhanTichSanPham>;
export type EntityArrayResponseType = HttpResponse<IPhanTichSanPham[]>;

@Injectable({ providedIn: 'root' })
export class PhanTichSanPhamService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/phan-tich-san-phams');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(phanTichSanPham: IPhanTichSanPham): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(phanTichSanPham);
    return this.http
      .post<IPhanTichSanPham>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(phanTichSanPham: IPhanTichSanPham): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(phanTichSanPham);
    return this.http
      .put<IPhanTichSanPham>(`${this.resourceUrl}/${getPhanTichSanPhamIdentifier(phanTichSanPham) as number}`, copy, {
        observe: 'response',
      })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(phanTichSanPham: IPhanTichSanPham): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(phanTichSanPham);
    return this.http
      .patch<IPhanTichSanPham>(`${this.resourceUrl}/${getPhanTichSanPhamIdentifier(phanTichSanPham) as number}`, copy, {
        observe: 'response',
      })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IPhanTichSanPham>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IPhanTichSanPham[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addPhanTichSanPhamToCollectionIfMissing(
    phanTichSanPhamCollection: IPhanTichSanPham[],
    ...phanTichSanPhamsToCheck: (IPhanTichSanPham | null | undefined)[]
  ): IPhanTichSanPham[] {
    const phanTichSanPhams: IPhanTichSanPham[] = phanTichSanPhamsToCheck.filter(isPresent);
    if (phanTichSanPhams.length > 0) {
      const phanTichSanPhamCollectionIdentifiers = phanTichSanPhamCollection.map(
        phanTichSanPhamItem => getPhanTichSanPhamIdentifier(phanTichSanPhamItem)!
      );
      const phanTichSanPhamsToAdd = phanTichSanPhams.filter(phanTichSanPhamItem => {
        const phanTichSanPhamIdentifier = getPhanTichSanPhamIdentifier(phanTichSanPhamItem);
        if (phanTichSanPhamIdentifier == null || phanTichSanPhamCollectionIdentifiers.includes(phanTichSanPhamIdentifier)) {
          return false;
        }
        phanTichSanPhamCollectionIdentifiers.push(phanTichSanPhamIdentifier);
        return true;
      });
      return [...phanTichSanPhamsToAdd, ...phanTichSanPhamCollection];
    }
    return phanTichSanPhamCollection;
  }

  protected convertDateFromClient(phanTichSanPham: IPhanTichSanPham): IPhanTichSanPham {
    return Object.assign({}, phanTichSanPham, {
      ngayKiemTra: phanTichSanPham.ngayKiemTra?.isValid() ? phanTichSanPham.ngayKiemTra.toJSON() : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.ngayKiemTra = res.body.ngayKiemTra ? dayjs(res.body.ngayKiemTra) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((phanTichSanPham: IPhanTichSanPham) => {
        phanTichSanPham.ngayKiemTra = phanTichSanPham.ngayKiemTra ? dayjs(phanTichSanPham.ngayKiemTra) : undefined;
      });
    }
    return res;
  }
}
