import dayjs from 'dayjs/esm';
import { ISanPham } from 'app/entities/san-pham/san-pham.model';

export interface IKho {
  id?: number;
  maKho?: string | null;
  tenKho?: string | null;
  ngayTao?: dayjs.Dayjs | null;
  username?: string | null;
  sanPhams?: ISanPham[] | null;
}

export class Kho implements IKho {
  constructor(
    public id?: number,
    public maKho?: string | null,
    public tenKho?: string | null,
    public ngayTao?: dayjs.Dayjs | null,
    public username?: string | null,
    public sanPhams?: ISanPham[] | null
  ) {}
}

export function getKhoIdentifier(kho: IKho): number | undefined {
  return kho.id;
}
