package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.NhomSanPham;
import com.mycompany.myapp.repository.NhomSanPhamRepository;
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
 * REST controller for managing {@link com.mycompany.myapp.domain.NhomSanPham}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class NhomSanPhamResource {

    private final Logger log = LoggerFactory.getLogger(NhomSanPhamResource.class);

    private static final String ENTITY_NAME = "nhomSanPham";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final NhomSanPhamRepository nhomSanPhamRepository;

    public NhomSanPhamResource(NhomSanPhamRepository nhomSanPhamRepository) {
        this.nhomSanPhamRepository = nhomSanPhamRepository;
    }

    /**
     * {@code POST  /nhom-san-phams} : Create a new nhomSanPham.
     *
     * @param nhomSanPham the nhomSanPham to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new nhomSanPham, or with status {@code 400 (Bad Request)} if the nhomSanPham has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/nhom-san-phams")
    public ResponseEntity<NhomSanPham> createNhomSanPham(@RequestBody NhomSanPham nhomSanPham) throws URISyntaxException {
        log.debug("REST request to save NhomSanPham : {}", nhomSanPham);
        if (nhomSanPham.getId() != null) {
            throw new BadRequestAlertException("A new nhomSanPham cannot already have an ID", ENTITY_NAME, "idexists");
        }
        NhomSanPham result = nhomSanPhamRepository.save(nhomSanPham);
        return ResponseEntity
            .created(new URI("/api/nhom-san-phams/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /nhom-san-phams/:id} : Updates an existing nhomSanPham.
     *
     * @param id the id of the nhomSanPham to save.
     * @param nhomSanPham the nhomSanPham to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated nhomSanPham,
     * or with status {@code 400 (Bad Request)} if the nhomSanPham is not valid,
     * or with status {@code 500 (Internal Server Error)} if the nhomSanPham couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/nhom-san-phams/{id}")
    public ResponseEntity<NhomSanPham> updateNhomSanPham(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody NhomSanPham nhomSanPham
    ) throws URISyntaxException {
        log.debug("REST request to update NhomSanPham : {}, {}", id, nhomSanPham);
        if (nhomSanPham.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, nhomSanPham.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!nhomSanPhamRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        NhomSanPham result = nhomSanPhamRepository.save(nhomSanPham);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, nhomSanPham.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /nhom-san-phams/:id} : Partial updates given fields of an existing nhomSanPham, field will ignore if it is null
     *
     * @param id the id of the nhomSanPham to save.
     * @param nhomSanPham the nhomSanPham to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated nhomSanPham,
     * or with status {@code 400 (Bad Request)} if the nhomSanPham is not valid,
     * or with status {@code 404 (Not Found)} if the nhomSanPham is not found,
     * or with status {@code 500 (Internal Server Error)} if the nhomSanPham couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/nhom-san-phams/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<NhomSanPham> partialUpdateNhomSanPham(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody NhomSanPham nhomSanPham
    ) throws URISyntaxException {
        log.debug("REST request to partial update NhomSanPham partially : {}, {}", id, nhomSanPham);
        if (nhomSanPham.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, nhomSanPham.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!nhomSanPhamRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<NhomSanPham> result = nhomSanPhamRepository
            .findById(nhomSanPham.getId())
            .map(existingNhomSanPham -> {
                if (nhomSanPham.getName() != null) {
                    existingNhomSanPham.setName(nhomSanPham.getName());
                }
                if (nhomSanPham.getTimeCreate() != null) {
                    existingNhomSanPham.setTimeCreate(nhomSanPham.getTimeCreate());
                }
                if (nhomSanPham.getTimeUpdate() != null) {
                    existingNhomSanPham.setTimeUpdate(nhomSanPham.getTimeUpdate());
                }
                if (nhomSanPham.getUsername() != null) {
                    existingNhomSanPham.setUsername(nhomSanPham.getUsername());
                }
                if (nhomSanPham.getTrangThai() != null) {
                    existingNhomSanPham.setTrangThai(nhomSanPham.getTrangThai());
                }

                return existingNhomSanPham;
            })
            .map(nhomSanPhamRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, nhomSanPham.getId().toString())
        );
    }

    /**
     * {@code GET  /nhom-san-phams} : get all the nhomSanPhams.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of nhomSanPhams in body.
     */
    @GetMapping("/nhom-san-phams")
    public List<NhomSanPham> getAllNhomSanPhams() {
        log.debug("REST request to get all NhomSanPhams");
        return nhomSanPhamRepository.findAll();
    }

    /**
     * {@code GET  /nhom-san-phams/:id} : get the "id" nhomSanPham.
     *
     * @param id the id of the nhomSanPham to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the nhomSanPham, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/nhom-san-phams/{id}")
    public ResponseEntity<NhomSanPham> getNhomSanPham(@PathVariable Long id) {
        //        log.debug("REST request to get NhomSanPham : {}", id);
        Optional<NhomSanPham> nhomSanPham = nhomSanPhamRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(nhomSanPham);
    }

    /**
     * {@code DELETE  /nhom-san-phams/:id} : delete the "id" nhomSanPham.
     *
     * @param id the id of the nhomSanPham to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/nhom-san-phams/{id}")
    public ResponseEntity<Void> deleteNhomSanPham(@PathVariable Long id) {
        log.debug("REST request to delete NhomSanPham : {}", id);
        nhomSanPhamRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
