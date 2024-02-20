package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.NhomSanPham;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the NhomSanPham entity.
 */
@SuppressWarnings("unused")
@Repository
public interface NhomSanPhamRepository extends JpaRepository<NhomSanPham, Long> {}
