package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Loi;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Loi entity.
 */
@SuppressWarnings("unused")
@Repository
public interface LoiRepository extends JpaRepository<Loi, Long> {}
