package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.Nganh;
import com.mycompany.myapp.repository.NganhRepository;
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
 * REST controller for managing {@link com.mycompany.myapp.domain.Nganh}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class NganhResource {

    //    private final Logger log = LoggerFactory.getLogger(NganhResource.class);

    private static final String ENTITY_NAME = "nganh";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final NganhRepository nganhRepository;

    public NganhResource(NganhRepository nganhRepository) {
        this.nganhRepository = nganhRepository;
    }

    /**
     * {@code POST  /nganhs} : Create a new nganh.
     *
     * @param nganh the nganh to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new nganh, or with status {@code 400 (Bad Request)} if the nganh has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/nganhs")
    public ResponseEntity<Nganh> createNganh(@RequestBody Nganh nganh) throws URISyntaxException {
        //        log.debug("REST request to save Nganh : {}", nganh);
        if (nganh.getId() != null) {
            throw new BadRequestAlertException("A new nganh cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Nganh result = nganhRepository.save(nganh);
        return ResponseEntity
            .created(new URI("/api/nganhs/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /nganhs/:id} : Updates an existing nganh.
     *
     * @param id the id of the nganh to save.
     * @param nganh the nganh to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated nganh,
     * or with status {@code 400 (Bad Request)} if the nganh is not valid,
     * or with status {@code 500 (Internal Server Error)} if the nganh couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/nganhs/{id}")
    public ResponseEntity<Nganh> updateNganh(@PathVariable(value = "id", required = false) final Long id, @RequestBody Nganh nganh)
        throws URISyntaxException {
        //        log.debug("REST request to update Nganh : {}, {}", id, nganh);
        if (nganh.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, nganh.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!nganhRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Nganh result = nganhRepository.save(nganh);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, nganh.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /nganhs/:id} : Partial updates given fields of an existing nganh, field will ignore if it is null
     *
     * @param id the id of the nganh to save.
     * @param nganh the nganh to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated nganh,
     * or with status {@code 400 (Bad Request)} if the nganh is not valid,
     * or with status {@code 404 (Not Found)} if the nganh is not found,
     * or with status {@code 500 (Internal Server Error)} if the nganh couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/nganhs/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Nganh> partialUpdateNganh(@PathVariable(value = "id", required = false) final Long id, @RequestBody Nganh nganh)
        throws URISyntaxException {
        //        log.debug("REST request to partial update Nganh partially : {}, {}", id, nganh);
        if (nganh.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, nganh.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!nganhRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Nganh> result = nganhRepository
            .findById(nganh.getId())
            .map(existingNganh -> {
                if (nganh.getMaNganh() != null) {
                    existingNganh.setMaNganh(nganh.getMaNganh());
                }
                if (nganh.getTenNganh() != null) {
                    existingNganh.setTenNganh(nganh.getTenNganh());
                }
                if (nganh.getNgayTao() != null) {
                    existingNganh.setNgayTao(nganh.getNgayTao());
                }
                if (nganh.getUsername() != null) {
                    existingNganh.setUsername(nganh.getUsername());
                }

                return existingNganh;
            })
            .map(nganhRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, nganh.getId().toString())
        );
    }

    /**
     * {@code GET  /nganhs} : get all the nganhs.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of nganhs in body.
     */
    @GetMapping("/nganhs")
    public List<Nganh> getAllNganhs() {
        //        log.debug("REST request to get all Nganhs");
        return nganhRepository.findAll();
    }

    /**
     * {@code GET  /nganhs/:id} : get the "id" nganh.
     *
     * @param id the id of the nganh to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the nganh, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/nganhs/{id}")
    public ResponseEntity<Nganh> getNganh(@PathVariable Long id) {
        //        log.debug("REST request to get Nganh : {}", id);
        Optional<Nganh> nganh = nganhRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(nganh);
    }

    /**
     * {@code DELETE  /nganhs/:id} : delete the "id" nganh.
     *
     * @param id the id of the nganh to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/nganhs/{id}")
    public ResponseEntity<Void> deleteNganh(@PathVariable Long id) {
        //        log.debug("REST request to delete Nganh : {}", id);
        nganhRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
