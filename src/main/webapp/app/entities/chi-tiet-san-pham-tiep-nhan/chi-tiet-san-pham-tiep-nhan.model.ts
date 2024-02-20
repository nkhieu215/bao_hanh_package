import dayjs from 'dayjs/esm';
import { ISanPham } from 'app/entities/san-pham/san-pham.model';
import { IDonBaoHanh } from 'app/entities/don-bao-hanh/don-bao-hanh.model';
import { IPhanLoaiChiTietTiepNhan } from 'app/entities/phan-loai-chi-tiet-tiep-nhan/phan-loai-chi-tiet-tiep-nhan.model';

export interface IChiTietSanPhamTiepNhan {
  id?: number;
  soLuongKhachHang?: number | null;
  idKho?: string | null;
  idBienBan?: string | null;
  tongLoiKiThuat?: number | null;
  tongLoiLinhDong?: number | null;
  ngayPhanLoai?: dayjs.Dayjs | null;
  slTiepNhan?: number | null;
  slTon?: number | null;
  tinhTrangBaoHanh?: string | null;
  trangThaiIn?: string | null;
  sanPham?: ISanPham | null;
  donBaoHanh?: IDonBaoHanh | null;
  phanLoaiChiTietTiepNhans?: IPhanLoaiChiTietTiepNhan[] | null;
}

export class ChiTietSanPhamTiepNhan implements IChiTietSanPhamTiepNhan {
  constructor(
    public id?: number,
    public soLuongKhachHang?: number | null,
    public idKho?: string | null,
    public idBienBan?: string | null,
    public tongLoiKiThuat?: number | null,
    public tongLoiLinhDong?: number | null,
    public ngayPhanLoai?: dayjs.Dayjs | null,
    public slTiepNhan?: number | null,
    public slTon?: number | null,
    public tinhTrangBaoHanh?: string | null,
    public sanPham?: ISanPham | null,
    public donBaoHanh?: IDonBaoHanh | null,
    public phanLoaiChiTietTiepNhans?: IPhanLoaiChiTietTiepNhan[] | null
  ) {}
}

export function getChiTietSanPhamTiepNhanIdentifier(chiTietSanPhamTiepNhan: IChiTietSanPhamTiepNhan): number | undefined {
  return chiTietSanPhamTiepNhan.id;
}
