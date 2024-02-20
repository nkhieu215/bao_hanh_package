import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IChiTietSanPhamTiepNhan, getChiTietSanPhamTiepNhanIdentifier } from '../chi-tiet-san-pham-tiep-nhan.model';

export type EntityResponseType = HttpResponse<IChiTietSanPhamTiepNhan>;
export type EntityArrayResponseType = HttpResponse<IChiTietSanPhamTiepNhan[]>;

@Injectable({ providedIn: 'root' })
export class ChiTietSanPhamTiepNhanService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/chi-tiet-san-pham-tiep-nhans');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(chiTietSanPhamTiepNhan: IChiTietSanPhamTiepNhan): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(chiTietSanPhamTiepNhan);
    return this.http
      .post<IChiTietSanPhamTiepNhan>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(chiTietSanPhamTiepNhan: IChiTietSanPhamTiepNhan): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(chiTietSanPhamTiepNhan);
    return this.http
      .put<IChiTietSanPhamTiepNhan>(`${this.resourceUrl}/${getChiTietSanPhamTiepNhanIdentifier(chiTietSanPhamTiepNhan) as number}`, copy, {
        observe: 'response',
      })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(chiTietSanPhamTiepNhan: IChiTietSanPhamTiepNhan): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(chiTietSanPhamTiepNhan);
    return this.http
      .patch<IChiTietSanPhamTiepNhan>(
        `${this.resourceUrl}/${getChiTietSanPhamTiepNhanIdentifier(chiTietSanPhamTiepNhan) as number}`,
        copy,
        { observe: 'response' }
      )
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IChiTietSanPhamTiepNhan>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IChiTietSanPhamTiepNhan[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addChiTietSanPhamTiepNhanToCollectionIfMissing(
    chiTietSanPhamTiepNhanCollection: IChiTietSanPhamTiepNhan[],
    ...chiTietSanPhamTiepNhansToCheck: (IChiTietSanPhamTiepNhan | null | undefined)[]
  ): IChiTietSanPhamTiepNhan[] {
    const chiTietSanPhamTiepNhans: IChiTietSanPhamTiepNhan[] = chiTietSanPhamTiepNhansToCheck.filter(isPresent);
    if (chiTietSanPhamTiepNhans.length > 0) {
      const chiTietSanPhamTiepNhanCollectionIdentifiers = chiTietSanPhamTiepNhanCollection.map(
        chiTietSanPhamTiepNhanItem => getChiTietSanPhamTiepNhanIdentifier(chiTietSanPhamTiepNhanItem)!
      );
      const chiTietSanPhamTiepNhansToAdd = chiTietSanPhamTiepNhans.filter(chiTietSanPhamTiepNhanItem => {
        const chiTietSanPhamTiepNhanIdentifier = getChiTietSanPhamTiepNhanIdentifier(chiTietSanPhamTiepNhanItem);
        if (
          chiTietSanPhamTiepNhanIdentifier == null ||
          chiTietSanPhamTiepNhanCollectionIdentifiers.includes(chiTietSanPhamTiepNhanIdentifier)
        ) {
          return false;
        }
        chiTietSanPhamTiepNhanCollectionIdentifiers.push(chiTietSanPhamTiepNhanIdentifier);
        return true;
      });
      return [...chiTietSanPhamTiepNhansToAdd, ...chiTietSanPhamTiepNhanCollection];
    }
    return chiTietSanPhamTiepNhanCollection;
  }

  protected convertDateFromClient(chiTietSanPhamTiepNhan: IChiTietSanPhamTiepNhan): IChiTietSanPhamTiepNhan {
    return Object.assign({}, chiTietSanPhamTiepNhan, {
      ngayPhanLoai: chiTietSanPhamTiepNhan.ngayPhanLoai?.isValid() ? chiTietSanPhamTiepNhan.ngayPhanLoai.toJSON() : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.ngayPhanLoai = res.body.ngayPhanLoai ? dayjs(res.body.ngayPhanLoai) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((chiTietSanPhamTiepNhan: IChiTietSanPhamTiepNhan) => {
        chiTietSanPhamTiepNhan.ngayPhanLoai = chiTietSanPhamTiepNhan.ngayPhanLoai ? dayjs(chiTietSanPhamTiepNhan.ngayPhanLoai) : undefined;
      });
    }
    return res;
  }
}
