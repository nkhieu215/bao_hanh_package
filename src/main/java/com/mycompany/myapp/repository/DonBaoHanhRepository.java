package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.DonBaoHanh;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the DonBaoHanh entity.
 */
@SuppressWarnings("unused")
@Repository
public interface DonBaoHanhRepository extends JpaRepository<DonBaoHanh, Long> {}
