package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.Loi;
import com.mycompany.myapp.repository.LoiRepository;
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
 * REST controller for managing {@link com.mycompany.myapp.domain.Loi}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class LoiResource {

    //    private final Logger log = LoggerFactory.getLogger(LoiResource.class);

    private static final String ENTITY_NAME = "loi";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final LoiRepository loiRepository;

    public LoiResource(LoiRepository loiRepository) {
        this.loiRepository = loiRepository;
    }

    /**
     * {@code POST  /lois} : Create a new loi.
     *
     * @param loi the loi to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new loi, or with status {@code 400 (Bad Request)} if the loi has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/lois")
    public ResponseEntity<Loi> createLoi(@RequestBody Loi loi) throws URISyntaxException {
        //        log.debug("REST request to save Loi : {}", loi);
        if (loi.getId() != null) {
            throw new BadRequestAlertException("A new loi cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Loi result = loiRepository.save(loi);
        return ResponseEntity
            .created(new URI("/api/lois/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /lois/:id} : Updates an existing loi.
     *
     * @param id the id of the loi to save.
     * @param loi the loi to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated loi,
     * or with status {@code 400 (Bad Request)} if the loi is not valid,
     * or with status {@code 500 (Internal Server Error)} if the loi couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/lois/{id}")
    public ResponseEntity<Loi> updateLoi(@PathVariable(value = "id", required = false) final Long id, @RequestBody Loi loi)
        throws URISyntaxException {
        //        log.debug("REST request to update Loi : {}, {}", id, loi);
        if (loi.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, loi.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!loiRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Loi result = loiRepository.save(loi);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, loi.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /lois/:id} : Partial updates given fields of an existing loi, field will ignore if it is null
     *
     * @param id the id of the loi to save.
     * @param loi the loi to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated loi,
     * or with status {@code 400 (Bad Request)} if the loi is not valid,
     * or with status {@code 404 (Not Found)} if the loi is not found,
     * or with status {@code 500 (Internal Server Error)} if the loi couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/lois/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Loi> partialUpdateLoi(@PathVariable(value = "id", required = false) final Long id, @RequestBody Loi loi)
        throws URISyntaxException {
        //        log.debug("REST request to partial update Loi partially : {}, {}", id, loi);
        if (loi.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, loi.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!loiRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Loi> result = loiRepository
            .findById(loi.getId())
            .map(existingLoi -> {
                if (loi.getErrCode() != null) {
                    existingLoi.setErrCode(loi.getErrCode());
                }
                if (loi.getTenLoi() != null) {
                    existingLoi.setTenLoi(loi.getTenLoi());
                }
                if (loi.getNgayTao() != null) {
                    existingLoi.setNgayTao(loi.getNgayTao());
                }
                if (loi.getNgayCapNhat() != null) {
                    existingLoi.setNgayCapNhat(loi.getNgayCapNhat());
                }
                if (loi.getUsername() != null) {
                    existingLoi.setUsername(loi.getUsername());
                }
                if (loi.getChiChu() != null) {
                    existingLoi.setChiChu(loi.getChiChu());
                }
                if (loi.getTrangThai() != null) {
                    existingLoi.setTrangThai(loi.getTrangThai());
                }

                return existingLoi;
            })
            .map(loiRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, loi.getId().toString())
        );
    }

    /**
     * {@code GET  /lois} : get all the lois.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of lois in body.
     */
    @GetMapping("/lois")
    public List<Loi> getAllLois() {
        //        log.debug("REST request to get all Lois");
        return loiRepository.findAll();
    }

    /**
     * {@code GET  /lois/:id} : get the "id" loi.
     *
     * @param id the id of the loi to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the loi, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/lois/{id}")
    public ResponseEntity<Loi> getLoi(@PathVariable Long id) {
        //        log.debug("REST request to get Loi : {}", id);
        Optional<Loi> loi = loiRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(loi);
    }

    /**
     * {@code DELETE  /lois/:id} : delete the "id" loi.
     *
     * @param id the id of the loi to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/lois/{id}")
    public ResponseEntity<Void> deleteLoi(@PathVariable Long id) {
        //        log.debug("REST request to delete Loi : {}", id);
        loiRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
