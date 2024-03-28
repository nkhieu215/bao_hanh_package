package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.DonBaoHanh;
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
        value = "select * from don_bao_hanh DonBaoHanh where" + " trang_thai = N'Chờ phân tích' or trang_thai = N'Đang phân tích' or trang_thai = N'Hoàn thành phân tích'  ",
        nativeQuery = true
    )
    public List<DonBaoHanh> getDonBaoHanhByTrangThais();
}
