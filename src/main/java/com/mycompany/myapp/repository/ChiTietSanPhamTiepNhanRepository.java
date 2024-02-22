package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.ChiTietSanPhamTiepNhan;
import java.util.List;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the ChiTietSanPhamTiepNhan entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ChiTietSanPhamTiepNhanRepository extends JpaRepository<ChiTietSanPhamTiepNhan, Long> {
    public List<ChiTietSanPhamTiepNhan> findAllByDonBaoHanhId(Long id);

    public void deleteByDonBaoHanhId(Long id);

    @Query(
        value = "SELECT * FROM chi_tiet_san_pham_tiep_nhan ChiTietSanPhamTiepNhan" +
        " WHERE id = (SELECT MAX(id) FROM chi_tiet_san_pham_tiep_nhan)",
        nativeQuery = true
    )
    public ChiTietSanPhamTiepNhan getMaxID();
}
