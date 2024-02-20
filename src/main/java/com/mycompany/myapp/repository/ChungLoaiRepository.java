package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.ChungLoai;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the ChungLoai entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ChungLoaiRepository extends JpaRepository<ChungLoai, Long> {}
