package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.SanPham;
import com.mycompany.myapp.domain.SanPhamResponse;
import java.util.List;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the SanPham entity.
 */
@SuppressWarnings("unused")
@Repository
public interface SanPhamRepository extends JpaRepository<SanPham, Long> {
    @Query(
        value = "SELECT\n" +
        " sp.id as id ,\n" +
        " sp.name as tenSanPham,\n" +
        " sp.sap_code as sapCode,\n" +
        " sp.rd_code as rdCode,\n" +
        " sp.don_vi as donVi,\n" +
        " sp.to_san_xuat as toSanXuat,\n" +
        " sp.phan_loai as phanLoai,\n" +
        " nhomSP.name as tenNhomSanPham,\n" +
        " cl.ten_chung_loai as tenChungLoai,\n" +
        " nganh.ten_nganh as tenNganh,\n" +
        " kho.ten_kho as tenKho\n" +
        "FROM `san_pham` as sp\n" +
        "inner join baohanh2.nhom_san_pham as nhomSP on sp.nhom_san_pham_id = nhomSP.id\n" +
        "inner join baohanh2.chung_loai as cl on nhomSP.chung_loai_id = cl.id\n" +
        "inner join baohanh2.nganh on sp.nganh_id = nganh.id\n" +
        "inner join baohanh2.kho on kho.id = sp.kho_id;",
        nativeQuery = true
    )
    public List<SanPhamResponse> getListSanPham();
}
