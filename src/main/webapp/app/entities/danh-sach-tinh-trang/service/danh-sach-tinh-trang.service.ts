import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IDanhSachTinhTrang, getDanhSachTinhTrangIdentifier } from '../danh-sach-tinh-trang.model';

export type EntityResponseType = HttpResponse<IDanhSachTinhTrang>;
export type EntityArrayResponseType = HttpResponse<IDanhSachTinhTrang[]>;

@Injectable({ providedIn: 'root' })
export class DanhSachTinhTrangService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/danh-sach-tinh-trangs');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(danhSachTinhTrang: IDanhSachTinhTrang): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(danhSachTinhTrang);
    return this.http
      .post<IDanhSachTinhTrang>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(danhSachTinhTrang: IDanhSachTinhTrang): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(danhSachTinhTrang);
    return this.http
      .put<IDanhSachTinhTrang>(`${this.resourceUrl}/${getDanhSachTinhTrangIdentifier(danhSachTinhTrang) as number}`, copy, {
        observe: 'response',
      })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(danhSachTinhTrang: IDanhSachTinhTrang): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(danhSachTinhTrang);
    return this.http
      .patch<IDanhSachTinhTrang>(`${this.resourceUrl}/${getDanhSachTinhTrangIdentifier(danhSachTinhTrang) as number}`, copy, {
        observe: 'response',
      })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IDanhSachTinhTrang>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IDanhSachTinhTrang[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addDanhSachTinhTrangToCollectionIfMissing(
    danhSachTinhTrangCollection: IDanhSachTinhTrang[],
    ...danhSachTinhTrangsToCheck: (IDanhSachTinhTrang | null | undefined)[]
  ): IDanhSachTinhTrang[] {
    const danhSachTinhTrangs: IDanhSachTinhTrang[] = danhSachTinhTrangsToCheck.filter(isPresent);
    if (danhSachTinhTrangs.length > 0) {
      const danhSachTinhTrangCollectionIdentifiers = danhSachTinhTrangCollection.map(
        danhSachTinhTrangItem => getDanhSachTinhTrangIdentifier(danhSachTinhTrangItem)!
      );
      const danhSachTinhTrangsToAdd = danhSachTinhTrangs.filter(danhSachTinhTrangItem => {
        const danhSachTinhTrangIdentifier = getDanhSachTinhTrangIdentifier(danhSachTinhTrangItem);
        if (danhSachTinhTrangIdentifier == null || danhSachTinhTrangCollectionIdentifiers.includes(danhSachTinhTrangIdentifier)) {
          return false;
        }
        danhSachTinhTrangCollectionIdentifiers.push(danhSachTinhTrangIdentifier);
        return true;
      });
      return [...danhSachTinhTrangsToAdd, ...danhSachTinhTrangCollection];
    }
    return danhSachTinhTrangCollection;
  }

  protected convertDateFromClient(danhSachTinhTrang: IDanhSachTinhTrang): IDanhSachTinhTrang {
    return Object.assign({}, danhSachTinhTrang, {
      ngayTao: danhSachTinhTrang.ngayTao?.isValid() ? danhSachTinhTrang.ngayTao.toJSON() : undefined,
      ngayCapNhat: danhSachTinhTrang.ngayCapNhat?.isValid() ? danhSachTinhTrang.ngayCapNhat.toJSON() : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.ngayTao = res.body.ngayTao ? dayjs(res.body.ngayTao) : undefined;
      res.body.ngayCapNhat = res.body.ngayCapNhat ? dayjs(res.body.ngayCapNhat) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((danhSachTinhTrang: IDanhSachTinhTrang) => {
        danhSachTinhTrang.ngayTao = danhSachTinhTrang.ngayTao ? dayjs(danhSachTinhTrang.ngayTao) : undefined;
        danhSachTinhTrang.ngayCapNhat = danhSachTinhTrang.ngayCapNhat ? dayjs(danhSachTinhTrang.ngayCapNhat) : undefined;
      });
    }
    return res;
  }
}
