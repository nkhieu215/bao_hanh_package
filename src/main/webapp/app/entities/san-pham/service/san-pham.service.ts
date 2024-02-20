import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ISanPham, getSanPhamIdentifier } from '../san-pham.model';

export type EntityResponseType = HttpResponse<ISanPham>;
export type EntityArrayResponseType = HttpResponse<ISanPham[]>;

@Injectable({ providedIn: 'root' })
export class SanPhamService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/san-phams');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(sanPham: ISanPham): Observable<EntityResponseType> {
    return this.http.post<ISanPham>(this.resourceUrl, sanPham, { observe: 'response' });
  }

  update(sanPham: ISanPham): Observable<EntityResponseType> {
    return this.http.put<ISanPham>(`${this.resourceUrl}/${getSanPhamIdentifier(sanPham) as number}`, sanPham, { observe: 'response' });
  }

  partialUpdate(sanPham: ISanPham): Observable<EntityResponseType> {
    return this.http.patch<ISanPham>(`${this.resourceUrl}/${getSanPhamIdentifier(sanPham) as number}`, sanPham, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ISanPham>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ISanPham[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addSanPhamToCollectionIfMissing(sanPhamCollection: ISanPham[], ...sanPhamsToCheck: (ISanPham | null | undefined)[]): ISanPham[] {
    const sanPhams: ISanPham[] = sanPhamsToCheck.filter(isPresent);
    if (sanPhams.length > 0) {
      const sanPhamCollectionIdentifiers = sanPhamCollection.map(sanPhamItem => getSanPhamIdentifier(sanPhamItem)!);
      const sanPhamsToAdd = sanPhams.filter(sanPhamItem => {
        const sanPhamIdentifier = getSanPhamIdentifier(sanPhamItem);
        if (sanPhamIdentifier == null || sanPhamCollectionIdentifiers.includes(sanPhamIdentifier)) {
          return false;
        }
        sanPhamCollectionIdentifiers.push(sanPhamIdentifier);
        return true;
      });
      return [...sanPhamsToAdd, ...sanPhamCollection];
    }
    return sanPhamCollection;
  }
}
