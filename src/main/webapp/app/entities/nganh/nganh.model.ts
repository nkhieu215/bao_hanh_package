import dayjs from 'dayjs/esm';
import { ISanPham } from 'app/entities/san-pham/san-pham.model';

export interface INganh {
  id?: number;
  maNganh?: string | null;
  tenNganh?: string | null;
  ngayTao?: dayjs.Dayjs | null;
  username?: string | null;
  sanPhams?: ISanPham[] | null;
}

export class Nganh implements INganh {
  constructor(
    public id?: number,
    public maNganh?: string | null,
    public tenNganh?: string | null,
    public ngayTao?: dayjs.Dayjs | null,
    public username?: string | null,
    public sanPhams?: ISanPham[] | null
  ) {}
}

export function getNganhIdentifier(nganh: INganh): number | undefined {
  return nganh.id;
}
