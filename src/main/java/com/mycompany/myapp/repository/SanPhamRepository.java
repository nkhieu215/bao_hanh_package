package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.SanPham;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the SanPham entity.
 */
@SuppressWarnings("unused")
@Repository
public interface SanPhamRepository extends JpaRepository<SanPham, Long> {}
