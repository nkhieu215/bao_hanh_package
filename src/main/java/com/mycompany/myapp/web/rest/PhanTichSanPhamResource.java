package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.PhanTichSanPham;
import com.mycompany.myapp.repository.PhanTichSanPhamRepository;
import com.mycompany.myapp.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.mycompany.myapp.domain.PhanTichSanPham}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class PhanTichSanPhamResource {

    //    private final Logger log = LoggerFactory.getLogger(PhanTichSanPhamResource.class);

    private static final String ENTITY_NAME = "phanTichSanPham";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final PhanTichSanPhamRepository phanTichSanPhamRepository;

    public PhanTichSanPhamResource(PhanTichSanPhamRepository phanTichSanPhamRepository) {
        this.phanTichSanPhamRepository = phanTichSanPhamRepository;
    }

    /**
     * {@code POST  /phan-tich-san-phams} : Create a new phanTichSanPham.
     *
     * @param phanTichSanPham the phanTichSanPham to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new phanTichSanPham, or with status {@code 400 (Bad Request)} if the phanTichSanPham has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/phan-tich-san-phams")
    public ResponseEntity<PhanTichSanPham> createPhanTichSanPham(@RequestBody PhanTichSanPham phanTichSanPham) throws URISyntaxException {
        //        log.debug("REST request to save PhanTichSanPham : {}", phanTichSanPham);
        if (phanTichSanPham.getId() != null) {
            throw new BadRequestAlertException("A new phanTichSanPham cannot already have an ID", ENTITY_NAME, "idexists");
        }
        PhanTichSanPham result = phanTichSanPhamRepository.save(phanTichSanPham);
        return ResponseEntity
            .created(new URI("/api/phan-tich-san-phams/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /phan-tich-san-phams/:id} : Updates an existing phanTichSanPham.
     *
     * @param id the id of the phanTichSanPham to save.
     * @param phanTichSanPham the phanTichSanPham to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated phanTichSanPham,
     * or with status {@code 400 (Bad Request)} if the phanTichSanPham is not valid,
     * or with status {@code 500 (Internal Server Error)} if the phanTichSanPham couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/phan-tich-san-phams/{id}")
    public ResponseEntity<PhanTichSanPham> updatePhanTichSanPham(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody PhanTichSanPham phanTichSanPham
    ) throws URISyntaxException {
        //        log.debug("REST request to update PhanTichSanPham : {}, {}", id, phanTichSanPham);
        if (phanTichSanPham.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, phanTichSanPham.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!phanTichSanPhamRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        PhanTichSanPham result = phanTichSanPhamRepository.save(phanTichSanPham);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, phanTichSanPham.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /phan-tich-san-phams/:id} : Partial updates given fields of an existing phanTichSanPham, field will ignore if it is null
     *
     * @param id the id of the phanTichSanPham to save.
     * @param phanTichSanPham the phanTichSanPham to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated phanTichSanPham,
     * or with status {@code 400 (Bad Request)} if the phanTichSanPham is not valid,
     * or with status {@code 404 (Not Found)} if the phanTichSanPham is not found,
     * or with status {@code 500 (Internal Server Error)} if the phanTichSanPham couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/phan-tich-san-phams/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<PhanTichSanPham> partialUpdatePhanTichSanPham(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody PhanTichSanPham phanTichSanPham
    ) throws URISyntaxException {
        //        log.debug("REST request to partial update PhanTichSanPham partially : {}, {}", id, phanTichSanPham);
        if (phanTichSanPham.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, phanTichSanPham.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!phanTichSanPhamRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<PhanTichSanPham> result = phanTichSanPhamRepository
            .findById(phanTichSanPham.getId())
            .map(existingPhanTichSanPham -> {
                if (phanTichSanPham.getTenNhanVienPhanTich() != null) {
                    existingPhanTichSanPham.setTenNhanVienPhanTich(phanTichSanPham.getTenNhanVienPhanTich());
                }
                if (phanTichSanPham.getTheLoaiPhanTich() != null) {
                    existingPhanTichSanPham.setTheLoaiPhanTich(phanTichSanPham.getTheLoaiPhanTich());
                }
                if (phanTichSanPham.getLotNumber() != null) {
                    existingPhanTichSanPham.setLotNumber(phanTichSanPham.getLotNumber());
                }
                if (phanTichSanPham.getDetail() != null) {
                    existingPhanTichSanPham.setDetail(phanTichSanPham.getDetail());
                }
                if (phanTichSanPham.getSoLuong() != null) {
                    existingPhanTichSanPham.setSoLuong(phanTichSanPham.getSoLuong());
                }
                if (phanTichSanPham.getNgayKiemTra() != null) {
                    existingPhanTichSanPham.setNgayKiemTra(phanTichSanPham.getNgayKiemTra());
                }
                if (phanTichSanPham.getUsername() != null) {
                    existingPhanTichSanPham.setUsername(phanTichSanPham.getUsername());
                }
                if (phanTichSanPham.getNamSanXuat() != null) {
                    existingPhanTichSanPham.setNamSanXuat(phanTichSanPham.getNamSanXuat());
                }
                if (phanTichSanPham.getTrangThai() != null) {
                    existingPhanTichSanPham.setTrangThai(phanTichSanPham.getTrangThai());
                }

                return existingPhanTichSanPham;
            })
            .map(phanTichSanPhamRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, phanTichSanPham.getId().toString())
        );
    }

    /**
     * {@code GET  /phan-tich-san-phams} : get all the phanTichSanPhams.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of phanTichSanPhams in body.
     */
    @GetMapping("/phan-tich-san-phams")
    public List<PhanTichSanPham> getAllPhanTichSanPhams() {
        //        log.debug("REST request to get all PhanTichSanPhams");
        return phanTichSanPhamRepository.findAll();
    }

    /**
     * {@code GET  /phan-tich-san-phams/:id} : get the "id" phanTichSanPham.
     *
     * @param id the id of the phanTichSanPham to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the phanTichSanPham, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/phan-tich-san-phams/{id}")
    public ResponseEntity<PhanTichSanPham> getPhanTichSanPham(@PathVariable Long id) {
        //        log.debug("REST request to get PhanTichSanPham : {}", id);
        Optional<PhanTichSanPham> phanTichSanPham = phanTichSanPhamRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(phanTichSanPham);
    }

    /**
     * {@code DELETE  /phan-tich-san-phams/:id} : delete the "id" phanTichSanPham.
     *
     * @param id the id of the phanTichSanPham to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/phan-tich-san-phams/{id}")
    public ResponseEntity<Void> deletePhanTichSanPham(@PathVariable Long id) {
        //        log.debug("REST request to delete PhanTichSanPham : {}", id);
        phanTichSanPhamRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
