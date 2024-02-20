package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Nganh;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Nganh entity.
 */
@SuppressWarnings("unused")
@Repository
public interface NganhRepository extends JpaRepository<Nganh, Long> {}
