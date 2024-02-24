package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.PhanTichSanPham;
import java.util.List;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the PhanTichSanPham entity.
 */
@SuppressWarnings("unused")
@Repository
public interface PhanTichSanPhamRepository extends JpaRepository<PhanTichSanPham, Long> {
    public List<PhanTichSanPham> findAllByPhanLoaiChiTietTiepNhanId(Long id);
}
