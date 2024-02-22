import dayjs from 'dayjs/esm';
import { IChiTietSanPhamTiepNhan } from 'app/entities/chi-tiet-san-pham-tiep-nhan/chi-tiet-san-pham-tiep-nhan.model';
import { IKhachHang } from 'app/entities/khach-hang/khach-hang.model';

export interface IDonBaoHanh {
  id?: number;
  maTiepNhan?: string | null;
  ngayTiepNhan?: string | null;
  trangThai?: string | null;
  nhanVienGiaoHang?: string | null;
  ngaykhkb?: Date | null | undefined;
  nguoiTaoDon?: string | null;
  slTiepNhan?: number | null;
  slDaPhanTich?: number | null;
  ghiChu?: string | null;
  ngayTraBienBan?: Date | null | undefined;
  trangThaiIn?: string | null;
  chiTietSanPhamTiepNhans?: IChiTietSanPhamTiepNhan[] | null;
  khachHang?: IKhachHang | null;
}

export class DonBaoHanh implements IDonBaoHanh {
  constructor(
    public id?: number,
    public maTiepNhan?: string | null,
    public ngayTiepNhan?: string | null,
    public trangThai?: string | null,
    public nhanVienGiaoHang?: string | null,
    public ngaykhkb?: Date | null | undefined,
    public nguoiTaoDon?: string | null,
    public slTiepNhan?: number | null,
    public slDaPhanTich?: number | null,
    public ghiChu?: string | null,
    public ngayTraBienBan?: Date | null | undefined,
    public chiTietSanPhamTiepNhans?: IChiTietSanPhamTiepNhan[] | null,
    public khachHang?: IKhachHang | null
  ) {}
}

export function getDonBaoHanhIdentifier(donBaoHanh: IDonBaoHanh): number | undefined {
  return donBaoHanh.id;
}
