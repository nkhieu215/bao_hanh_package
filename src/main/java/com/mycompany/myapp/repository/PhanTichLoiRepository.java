package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.PhanTichLoi;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the PhanTichLoi entity.
 */
@SuppressWarnings("unused")
@Repository
public interface PhanTichLoiRepository extends JpaRepository<PhanTichLoi, Long> {}
