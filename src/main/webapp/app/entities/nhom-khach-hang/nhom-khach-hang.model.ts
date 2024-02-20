import dayjs from 'dayjs/esm';
import { IKhachHang } from 'app/entities/khach-hang/khach-hang.model';

export interface INhomKhachHang {
  id?: number;
  tenNhomKhachHang?: string | null;
  ngayTao?: dayjs.Dayjs | null;
  ngayCapNhat?: dayjs.Dayjs | null;
  username?: string | null;
  trangThai?: string | null;
  khachHangs?: IKhachHang[] | null;
}

export class NhomKhachHang implements INhomKhachHang {
  constructor(
    public id?: number,
    public tenNhomKhachHang?: string | null,
    public ngayTao?: dayjs.Dayjs | null,
    public ngayCapNhat?: dayjs.Dayjs | null,
    public username?: string | null,
    public trangThai?: string | null,
    public khachHangs?: IKhachHang[] | null
  ) {}
}

export function getNhomKhachHangIdentifier(nhomKhachHang: INhomKhachHang): number | undefined {
  return nhomKhachHang.id;
}
