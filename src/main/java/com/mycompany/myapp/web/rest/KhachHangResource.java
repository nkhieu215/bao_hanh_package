package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.KhachHang;
import com.mycompany.myapp.repository.KhachHangRepository;
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
 * REST controller for managing {@link com.mycompany.myapp.domain.KhachHang}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class KhachHangResource {

    //    private final Logger log = LoggerFactory.getLogger(KhachHangResource.class);

    private static final String ENTITY_NAME = "khachHang";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final KhachHangRepository khachHangRepository;

    public KhachHangResource(KhachHangRepository khachHangRepository) {
        this.khachHangRepository = khachHangRepository;
    }

    /**
     * {@code POST  /khach-hangs} : Create a new khachHang.
     *
     * @param khachHang the khachHang to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new khachHang, or with status {@code 400 (Bad Request)} if the khachHang has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/khach-hangs")
    public ResponseEntity<KhachHang> createKhachHang(@RequestBody KhachHang khachHang) throws URISyntaxException {
        //        log.debug("REST request to save KhachHang : {}", khachHang);
        if (khachHang.getId() != null) {
            throw new BadRequestAlertException("A new khachHang cannot already have an ID", ENTITY_NAME, "idexists");
        }
        KhachHang result = khachHangRepository.save(khachHang);
        return ResponseEntity
            .created(new URI("/api/khach-hangs/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /khach-hangs/:id} : Updates an existing khachHang.
     *
     * @param id the id of the khachHang to save.
     * @param khachHang the khachHang to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated khachHang,
     * or with status {@code 400 (Bad Request)} if the khachHang is not valid,
     * or with status {@code 500 (Internal Server Error)} if the khachHang couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/khach-hangs/{id}")
    public ResponseEntity<KhachHang> updateKhachHang(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody KhachHang khachHang
    ) throws URISyntaxException {
        //        log.debug("REST request to update KhachHang : {}, {}", id, khachHang);
        if (khachHang.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, khachHang.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!khachHangRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        KhachHang result = khachHangRepository.save(khachHang);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, khachHang.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /khach-hangs/:id} : Partial updates given fields of an existing khachHang, field will ignore if it is null
     *
     * @param id the id of the khachHang to save.
     * @param khachHang the khachHang to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated khachHang,
     * or with status {@code 400 (Bad Request)} if the khachHang is not valid,
     * or with status {@code 404 (Not Found)} if the khachHang is not found,
     * or with status {@code 500 (Internal Server Error)} if the khachHang couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/khach-hangs/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<KhachHang> partialUpdateKhachHang(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody KhachHang khachHang
    ) throws URISyntaxException {
        //        log.debug("REST request to partial update KhachHang partially : {}, {}", id, khachHang);
        if (khachHang.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, khachHang.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!khachHangRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<KhachHang> result = khachHangRepository
            .findById(khachHang.getId())
            .map(existingKhachHang -> {
                if (khachHang.getMaKhachHang() != null) {
                    existingKhachHang.setMaKhachHang(khachHang.getMaKhachHang());
                }
                if (khachHang.getTenKhachHang() != null) {
                    existingKhachHang.setTenKhachHang(khachHang.getTenKhachHang());
                }
                if (khachHang.getSoDienThoai() != null) {
                    existingKhachHang.setSoDienThoai(khachHang.getSoDienThoai());
                }
                if (khachHang.getDiaChi() != null) {
                    existingKhachHang.setDiaChi(khachHang.getDiaChi());
                }

                return existingKhachHang;
            })
            .map(khachHangRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, khachHang.getId().toString())
        );
    }

    /**
     * {@code GET  /khach-hangs} : get all the khachHangs.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of khachHangs in body.
     */
    @GetMapping("/khach-hangs")
    public List<KhachHang> getAllKhachHangs() {
        //        log.debug("REST request to get all KhachHangs");
        return khachHangRepository.findAll();
    }

    /**
     * {@code GET  /khach-hangs/:id} : get the "id" khachHang.
     *
     * @param id the id of the khachHang to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the khachHang, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/khach-hangs/{id}")
    public ResponseEntity<KhachHang> getKhachHang(@PathVariable Long id) {
        //        log.debug("REST request to get KhachHang : {}", id);
        Optional<KhachHang> khachHang = khachHangRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(khachHang);
    }

    /**
     * {@code DELETE  /khach-hangs/:id} : delete the "id" khachHang.
     *
     * @param id the id of the khachHang to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/khach-hangs/{id}")
    public ResponseEntity<Void> deleteKhachHang(@PathVariable Long id) {
        //        log.debug("REST request to delete KhachHang : {}", id);
        khachHangRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
