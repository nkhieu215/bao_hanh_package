package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.DonBaoHanh;
import com.mycompany.myapp.domain.DonBaoHanhResponse;
import java.util.List;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the DonBaoHanh entity.
 */
@SuppressWarnings("unused")
@Repository
public interface DonBaoHanhRepository extends JpaRepository<DonBaoHanh, Long> {
    @Query(
        value = "select * from don_bao_hanh DonBaoHanh where" +
        " trang_thai = N'Chờ phân tích' or trang_thai = N'Đang phân tích' or trang_thai = N'Hoàn thành phân tích'  ",
        nativeQuery = true
    )
    public List<DonBaoHanh> getDonBaoHanhByTrangThais();

    @Query(
        value = "SELECT\n" +
        " dbh.id as id,\n" +
        " dbh.ma_tiep_nhan as maTiepNhan,\n" +
        " dbh.ngay_tiep_nhan as ngayTiepNhan,\n" +
        " dbh.trang_thai as trangThai,\n" +
        " dbh.nhan_vien_giao_hang as nhanVienGiaoHang,\n" +
        " dbh.ngaykhkb as ngaykhkb,\n" +
        " dbh.nguoi_tao_don as nguoiTaoDon,\n" +
        " dbh.sl_tiep_nhan as slTiepNhan,\n" +
        " dbh.sl_da_phan_tich as slDaPhanTich,\n" +
        " dbh.ghi_chu as ghiChu,\n" +
        " dbh.ngay_tra_bien_ban as ngayTraBienBan,\n" +
        " khachHang.ten_khach_hang as tenKhachHang,\n" +
        "count(chiTiet.san_pham_id) as slSanPham,\n" +
        "\t(select count(chi_tiet_san_pham_tiep_nhan.tinh_trang_bao_hanh) \n" +
        "\t\tfrom baohanh2.chi_tiet_san_pham_tiep_nhan \n" +
        "\t\twhere tinh_trang_bao_hanh ='true'\n" +
        "\t\tand don_bao_hanh_id = dbh.id )  as slDaPhanLoai\n" +
        "from `don_bao_hanh` as dbh \n" +
        "\tinner join baohanh2.chi_tiet_san_pham_tiep_nhan as chiTiet on chiTiet.don_bao_hanh_id = dbh.id\n" +
        "\tinner join baohanh2.khach_hang as khachHang on khachHang.id = dbh.khach_hang_id\n" +
        "\tgroup by dbh.id;",
        nativeQuery = true
    )
    public List<DonBaoHanhResponse> tiepNhan();
}
