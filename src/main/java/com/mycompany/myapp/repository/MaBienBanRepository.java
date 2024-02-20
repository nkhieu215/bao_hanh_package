package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.MaBienBan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MaBienBanRepository extends JpaRepository<MaBienBan, Long> {}
