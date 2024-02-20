import dayjs from 'dayjs/esm';
import { IPhanLoaiChiTietTiepNhan } from 'app/entities/phan-loai-chi-tiet-tiep-nhan/phan-loai-chi-tiet-tiep-nhan.model';

export interface IDanhSachTinhTrang {
  id?: number;
  tenTinhTrangPhanLoai?: string | null;
  ngayTao?: dayjs.Dayjs | null;
  ngayCapNhat?: dayjs.Dayjs | null;
  username?: string | null;
  trangThai?: string | null;
  phanLoaiChiTietTiepNhans?: IPhanLoaiChiTietTiepNhan[] | null;
}

export class DanhSachTinhTrang implements IDanhSachTinhTrang {
  constructor(
    public id?: number,
    public tenTinhTrangPhanLoai?: string | null,
    public ngayTao?: dayjs.Dayjs | null,
    public ngayCapNhat?: dayjs.Dayjs | null,
    public username?: string | null,
    public trangThai?: string | null,
    public phanLoaiChiTietTiepNhans?: IPhanLoaiChiTietTiepNhan[] | null
  ) {}
}

export function getDanhSachTinhTrangIdentifier(danhSachTinhTrang: IDanhSachTinhTrang): number | undefined {
  return danhSachTinhTrang.id;
}
