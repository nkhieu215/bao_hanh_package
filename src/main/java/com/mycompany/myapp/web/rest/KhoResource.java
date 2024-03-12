package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.Kho;
import com.mycompany.myapp.repository.KhoRepository;
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
 * REST controller for managing {@link com.mycompany.myapp.domain.Kho}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class KhoResource {

    //    private final Logger log = LoggerFactory.getLogger(KhoResource.class);

    private static final String ENTITY_NAME = "kho";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final KhoRepository khoRepository;

    public KhoResource(KhoRepository khoRepository) {
        this.khoRepository = khoRepository;
    }

    /**
     * {@code POST  /khos} : Create a new kho.
     *
     * @param kho the kho to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new kho, or with status {@code 400 (Bad Request)} if the kho has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/khos")
    public ResponseEntity<Kho> createKho(@RequestBody Kho kho) throws URISyntaxException {
        //        log.debug("REST request to save Kho : {}", kho);
        if (kho.getId() != null) {
            throw new BadRequestAlertException("A new kho cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Kho result = khoRepository.save(kho);
        return ResponseEntity
            .created(new URI("/api/khos/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /khos/:id} : Updates an existing kho.
     *
     * @param id the id of the kho to save.
     * @param kho the kho to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated kho,
     * or with status {@code 400 (Bad Request)} if the kho is not valid,
     * or with status {@code 500 (Internal Server Error)} if the kho couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/khos/{id}")
    public ResponseEntity<Kho> updateKho(@PathVariable(value = "id", required = false) final Long id, @RequestBody Kho kho)
        throws URISyntaxException {
        //        log.debug("REST request to update Kho : {}, {}", id, kho);
        if (kho.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, kho.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!khoRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Kho result = khoRepository.save(kho);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, kho.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /khos/:id} : Partial updates given fields of an existing kho, field will ignore if it is null
     *
     * @param id the id of the kho to save.
     * @param kho the kho to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated kho,
     * or with status {@code 400 (Bad Request)} if the kho is not valid,
     * or with status {@code 404 (Not Found)} if the kho is not found,
     * or with status {@code 500 (Internal Server Error)} if the kho couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/khos/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Kho> partialUpdateKho(@PathVariable(value = "id", required = false) final Long id, @RequestBody Kho kho)
        throws URISyntaxException {
        //        log.debug("REST request to partial update Kho partially : {}, {}", id, kho);
        if (kho.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, kho.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!khoRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Kho> result = khoRepository
            .findById(kho.getId())
            .map(existingKho -> {
                if (kho.getMaKho() != null) {
                    existingKho.setMaKho(kho.getMaKho());
                }
                if (kho.getTenKho() != null) {
                    existingKho.setTenKho(kho.getTenKho());
                }
                if (kho.getNgayTao() != null) {
                    existingKho.setNgayTao(kho.getNgayTao());
                }
                if (kho.getUsername() != null) {
                    existingKho.setUsername(kho.getUsername());
                }

                return existingKho;
            })
            .map(khoRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, kho.getId().toString())
        );
    }

    /**
     * {@code GET  /khos} : get all the khos.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of khos in body.
     */
    @GetMapping("/khos")
    public List<Kho> getAllKhos() {
        //        log.debug("REST request to get all Khos");
        return khoRepository.findAll();
    }

    /**
     * {@code GET  /khos/:id} : get the "id" kho.
     *
     * @param id the id of the kho to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the kho, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/khos/{id}")
    public ResponseEntity<Kho> getKho(@PathVariable Long id) {
        //        log.debug("REST request to get Kho : {}", id);
        Optional<Kho> kho = khoRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(kho);
    }

    /**
     * {@code DELETE  /khos/:id} : delete the "id" kho.
     *
     * @param id the id of the kho to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/khos/{id}")
    public ResponseEntity<Void> deleteKho(@PathVariable Long id) {
        //        log.debug("REST request to delete Kho : {}", id);
        khoRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
