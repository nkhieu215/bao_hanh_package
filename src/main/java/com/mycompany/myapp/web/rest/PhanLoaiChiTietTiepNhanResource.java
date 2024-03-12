package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.PhanLoaiChiTietTiepNhan;
import com.mycompany.myapp.repository.PhanLoaiChiTietTiepNhanRepository;
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
 * REST controller for managing {@link com.mycompany.myapp.domain.PhanLoaiChiTietTiepNhan}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class PhanLoaiChiTietTiepNhanResource {

    //    private final Logger log = LoggerFactory.getLogger(PhanLoaiChiTietTiepNhanResource.class);

    private static final String ENTITY_NAME = "phanLoaiChiTietTiepNhan";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final PhanLoaiChiTietTiepNhanRepository phanLoaiChiTietTiepNhanRepository;

    public PhanLoaiChiTietTiepNhanResource(PhanLoaiChiTietTiepNhanRepository phanLoaiChiTietTiepNhanRepository) {
        this.phanLoaiChiTietTiepNhanRepository = phanLoaiChiTietTiepNhanRepository;
    }

    /**
     * {@code POST  /phan-loai-chi-tiet-tiep-nhans} : Create a new phanLoaiChiTietTiepNhan.
     *
     * @param phanLoaiChiTietTiepNhan the phanLoaiChiTietTiepNhan to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new phanLoaiChiTietTiepNhan, or with status {@code 400 (Bad Request)} if the phanLoaiChiTietTiepNhan has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/phan-loai-chi-tiet-tiep-nhans")
    public ResponseEntity<PhanLoaiChiTietTiepNhan> createPhanLoaiChiTietTiepNhan(
        @RequestBody PhanLoaiChiTietTiepNhan phanLoaiChiTietTiepNhan
    ) throws URISyntaxException {
        //        log.debug("REST request to save PhanLoaiChiTietTiepNhan : {}", phanLoaiChiTietTiepNhan);
        if (phanLoaiChiTietTiepNhan.getId() != null) {
            throw new BadRequestAlertException("A new phanLoaiChiTietTiepNhan cannot already have an ID", ENTITY_NAME, "idexists");
        }
        PhanLoaiChiTietTiepNhan result = phanLoaiChiTietTiepNhanRepository.save(phanLoaiChiTietTiepNhan);
        return ResponseEntity
            .created(new URI("/api/phan-loai-chi-tiet-tiep-nhans/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /phan-loai-chi-tiet-tiep-nhans/:id} : Updates an existing phanLoaiChiTietTiepNhan.
     *
     * @param id the id of the phanLoaiChiTietTiepNhan to save.
     * @param phanLoaiChiTietTiepNhan the phanLoaiChiTietTiepNhan to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated phanLoaiChiTietTiepNhan,
     * or with status {@code 400 (Bad Request)} if the phanLoaiChiTietTiepNhan is not valid,
     * or with status {@code 500 (Internal Server Error)} if the phanLoaiChiTietTiepNhan couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/phan-loai-chi-tiet-tiep-nhans/{id}")
    public ResponseEntity<PhanLoaiChiTietTiepNhan> updatePhanLoaiChiTietTiepNhan(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody PhanLoaiChiTietTiepNhan phanLoaiChiTietTiepNhan
    ) throws URISyntaxException {
        //        log.debug("REST request to update PhanLoaiChiTietTiepNhan : {}, {}", id, phanLoaiChiTietTiepNhan);
        if (phanLoaiChiTietTiepNhan.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, phanLoaiChiTietTiepNhan.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!phanLoaiChiTietTiepNhanRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        PhanLoaiChiTietTiepNhan result = phanLoaiChiTietTiepNhanRepository.save(phanLoaiChiTietTiepNhan);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, phanLoaiChiTietTiepNhan.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /phan-loai-chi-tiet-tiep-nhans/:id} : Partial updates given fields of an existing phanLoaiChiTietTiepNhan, field will ignore if it is null
     *
     * @param id the id of the phanLoaiChiTietTiepNhan to save.
     * @param phanLoaiChiTietTiepNhan the phanLoaiChiTietTiepNhan to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated phanLoaiChiTietTiepNhan,
     * or with status {@code 400 (Bad Request)} if the phanLoaiChiTietTiepNhan is not valid,
     * or with status {@code 404 (Not Found)} if the phanLoaiChiTietTiepNhan is not found,
     * or with status {@code 500 (Internal Server Error)} if the phanLoaiChiTietTiepNhan couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/phan-loai-chi-tiet-tiep-nhans/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<PhanLoaiChiTietTiepNhan> partialUpdatePhanLoaiChiTietTiepNhan(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody PhanLoaiChiTietTiepNhan phanLoaiChiTietTiepNhan
    ) throws URISyntaxException {
        //        log.debug("REST request to partial update PhanLoaiChiTietTiepNhan partially : {}, {}", id, phanLoaiChiTietTiepNhan);
        if (phanLoaiChiTietTiepNhan.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, phanLoaiChiTietTiepNhan.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!phanLoaiChiTietTiepNhanRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<PhanLoaiChiTietTiepNhan> result = phanLoaiChiTietTiepNhanRepository
            .findById(phanLoaiChiTietTiepNhan.getId())
            .map(existingPhanLoaiChiTietTiepNhan -> {
                if (phanLoaiChiTietTiepNhan.getSoLuong() != null) {
                    existingPhanLoaiChiTietTiepNhan.setSoLuong(phanLoaiChiTietTiepNhan.getSoLuong());
                }

                return existingPhanLoaiChiTietTiepNhan;
            })
            .map(phanLoaiChiTietTiepNhanRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, phanLoaiChiTietTiepNhan.getId().toString())
        );
    }

    /**
     * {@code GET  /phan-loai-chi-tiet-tiep-nhans} : get all the phanLoaiChiTietTiepNhans.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of phanLoaiChiTietTiepNhans in body.
     */
    @GetMapping("/phan-loai-chi-tiet-tiep-nhans")
    public List<PhanLoaiChiTietTiepNhan> getAllPhanLoaiChiTietTiepNhans() {
        //        log.debug("REST request to get all PhanLoaiChiTietTiepNhans");
        return phanLoaiChiTietTiepNhanRepository.findAll();
    }

    /**
     * {@code GET  /phan-loai-chi-tiet-tiep-nhans/:id} : get the "id" phanLoaiChiTietTiepNhan.
     *
     * @param id the id of the phanLoaiChiTietTiepNhan to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the phanLoaiChiTietTiepNhan, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/phan-loai-chi-tiet-tiep-nhans/{id}")
    public ResponseEntity<PhanLoaiChiTietTiepNhan> getPhanLoaiChiTietTiepNhan(@PathVariable Long id) {
        //        log.debug("REST request to get PhanLoaiChiTietTiepNhan : {}", id);
        Optional<PhanLoaiChiTietTiepNhan> phanLoaiChiTietTiepNhan = phanLoaiChiTietTiepNhanRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(phanLoaiChiTietTiepNhan);
    }

    /**
     * {@code DELETE  /phan-loai-chi-tiet-tiep-nhans/:id} : delete the "id" phanLoaiChiTietTiepNhan.
     *
     * @param id the id of the phanLoaiChiTietTiepNhan to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/phan-loai-chi-tiet-tiep-nhans/{id}")
    public ResponseEntity<Void> deletePhanLoaiChiTietTiepNhan(@PathVariable Long id) {
        //        log.debug("REST request to delete PhanLoaiChiTietTiepNhan : {}", id);
        phanLoaiChiTietTiepNhanRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
