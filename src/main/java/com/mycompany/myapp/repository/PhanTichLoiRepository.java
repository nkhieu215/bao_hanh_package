package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.PhanTichLoi;
import com.mycompany.myapp.domain.TongHopResponse;
import java.util.List;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the PhanTichLoi entity.
 */
@SuppressWarnings("unused")
@Repository
public interface PhanTichLoiRepository extends JpaRepository<PhanTichLoi, Long> {
    List<PhanTichLoi> findAllByPhanTichSanPhamId(Long id);

    @Query(
        value = "SELECT \n" +
        "\tptLoi.id as loiId,\n" +
        "    phanTichSP.the_loai_phan_tich as theLoaiPhanTich,\n" +
        "    phanTichSP.detail as serial,\n" +
        "    phanTichSP.lot_number as lotNumber,\n" +
        "    phanTichSP.nam_san_xuat as namSanXuat,\n" +
        "    phanTichSP.ngay_kiem_tra as ngayPhanTich,\n" +
        "    phanTichSP.ten_nhan_vien_phan_tich as tenNhanhVienPhanTich,\n" +
        "    chiTietSP.so_luong_khach_hang as soLuongKhachGiao,\n" +
        "    dbh.id as donBaoHanhId,\n" +
        "    loi.chi_chu as tenNhomLoi,\n" +
        "    dbh.ma_tiep_nhan as maTiepNhan,\n" +
        "    khach_hang.ten_khach_hang as tenKhachHang,\n" +
        "    nhomKH.ten_nhom_khach_hang as nhomKhachHang,\n" +
        "    tinh_thanh.name as tinhThanh,\n" +
        "    sanPham.name as tenSanPham,\n" +
        "    phanLoai.so_luong as soLuongTheoTinhTrang,\n" +
        "    danhSachTT.ten_tinh_trang_phan_loai as tenTinhTrangPhanLoai," +
        "    nhomSP.name as tenNhomSanPham,\n" +
        "    nganh.ten_nganh as tenNganh,\n" +
        "    chungLoai.ten_chung_loai as tenChungLoai,\n" +
        "    sum(ptLoi.so_luong) as tongSoLuong \n" +
        "    FROM `phan_tich_loi` as ptLoi\n" +
        "    inner join baohanh2.phan_tich_san_pham as phanTichSP on ptLoi.phan_tich_san_pham_id = phanTichSP.id \n" +
        "    inner join baohanh2.loi as loi on loi.id = ptLoi.loi_id \n" +
        "    inner join baohanh2.phan_loai_chi_tiet_tiep_nhan as phanLoai on phanLoai.id = phanTichSP.phan_loai_chi_tiet_tiep_nhan_id\n" +
        "    inner join baohanh2.danh_sach_tinh_trang as danhSachTT on danhSachTT.id = phanLoai.danh_sach_tinh_trang_id" +
        "    inner join baohanh2.chi_tiet_san_pham_tiep_nhan as chiTietSP on phanLoai.chi_tiet_san_pham_tiep_nhan_id = chiTietSP.id\n" +
        "    inner join baohanh2.don_bao_hanh as dbh on dbh.id = chiTietSP.don_bao_hanh_id\n" +
        "    inner join baohanh2.san_pham as sanPham on sanPham.id = chiTietSP.san_pham_id\n" +
        "    left join baohanh2.nhom_san_pham as nhomSP on nhomSP.id = sanPham.nhom_san_pham_id\n" +
        "    left join baohanh2.chung_loai as chungLoai on nhomSP.chung_loai_id = chungLoai.id\n" +
        "    left join baohanh2.nganh on nganh.id = sanPham.nganh_id\n" +
        "    inner join baohanh2.khach_hang on khach_hang.id = dbh.khach_hang_id\n" +
        "    left join baohanh2.nhom_khach_hang as nhomKH on nhomKH.id = khach_hang.nhom_khach_hang_id\n" +
        "    left join baohanh2.tinh_thanh on tinh_thanh.id = khach_hang.tinh_thanh_id\n" +
        "    where " +
        "    dbh.ngay_tiep_nhan > ?1 " +
        "    and dbh.ngay_tiep_nhan < ?2 " +
        "    group by chiTietSP.id,loi.chi_chu ;",
        nativeQuery = true
    )
    List<TongHopResponse> tongHopCaculate(String startDate, String endDate);

    @Query(
        value = "" +
        "SELECT \n" +
        "\tptLoi.id as loiId,\n" +
        "    phanTichSP.the_loai_phan_tich as theLoaiPhanTich,\n" +
        "    phanTichSP.detail as serial,\n" +
        "    phanTichSP.lot_number as lotNumber,\n" +
        "    phanTichSP.nam_san_xuat as namSanXuat,\n" +
        "    phanTichSP.ngay_kiem_tra as ngayPhanTich,\n" +
        "    phanTichSP.ten_nhan_vien_phan_tich as tenNhanhVienPhanTich,\n" +
        "    chiTietSP.so_luong_khach_hang as soLuongKhachGiao,\n" +
        "    dbh.id as donBaoHanhId,\n" +
        "    loi.err_code as errCode,\n" +
        "    loi.ten_loi as tenLoi,\n" +
        "    loi.chi_chu as tenNhomLoi,\n" +
        "    ptLoi.so_luong as soLuongTheoTungLoi,\n" +
        "    dbh.ma_tiep_nhan as maTiepNhan,\n" +
        "    khach_hang.ten_khach_hang as tenKhachHang,\n" +
        "    nhomKH.ten_nhom_khach_hang as nhomKhachHang,\n" +
        "    tinh_thanh.name as tinhThanh,\n" +
        "      sanPham.name as tenSanPham,\n" +
        "      phanLoai.so_luong as soLuongTheoTinhTrang,\n" +
        "      danhSachTT.ten_tinh_trang_phan_loai as tenTinhTrangPhanLoai,\n" +
        "     nhomSP.name as tenNhomSanPham,\n" +
        "     nganh.ten_nganh as tenNganh,\n" +
        "     chungLoai.ten_chung_loai as tenChungLoai\n" +
        "    FROM baohanh2.phan_tich_loi as ptLoi\n" +
        "    \tinner join baohanh2.phan_tich_san_pham as phanTichSP on ptLoi.phan_tich_san_pham_id = phanTichSP.id \n" +
        "    inner join baohanh2.loi as loi on loi.id = ptLoi.loi_id \n" +
        "    inner join baohanh2.phan_loai_chi_tiet_tiep_nhan as phanLoai on phanLoai.id = phanTichSP.phan_loai_chi_tiet_tiep_nhan_id\n" +
        "    inner join baohanh2.danh_sach_tinh_trang as danhSachTT on danhSachTT.id = phanLoai.danh_sach_tinh_trang_id\n" +
        "    inner join baohanh2.chi_tiet_san_pham_tiep_nhan as chiTietSP on phanLoai.chi_tiet_san_pham_tiep_nhan_id = chiTietSP.id\n" +
        "    inner join baohanh2.don_bao_hanh as dbh on dbh.id = chiTietSP.don_bao_hanh_id\n" +
        "    inner join baohanh2.san_pham as sanPham on sanPham.id = chiTietSP.san_pham_id\n" +
        "    left join baohanh2.nhom_san_pham as nhomSP on nhomSP.id = sanPham.nhom_san_pham_id\n" +
        "    left join baohanh2.chung_loai as chungLoai on nhomSP.chung_loai_id = chungLoai.id\n" +
        "    left join baohanh2.nganh on nganh.id = sanPham.nganh_id\n" +
        "    inner join baohanh2.khach_hang on khach_hang.id = dbh.khach_hang_id\n" +
        "    left join baohanh2.nhom_khach_hang as nhomKH on nhomKH.id = khach_hang.nhom_khach_hang_id\n" +
        "    left join baohanh2.tinh_thanh on tinh_thanh.id = khach_hang.tinh_thanh_id " +
        "            where ptLoi.so_luong > 0 and " +
        "            dbh.ngay_tiep_nhan > ?1  \n" +
        "            and dbh.ngay_tiep_nhan < ?2  ;",
        nativeQuery = true
    )
    List<TongHopResponse> tongHop(String startDate, String endDate);
}
