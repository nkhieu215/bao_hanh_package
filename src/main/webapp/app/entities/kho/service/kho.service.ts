import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IKho, getKhoIdentifier } from '../kho.model';

export type EntityResponseType = HttpResponse<IKho>;
export type EntityArrayResponseType = HttpResponse<IKho[]>;

@Injectable({ providedIn: 'root' })
export class KhoService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/khos');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(kho: IKho): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(kho);
    return this.http
      .post<IKho>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(kho: IKho): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(kho);
    return this.http
      .put<IKho>(`${this.resourceUrl}/${getKhoIdentifier(kho) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(kho: IKho): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(kho);
    return this.http
      .patch<IKho>(`${this.resourceUrl}/${getKhoIdentifier(kho) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IKho>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IKho[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addKhoToCollectionIfMissing(khoCollection: IKho[], ...khosToCheck: (IKho | null | undefined)[]): IKho[] {
    const khos: IKho[] = khosToCheck.filter(isPresent);
    if (khos.length > 0) {
      const khoCollectionIdentifiers = khoCollection.map(khoItem => getKhoIdentifier(khoItem)!);
      const khosToAdd = khos.filter(khoItem => {
        const khoIdentifier = getKhoIdentifier(khoItem);
        if (khoIdentifier == null || khoCollectionIdentifiers.includes(khoIdentifier)) {
          return false;
        }
        khoCollectionIdentifiers.push(khoIdentifier);
        return true;
      });
      return [...khosToAdd, ...khoCollection];
    }
    return khoCollection;
  }

  protected convertDateFromClient(kho: IKho): IKho {
    return Object.assign({}, kho, {
      ngayTao: kho.ngayTao?.isValid() ? kho.ngayTao.toJSON() : undefined,
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
      res.body.forEach((kho: IKho) => {
        kho.ngayTao = kho.ngayTao ? dayjs(kho.ngayTao) : undefined;
      });
    }
    return res;
  }
}
