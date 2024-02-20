package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.NhomLoi;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the NhomLoi entity.
 */
@SuppressWarnings("unused")
@Repository
public interface NhomLoiRepository extends JpaRepository<NhomLoi, Long> {}
