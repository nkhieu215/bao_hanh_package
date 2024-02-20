package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.PhanLoaiChiTietTiepNhan;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the PhanLoaiChiTietTiepNhan entity.
 */
@SuppressWarnings("unused")
@Repository
public interface PhanLoaiChiTietTiepNhanRepository extends JpaRepository<PhanLoaiChiTietTiepNhan, Long> {
    public void deleteByChiTietSanPhamTiepNhanId(Long id);
}
