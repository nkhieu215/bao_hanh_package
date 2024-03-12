package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.SanPham;
import com.mycompany.myapp.repository.SanPhamRepository;
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
 * REST controller for managing {@link com.mycompany.myapp.domain.SanPham}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class SanPhamResource {

    //    private final Logger log = LoggerFactory.getLogger(SanPhamResource.class);

    private static final String ENTITY_NAME = "sanPham";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final SanPhamRepository sanPhamRepository;

    public SanPhamResource(SanPhamRepository sanPhamRepository) {
        this.sanPhamRepository = sanPhamRepository;
    }

    /**
     * {@code POST  /san-phams} : Create a new sanPham.
     *
     * @param sanPham the sanPham to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new sanPham, or with status {@code 400 (Bad Request)} if the sanPham has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/san-phams")
    public ResponseEntity<SanPham> createSanPham(@RequestBody SanPham sanPham) throws URISyntaxException {
        //        log.debug("REST request to save SanPham : {}", sanPham);
        if (sanPham.getId() != null) {
            throw new BadRequestAlertException("A new sanPham cannot already have an ID", ENTITY_NAME, "idexists");
        }
        SanPham result = sanPhamRepository.save(sanPham);
        return ResponseEntity
            .created(new URI("/api/san-phams/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /san-phams/:id} : Updates an existing sanPham.
     *
     * @param id the id of the sanPham to save.
     * @param sanPham the sanPham to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated sanPham,
     * or with status {@code 400 (Bad Request)} if the sanPham is not valid,
     * or with status {@code 500 (Internal Server Error)} if the sanPham couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/san-phams/{id}")
    public ResponseEntity<SanPham> updateSanPham(@PathVariable(value = "id", required = false) final Long id, @RequestBody SanPham sanPham)
        throws URISyntaxException {
        //        log.debug("REST request to update SanPham : {}, {}", id, sanPham);
        if (sanPham.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, sanPham.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!sanPhamRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        SanPham result = sanPhamRepository.save(sanPham);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, sanPham.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /san-phams/:id} : Partial updates given fields of an existing sanPham, field will ignore if it is null
     *
     * @param id the id of the sanPham to save.
     * @param sanPham the sanPham to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated sanPham,
     * or with status {@code 400 (Bad Request)} if the sanPham is not valid,
     * or with status {@code 404 (Not Found)} if the sanPham is not found,
     * or with status {@code 500 (Internal Server Error)} if the sanPham couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/san-phams/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<SanPham> partialUpdateSanPham(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody SanPham sanPham
    ) throws URISyntaxException {
        //        log.debug("REST request to partial update SanPham partially : {}, {}", id, sanPham);
        if (sanPham.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, sanPham.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!sanPhamRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<SanPham> result = sanPhamRepository
            .findById(sanPham.getId())
            .map(existingSanPham -> {
                if (sanPham.getName() != null) {
                    existingSanPham.setName(sanPham.getName());
                }
                if (sanPham.getSapCode() != null) {
                    existingSanPham.setSapCode(sanPham.getSapCode());
                }
                if (sanPham.getRdCode() != null) {
                    existingSanPham.setRdCode(sanPham.getRdCode());
                }
                if (sanPham.getTenChungLoai() != null) {
                    existingSanPham.setTenChungLoai(sanPham.getTenChungLoai());
                }
                if (sanPham.getDonVi() != null) {
                    existingSanPham.setDonVi(sanPham.getDonVi());
                }
                if (sanPham.getToSanXuat() != null) {
                    existingSanPham.setToSanXuat(sanPham.getToSanXuat());
                }
                if (sanPham.getPhanLoai() != null) {
                    existingSanPham.setPhanLoai(sanPham.getPhanLoai());
                }

                return existingSanPham;
            })
            .map(sanPhamRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, sanPham.getId().toString())
        );
    }

    /**
     * {@code GET  /san-phams} : get all the sanPhams.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of sanPhams in body.
     */
    @GetMapping("/san-phams")
    public List<SanPham> getAllSanPhams() {
        //        log.debug("REST request to get all SanPhams");
        return sanPhamRepository.findAll();
    }

    /**
     * {@code GET  /san-phams/:id} : get the "id" sanPham.
     *
     * @param id the id of the sanPham to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the sanPham, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/san-phams/{id}")
    public ResponseEntity<SanPham> getSanPham(@PathVariable Long id) {
        //        log.debug("REST request to get SanPham : {}", id);
        Optional<SanPham> sanPham = sanPhamRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(sanPham);
    }

    /**
     * {@code DELETE  /san-phams/:id} : delete the "id" sanPham.
     *
     * @param id the id of the sanPham to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/san-phams/{id}")
    public ResponseEntity<Void> deleteSanPham(@PathVariable Long id) {
        //        log.debug("REST request to delete SanPham : {}", id);
        sanPhamRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
