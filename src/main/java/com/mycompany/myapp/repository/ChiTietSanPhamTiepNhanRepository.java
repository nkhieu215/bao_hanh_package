package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.ChiTietSanPhamTiepNhan;
import com.mycompany.myapp.domain.TongHopResponse;
import java.time.LocalDate;
import java.util.List;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the ChiTietSanPhamTiepNhan entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ChiTietSanPhamTiepNhanRepository extends JpaRepository<ChiTietSanPhamTiepNhan, Long> {
    List<ChiTietSanPhamTiepNhan> findAllByDonBaoHanhId(Long id);

    void deleteByDonBaoHanhId(Long id);

    @Query(
        value = "SELECT * FROM chi_tiet_san_pham_tiep_nhan ChiTietSanPhamTiepNhan" +
        " WHERE id = (SELECT MAX(id) FROM chi_tiet_san_pham_tiep_nhan)",
        nativeQuery = true
    )
    ChiTietSanPhamTiepNhan getMaxID();

    @Query(
        value = "SELECT " +
        "a.id as chiTietId, " +
        "a.san_pham_id as sanPhamId," +
        "a.so_luong_khach_hang as soLuongKhachGiao," +
        "a.don_bao_hanh_id as donBaoHanhId,\n" +
        "b.name as tenSanPham, " +
        "b.ten_chung_loai as tenChungLoai, \n" +
        "c.name as tenNhomSanPham,\n" +
        "d.ten_nganh as tenNganh,\n" +
        "e.ma_tiep_nhan as maTiepNhan," +
        "e.ngay_tiep_nhan as ngayTiepNhan," +
        "e.nhan_vien_giao_hang as nhanVienGiaoHang," +
        "e.sl_tiep_nhan as slTiepNhan,\n" +
        "f.ten_khach_hang as tenKhachHang,\n" +
        "nhomKH.ten_nhom_khach_hang as nhomKhachHang,\n" +
        "tt.name as tinhThanh,\n" +
        "plcttn.so_luong as soLuongTheoTinhTrang," +
        "dstt.ten_tinh_trang_phan_loai as tenTinhTrangPhanLoai,\n" +
        "ptsp.the_loai_phan_tich as theLoaiPhanTich," +
        "ptsp.nam_san_xuat as namSanXuat,\n " +
        "ptsp.ten_nhan_vien_phan_tich as tenNhanVienPhanTich," +
        "ptsp.lot_number as lotNumber," +
        "ptsp.detail as serial,\n" +
        "ptl.ngay_phan_tich as ngayPhanTich," +
        "ptl.so_luong as soLuongTheoTungLoi,\n" +
        "loi.ten_loi as tenLoi," +
        "loi.chi_chu as tenNhomLoi " +
        "FROM `chi_tiet_san_pham_tiep_nhan` as a inner join baohanh2.san_pham as b on a.san_pham_id = b.id\n" +
        "                                               inner join baohanh2.nhom_san_pham as c on b.nhom_san_pham_id = c.id \n" +
        "                                               inner join baohanh2.nganh as d on b.nganh_id = d.id\n" +
        "                                               inner join baohanh2.don_bao_hanh as e on a.don_bao_hanh_id = e.id\n" +
        "                                               inner join baohanh2.khach_hang as f on e.khach_hang_id = f.id\n" +
        "                                               inner join baohanh2.nhom_khach_hang as nhomKH on nhomKH.id = f.nhom_khach_hang_id\n" +
        "                                               inner join baohanh2.tinh_thanh as tt on tt.id = f.tinh_thanh_id\n" +
        "                                               inner join baohanh2.phan_loai_chi_tiet_tiep_nhan as plcttn on plcttn.chi_tiet_san_pham_tiep_nhan_id = a.id\n" +
        "                                               inner join baohanh2.danh_sach_tinh_trang as dstt on dstt.id = plcttn.danh_sach_tinh_trang_id\n" +
        "                                               inner join baohanh2.phan_tich_san_pham as ptsp on ptsp.phan_loai_chi_tiet_tiep_nhan_id = dstt.id " +
        "                                               inner join baohanh2.phan_tich_loi as ptl on ptl.phan_tich_san_pham_id = ptsp.id\n" +
        "                                               inner join baohanh2.loi as loi on ptl.loi_id = loi.id " +
        "                                               where " +
        "                                               ptl.so_luong > 0 " +
        "                                               and plcttn.so_luong > 0" +
        "                                               and e.ngay_tiep_nhan > ?1 and e.ngay_tiep_nhan < ?2 ;",
        nativeQuery = true
    )
    List<TongHopResponse> tongHop(String startDate, String endDate);
}
