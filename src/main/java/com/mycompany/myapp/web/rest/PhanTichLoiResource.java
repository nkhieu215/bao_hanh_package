package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.PhanTichLoi;
import com.mycompany.myapp.repository.PhanTichLoiRepository;
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
 * REST controller for managing {@link com.mycompany.myapp.domain.PhanTichLoi}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class PhanTichLoiResource {

    //    private final Logger log = LoggerFactory.getLogger(PhanTichLoiResource.class);

    private static final String ENTITY_NAME = "phanTichLoi";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final PhanTichLoiRepository phanTichLoiRepository;

    public PhanTichLoiResource(PhanTichLoiRepository phanTichLoiRepository) {
        this.phanTichLoiRepository = phanTichLoiRepository;
    }

    /**
     * {@code POST  /phan-tich-lois} : Create a new phanTichLoi.
     *
     * @param phanTichLoi the phanTichLoi to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new phanTichLoi, or with status {@code 400 (Bad Request)} if the phanTichLoi has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/phan-tich-lois")
    public ResponseEntity<PhanTichLoi> createPhanTichLoi(@RequestBody PhanTichLoi phanTichLoi) throws URISyntaxException {
        //        log.debug("REST request to save PhanTichLoi : {}", phanTichLoi);
        if (phanTichLoi.getId() != null) {
            throw new BadRequestAlertException("A new phanTichLoi cannot already have an ID", ENTITY_NAME, "idexists");
        }
        PhanTichLoi result = phanTichLoiRepository.save(phanTichLoi);
        return ResponseEntity
            .created(new URI("/api/phan-tich-lois/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /phan-tich-lois/:id} : Updates an existing phanTichLoi.
     *
     * @param id the id of the phanTichLoi to save.
     * @param phanTichLoi the phanTichLoi to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated phanTichLoi,
     * or with status {@code 400 (Bad Request)} if the phanTichLoi is not valid,
     * or with status {@code 500 (Internal Server Error)} if the phanTichLoi couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/phan-tich-lois/{id}")
    public ResponseEntity<PhanTichLoi> updatePhanTichLoi(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody PhanTichLoi phanTichLoi
    ) throws URISyntaxException {
        //        log.debug("REST request to update PhanTichLoi : {}, {}", id, phanTichLoi);
        if (phanTichLoi.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, phanTichLoi.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!phanTichLoiRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        PhanTichLoi result = phanTichLoiRepository.save(phanTichLoi);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, phanTichLoi.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /phan-tich-lois/:id} : Partial updates given fields of an existing phanTichLoi, field will ignore if it is null
     *
     * @param id the id of the phanTichLoi to save.
     * @param phanTichLoi the phanTichLoi to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated phanTichLoi,
     * or with status {@code 400 (Bad Request)} if the phanTichLoi is not valid,
     * or with status {@code 404 (Not Found)} if the phanTichLoi is not found,
     * or with status {@code 500 (Internal Server Error)} if the phanTichLoi couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/phan-tich-lois/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<PhanTichLoi> partialUpdatePhanTichLoi(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody PhanTichLoi phanTichLoi
    ) throws URISyntaxException {
        //        log.debug("REST request to partial update PhanTichLoi partially : {}, {}", id, phanTichLoi);
        if (phanTichLoi.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, phanTichLoi.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!phanTichLoiRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<PhanTichLoi> result = phanTichLoiRepository
            .findById(phanTichLoi.getId())
            .map(existingPhanTichLoi -> {
                if (phanTichLoi.getSoLuong() != null) {
                    existingPhanTichLoi.setSoLuong(phanTichLoi.getSoLuong());
                }
                if (phanTichLoi.getNgayPhanTich() != null) {
                    existingPhanTichLoi.setNgayPhanTich(phanTichLoi.getNgayPhanTich());
                }
                if (phanTichLoi.getUsername() != null) {
                    existingPhanTichLoi.setUsername(phanTichLoi.getUsername());
                }
                if (phanTichLoi.getGhiChu() != null) {
                    existingPhanTichLoi.setGhiChu(phanTichLoi.getGhiChu());
                }

                return existingPhanTichLoi;
            })
            .map(phanTichLoiRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, phanTichLoi.getId().toString())
        );
    }

    /**
     * {@code GET  /phan-tich-lois} : get all the phanTichLois.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of phanTichLois in body.
     */
    @GetMapping("/phan-tich-lois")
    public List<PhanTichLoi> getAllPhanTichLois() {
        //        log.debug("REST request to get all PhanTichLois");
        return phanTichLoiRepository.findAll();
    }

    /**
     * {@code GET  /phan-tich-lois/:id} : get the "id" phanTichLoi.
     *
     * @param id the id of the phanTichLoi to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the phanTichLoi, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/phan-tich-lois/{id}")
    public ResponseEntity<PhanTichLoi> getPhanTichLoi(@PathVariable Long id) {
        //        log.debug("REST request to get PhanTichLoi : {}", id);
        Optional<PhanTichLoi> phanTichLoi = phanTichLoiRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(phanTichLoi);
    }

    /**
     * {@code DELETE  /phan-tich-lois/:id} : delete the "id" phanTichLoi.
     *
     * @param id the id of the phanTichLoi to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/phan-tich-lois/{id}")
    public ResponseEntity<Void> deletePhanTichLoi(@PathVariable Long id) {
        //        log.debug("REST request to delete PhanTichLoi : {}", id);
        phanTichLoiRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
