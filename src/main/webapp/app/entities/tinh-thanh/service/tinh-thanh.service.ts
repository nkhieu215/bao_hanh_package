import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ITinhThanh, getTinhThanhIdentifier } from '../tinh-thanh.model';

export type EntityResponseType = HttpResponse<ITinhThanh>;
export type EntityArrayResponseType = HttpResponse<ITinhThanh[]>;

@Injectable({ providedIn: 'root' })
export class TinhThanhService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/tinh-thanhs');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(tinhThanh: ITinhThanh): Observable<EntityResponseType> {
    return this.http.post<ITinhThanh>(this.resourceUrl, tinhThanh, { observe: 'response' });
  }

  update(tinhThanh: ITinhThanh): Observable<EntityResponseType> {
    return this.http.put<ITinhThanh>(`${this.resourceUrl}/${getTinhThanhIdentifier(tinhThanh) as number}`, tinhThanh, {
      observe: 'response',
    });
  }

  partialUpdate(tinhThanh: ITinhThanh): Observable<EntityResponseType> {
    return this.http.patch<ITinhThanh>(`${this.resourceUrl}/${getTinhThanhIdentifier(tinhThanh) as number}`, tinhThanh, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ITinhThanh>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ITinhThanh[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addTinhThanhToCollectionIfMissing(
    tinhThanhCollection: ITinhThanh[],
    ...tinhThanhsToCheck: (ITinhThanh | null | undefined)[]
  ): ITinhThanh[] {
    const tinhThanhs: ITinhThanh[] = tinhThanhsToCheck.filter(isPresent);
    if (tinhThanhs.length > 0) {
      const tinhThanhCollectionIdentifiers = tinhThanhCollection.map(tinhThanhItem => getTinhThanhIdentifier(tinhThanhItem)!);
      const tinhThanhsToAdd = tinhThanhs.filter(tinhThanhItem => {
        const tinhThanhIdentifier = getTinhThanhIdentifier(tinhThanhItem);
        if (tinhThanhIdentifier == null || tinhThanhCollectionIdentifiers.includes(tinhThanhIdentifier)) {
          return false;
        }
        tinhThanhCollectionIdentifiers.push(tinhThanhIdentifier);
        return true;
      });
      return [...tinhThanhsToAdd, ...tinhThanhCollection];
    }
    return tinhThanhCollection;
  }
}
