package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.TinhThanh;
import com.mycompany.myapp.repository.TinhThanhRepository;
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
 * REST controller for managing {@link com.mycompany.myapp.domain.TinhThanh}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class TinhThanhResource {

    //    private final Logger log = LoggerFactory.getLogger(TinhThanhResource.class);

    private static final String ENTITY_NAME = "tinhThanh";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final TinhThanhRepository tinhThanhRepository;

    public TinhThanhResource(TinhThanhRepository tinhThanhRepository) {
        this.tinhThanhRepository = tinhThanhRepository;
    }

    /**
     * {@code POST  /tinh-thanhs} : Create a new tinhThanh.
     *
     * @param tinhThanh the tinhThanh to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new tinhThanh, or with status {@code 400 (Bad Request)} if the tinhThanh has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/tinh-thanhs")
    public ResponseEntity<TinhThanh> createTinhThanh(@RequestBody TinhThanh tinhThanh) throws URISyntaxException {
        //        log.debug("REST request to save TinhThanh : {}", tinhThanh);
        if (tinhThanh.getId() != null) {
            throw new BadRequestAlertException("A new tinhThanh cannot already have an ID", ENTITY_NAME, "idexists");
        }
        TinhThanh result = tinhThanhRepository.save(tinhThanh);
        return ResponseEntity
            .created(new URI("/api/tinh-thanhs/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /tinh-thanhs/:id} : Updates an existing tinhThanh.
     *
     * @param id the id of the tinhThanh to save.
     * @param tinhThanh the tinhThanh to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated tinhThanh,
     * or with status {@code 400 (Bad Request)} if the tinhThanh is not valid,
     * or with status {@code 500 (Internal Server Error)} if the tinhThanh couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/tinh-thanhs/{id}")
    public ResponseEntity<TinhThanh> updateTinhThanh(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody TinhThanh tinhThanh
    ) throws URISyntaxException {
        //        log.debug("REST request to update TinhThanh : {}, {}", id, tinhThanh);
        if (tinhThanh.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, tinhThanh.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!tinhThanhRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        TinhThanh result = tinhThanhRepository.save(tinhThanh);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, tinhThanh.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /tinh-thanhs/:id} : Partial updates given fields of an existing tinhThanh, field will ignore if it is null
     *
     * @param id the id of the tinhThanh to save.
     * @param tinhThanh the tinhThanh to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated tinhThanh,
     * or with status {@code 400 (Bad Request)} if the tinhThanh is not valid,
     * or with status {@code 404 (Not Found)} if the tinhThanh is not found,
     * or with status {@code 500 (Internal Server Error)} if the tinhThanh couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/tinh-thanhs/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<TinhThanh> partialUpdateTinhThanh(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody TinhThanh tinhThanh
    ) throws URISyntaxException {
        //        log.debug("REST request to partial update TinhThanh partially : {}, {}", id, tinhThanh);
        if (tinhThanh.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, tinhThanh.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!tinhThanhRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<TinhThanh> result = tinhThanhRepository
            .findById(tinhThanh.getId())
            .map(existingTinhThanh -> {
                if (tinhThanh.getIdTinhThanh() != null) {
                    existingTinhThanh.setIdTinhThanh(tinhThanh.getIdTinhThanh());
                }
                if (tinhThanh.getName() != null) {
                    existingTinhThanh.setName(tinhThanh.getName());
                }

                return existingTinhThanh;
            })
            .map(tinhThanhRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, tinhThanh.getId().toString())
        );
    }

    /**
     * {@code GET  /tinh-thanhs} : get all the tinhThanhs.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of tinhThanhs in body.
     */
    @GetMapping("/tinh-thanhs")
    public List<TinhThanh> getAllTinhThanhs() {
        //        log.debug("REST request to get all TinhThanhs");
        return tinhThanhRepository.findAll();
    }

    /**
     * {@code GET  /tinh-thanhs/:id} : get the "id" tinhThanh.
     *
     * @param id the id of the tinhThanh to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the tinhThanh, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/tinh-thanhs/{id}")
    public ResponseEntity<TinhThanh> getTinhThanh(@PathVariable Long id) {
        //        log.debug("REST request to get TinhThanh : {}", id);
        Optional<TinhThanh> tinhThanh = tinhThanhRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(tinhThanh);
    }

    /**
     * {@code DELETE  /tinh-thanhs/:id} : delete the "id" tinhThanh.
     *
     * @param id the id of the tinhThanh to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/tinh-thanhs/{id}")
    public ResponseEntity<Void> deleteTinhThanh(@PathVariable Long id) {
        //        log.debug("REST request to delete TinhThanh : {}", id);
        tinhThanhRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
