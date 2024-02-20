import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IChungLoai, getChungLoaiIdentifier } from '../chung-loai.model';

export type EntityResponseType = HttpResponse<IChungLoai>;
export type EntityArrayResponseType = HttpResponse<IChungLoai[]>;

@Injectable({ providedIn: 'root' })
export class ChungLoaiService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/chung-loais');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(chungLoai: IChungLoai): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(chungLoai);
    return this.http
      .post<IChungLoai>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(chungLoai: IChungLoai): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(chungLoai);
    return this.http
      .put<IChungLoai>(`${this.resourceUrl}/${getChungLoaiIdentifier(chungLoai) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(chungLoai: IChungLoai): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(chungLoai);
    return this.http
      .patch<IChungLoai>(`${this.resourceUrl}/${getChungLoaiIdentifier(chungLoai) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IChungLoai>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IChungLoai[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addChungLoaiToCollectionIfMissing(
    chungLoaiCollection: IChungLoai[],
    ...chungLoaisToCheck: (IChungLoai | null | undefined)[]
  ): IChungLoai[] {
    const chungLoais: IChungLoai[] = chungLoaisToCheck.filter(isPresent);
    if (chungLoais.length > 0) {
      const chungLoaiCollectionIdentifiers = chungLoaiCollection.map(chungLoaiItem => getChungLoaiIdentifier(chungLoaiItem)!);
      const chungLoaisToAdd = chungLoais.filter(chungLoaiItem => {
        const chungLoaiIdentifier = getChungLoaiIdentifier(chungLoaiItem);
        if (chungLoaiIdentifier == null || chungLoaiCollectionIdentifiers.includes(chungLoaiIdentifier)) {
          return false;
        }
        chungLoaiCollectionIdentifiers.push(chungLoaiIdentifier);
        return true;
      });
      return [...chungLoaisToAdd, ...chungLoaiCollection];
    }
    return chungLoaiCollection;
  }

  protected convertDateFromClient(chungLoai: IChungLoai): IChungLoai {
    return Object.assign({}, chungLoai, {
      ngayTao: chungLoai.ngayTao?.isValid() ? chungLoai.ngayTao.toJSON() : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.ngayTao = res.body.ngayTao ? dayjs(res.body.ngayTao) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((chungLoai: IChungLoai) => {
        chungLoai.ngayTao = chungLoai.ngayTao ? dayjs(chungLoai.ngayTao) : undefined;
      });
    }
    return res;
  }
}
