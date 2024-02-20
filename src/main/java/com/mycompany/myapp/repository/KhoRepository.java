package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Kho;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Kho entity.
 */
@SuppressWarnings("unused")
@Repository
public interface KhoRepository extends JpaRepository<Kho, Long> {}
