package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.NhomLoi;
import com.mycompany.myapp.repository.NhomLoiRepository;
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
 * REST controller for managing {@link com.mycompany.myapp.domain.NhomLoi}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class NhomLoiResource {

    //    private final Logger log = LoggerFactory.getLogger(NhomLoiResource.class);

    private static final String ENTITY_NAME = "nhomLoi";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final NhomLoiRepository nhomLoiRepository;

    public NhomLoiResource(NhomLoiRepository nhomLoiRepository) {
        this.nhomLoiRepository = nhomLoiRepository;
    }

    /**
     * {@code POST  /nhom-lois} : Create a new nhomLoi.
     *
     * @param nhomLoi the nhomLoi to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new nhomLoi, or with status {@code 400 (Bad Request)} if the nhomLoi has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/nhom-lois")
    public ResponseEntity<NhomLoi> createNhomLoi(@RequestBody NhomLoi nhomLoi) throws URISyntaxException {
        //        log.debug("REST request to save NhomLoi : {}", nhomLoi);
        if (nhomLoi.getId() != null) {
            throw new BadRequestAlertException("A new nhomLoi cannot already have an ID", ENTITY_NAME, "idexists");
        }
        NhomLoi result = nhomLoiRepository.save(nhomLoi);
        return ResponseEntity
            .created(new URI("/api/nhom-lois/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /nhom-lois/:id} : Updates an existing nhomLoi.
     *
     * @param id the id of the nhomLoi to save.
     * @param nhomLoi the nhomLoi to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated nhomLoi,
     * or with status {@code 400 (Bad Request)} if the nhomLoi is not valid,
     * or with status {@code 500 (Internal Server Error)} if the nhomLoi couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/nhom-lois/{id}")
    public ResponseEntity<NhomLoi> updateNhomLoi(@PathVariable(value = "id", required = false) final Long id, @RequestBody NhomLoi nhomLoi)
        throws URISyntaxException {
        //        log.debug("REST request to update NhomLoi : {}, {}", id, nhomLoi);
        if (nhomLoi.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, nhomLoi.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!nhomLoiRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        NhomLoi result = nhomLoiRepository.save(nhomLoi);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, nhomLoi.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /nhom-lois/:id} : Partial updates given fields of an existing nhomLoi, field will ignore if it is null
     *
     * @param id the id of the nhomLoi to save.
     * @param nhomLoi the nhomLoi to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated nhomLoi,
     * or with status {@code 400 (Bad Request)} if the nhomLoi is not valid,
     * or with status {@code 404 (Not Found)} if the nhomLoi is not found,
     * or with status {@code 500 (Internal Server Error)} if the nhomLoi couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/nhom-lois/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<NhomLoi> partialUpdateNhomLoi(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody NhomLoi nhomLoi
    ) throws URISyntaxException {
        //        log.debug("REST request to partial update NhomLoi partially : {}, {}", id, nhomLoi);
        if (nhomLoi.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, nhomLoi.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!nhomLoiRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<NhomLoi> result = nhomLoiRepository
            .findById(nhomLoi.getId())
            .map(existingNhomLoi -> {
                if (nhomLoi.getMaNhomLoi() != null) {
                    existingNhomLoi.setMaNhomLoi(nhomLoi.getMaNhomLoi());
                }
                if (nhomLoi.getTenNhomLoi() != null) {
                    existingNhomLoi.setTenNhomLoi(nhomLoi.getTenNhomLoi());
                }
                if (nhomLoi.getNgayTao() != null) {
                    existingNhomLoi.setNgayTao(nhomLoi.getNgayTao());
                }
                if (nhomLoi.getNgayCapNhat() != null) {
                    existingNhomLoi.setNgayCapNhat(nhomLoi.getNgayCapNhat());
                }
                if (nhomLoi.getUsername() != null) {
                    existingNhomLoi.setUsername(nhomLoi.getUsername());
                }
                if (nhomLoi.getGhiChu() != null) {
                    existingNhomLoi.setGhiChu(nhomLoi.getGhiChu());
                }
                if (nhomLoi.getTrangThai() != null) {
                    existingNhomLoi.setTrangThai(nhomLoi.getTrangThai());
                }

                return existingNhomLoi;
            })
            .map(nhomLoiRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, nhomLoi.getId().toString())
        );
    }

    /**
     * {@code GET  /nhom-lois} : get all the nhomLois.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of nhomLois in body.
     */
    @GetMapping("/nhom-lois")
    public List<NhomLoi> getAllNhomLois() {
        //        log.debug("REST request to get all NhomLois");
        return nhomLoiRepository.findAll();
    }

    /**
     * {@code GET  /nhom-lois/:id} : get the "id" nhomLoi.
     *
     * @param id the id of the nhomLoi to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the nhomLoi, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/nhom-lois/{id}")
    public ResponseEntity<NhomLoi> getNhomLoi(@PathVariable Long id) {
        //        log.debug("REST request to get NhomLoi : {}", id);
        Optional<NhomLoi> nhomLoi = nhomLoiRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(nhomLoi);
    }

    /**
     * {@code DELETE  /nhom-lois/:id} : delete the "id" nhomLoi.
     *
     * @param id the id of the nhomLoi to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/nhom-lois/{id}")
    public ResponseEntity<Void> deleteNhomLoi(@PathVariable Long id) {
        //        log.debug("REST request to delete NhomLoi : {}", id);
        nhomLoiRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
