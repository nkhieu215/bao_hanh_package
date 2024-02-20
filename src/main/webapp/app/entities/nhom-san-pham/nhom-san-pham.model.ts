import dayjs from 'dayjs/esm';
import { ISanPham } from 'app/entities/san-pham/san-pham.model';
import { IChungLoai } from 'app/entities/chung-loai/chung-loai.model';

export interface INhomSanPham {
  id?: number;
  name?: string | null;
  timeCreate?: string | null;
  timeUpdate?: dayjs.Dayjs | null;
  username?: string | null;
  trangThai?: string | null;
  sanPhams?: ISanPham[] | null;
  chungLoai?: IChungLoai | null;
}

export class NhomSanPham implements INhomSanPham {
  constructor(
    public id?: number,
    public name?: string | null,
    public timeCreate?: string | null,
    public timeUpdate?: dayjs.Dayjs | null,
    public username?: string | null,
    public trangThai?: string | null,
    public sanPhams?: ISanPham[] | null,
    public chungLoai?: IChungLoai | null
  ) {}
}

export function getNhomSanPhamIdentifier(nhomSanPham: INhomSanPham): number | undefined {
  return nhomSanPham.id;
}
