package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.NhomKhachHang;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the NhomKhachHang entity.
 */
@SuppressWarnings("unused")
@Repository
public interface NhomKhachHangRepository extends JpaRepository<NhomKhachHang, Long> {}
