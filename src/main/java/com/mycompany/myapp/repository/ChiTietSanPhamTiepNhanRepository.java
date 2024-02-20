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
}
