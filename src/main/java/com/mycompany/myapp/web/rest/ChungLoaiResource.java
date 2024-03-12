package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.ChungLoai;
import com.mycompany.myapp.repository.ChungLoaiRepository;
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
 * REST controller for managing {@link com.mycompany.myapp.domain.ChungLoai}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class ChungLoaiResource {

    //    private final Logger log = LoggerFactory.getLogger(ChungLoaiResource.class);

    private static final String ENTITY_NAME = "chungLoai";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ChungLoaiRepository chungLoaiRepository;

    public ChungLoaiResource(ChungLoaiRepository chungLoaiRepository) {
        this.chungLoaiRepository = chungLoaiRepository;
    }

    /**
     * {@code POST  /chung-loais} : Create a new chungLoai.
     *
     * @param chungLoai the chungLoai to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new chungLoai, or with status {@code 400 (Bad Request)} if the chungLoai has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/chung-loais")
    public ResponseEntity<ChungLoai> createChungLoai(@RequestBody ChungLoai chungLoai) throws URISyntaxException {
        //        log.debug("REST request to save ChungLoai : {}", chungLoai);
        if (chungLoai.getId() != null) {
            throw new BadRequestAlertException("A new chungLoai cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ChungLoai result = chungLoaiRepository.save(chungLoai);
        return ResponseEntity
            .created(new URI("/api/chung-loais/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /chung-loais/:id} : Updates an existing chungLoai.
     *
     * @param id the id of the chungLoai to save.
     * @param chungLoai the chungLoai to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated chungLoai,
     * or with status {@code 400 (Bad Request)} if the chungLoai is not valid,
     * or with status {@code 500 (Internal Server Error)} if the chungLoai couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/chung-loais/{id}")
    public ResponseEntity<ChungLoai> updateChungLoai(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ChungLoai chungLoai
    ) throws URISyntaxException {
        //        log.debug("REST request to update ChungLoai : {}, {}", id, chungLoai);
        if (chungLoai.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, chungLoai.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!chungLoaiRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        ChungLoai result = chungLoaiRepository.save(chungLoai);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, chungLoai.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /chung-loais/:id} : Partial updates given fields of an existing chungLoai, field will ignore if it is null
     *
     * @param id the id of the chungLoai to save.
     * @param chungLoai the chungLoai to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated chungLoai,
     * or with status {@code 400 (Bad Request)} if the chungLoai is not valid,
     * or with status {@code 404 (Not Found)} if the chungLoai is not found,
     * or with status {@code 500 (Internal Server Error)} if the chungLoai couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/chung-loais/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<ChungLoai> partialUpdateChungLoai(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ChungLoai chungLoai
    ) throws URISyntaxException {
        //        log.debug("REST request to partial update ChungLoai partially : {}, {}", id, chungLoai);
        if (chungLoai.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, chungLoai.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!chungLoaiRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<ChungLoai> result = chungLoaiRepository
            .findById(chungLoai.getId())
            .map(existingChungLoai -> {
                if (chungLoai.getMaChungLoai() != null) {
                    existingChungLoai.setMaChungLoai(chungLoai.getMaChungLoai());
                }
                if (chungLoai.getTenChungLoai() != null) {
                    existingChungLoai.setTenChungLoai(chungLoai.getTenChungLoai());
                }
                if (chungLoai.getNgayTao() != null) {
                    existingChungLoai.setNgayTao(chungLoai.getNgayTao());
                }
                if (chungLoai.getUsername() != null) {
                    existingChungLoai.setUsername(chungLoai.getUsername());
                }

                return existingChungLoai;
            })
            .map(chungLoaiRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, chungLoai.getId().toString())
        );
    }

    /**
     * {@code GET  /chung-loais} : get all the chungLoais.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of chungLoais in body.
     */
    @GetMapping("/chung-loais")
    public List<ChungLoai> getAllChungLoais() {
        //        log.debug("REST request to get all ChungLoais");
        return chungLoaiRepository.findAll();
    }

    /**
     * {@code GET  /chung-loais/:id} : get the "id" chungLoai.
     *
     * @param id the id of the chungLoai to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the chungLoai, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/chung-loais/{id}")
    public ResponseEntity<ChungLoai> getChungLoai(@PathVariable Long id) {
        //        log.debug("REST request to get ChungLoai : {}", id);
        Optional<ChungLoai> chungLoai = chungLoaiRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(chungLoai);
    }

    /**
     * {@code DELETE  /chung-loais/:id} : delete the "id" chungLoai.
     *
     * @param id the id of the chungLoai to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/chung-loais/{id}")
    public ResponseEntity<Void> deleteChungLoai(@PathVariable Long id) {
        //        log.debug("REST request to delete ChungLoai : {}", id);
        chungLoaiRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
