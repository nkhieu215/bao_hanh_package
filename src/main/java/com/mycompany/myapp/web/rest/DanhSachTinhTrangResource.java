package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.DanhSachTinhTrang;
import com.mycompany.myapp.repository.DanhSachTinhTrangRepository;
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
 * REST controller for managing {@link com.mycompany.myapp.domain.DanhSachTinhTrang}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class DanhSachTinhTrangResource {

    //    private final Logger log = LoggerFactory.getLogger(DanhSachTinhTrangResource.class);

    private static final String ENTITY_NAME = "danhSachTinhTrang";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final DanhSachTinhTrangRepository danhSachTinhTrangRepository;

    public DanhSachTinhTrangResource(DanhSachTinhTrangRepository danhSachTinhTrangRepository) {
        this.danhSachTinhTrangRepository = danhSachTinhTrangRepository;
    }

    /**
     * {@code POST  /danh-sach-tinh-trangs} : Create a new danhSachTinhTrang.
     *
     * @param danhSachTinhTrang the danhSachTinhTrang to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new danhSachTinhTrang, or with status {@code 400 (Bad Request)} if the danhSachTinhTrang has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/danh-sach-tinh-trangs")
    public ResponseEntity<DanhSachTinhTrang> createDanhSachTinhTrang(@RequestBody DanhSachTinhTrang danhSachTinhTrang)
        throws URISyntaxException {
        //        log.debug("REST request to save DanhSachTinhTrang : {}", danhSachTinhTrang);
        if (danhSachTinhTrang.getId() != null) {
            throw new BadRequestAlertException("A new danhSachTinhTrang cannot already have an ID", ENTITY_NAME, "idexists");
        }
        DanhSachTinhTrang result = danhSachTinhTrangRepository.save(danhSachTinhTrang);
        return ResponseEntity
            .created(new URI("/api/danh-sach-tinh-trangs/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /danh-sach-tinh-trangs/:id} : Updates an existing danhSachTinhTrang.
     *
     * @param id the id of the danhSachTinhTrang to save.
     * @param danhSachTinhTrang the danhSachTinhTrang to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated danhSachTinhTrang,
     * or with status {@code 400 (Bad Request)} if the danhSachTinhTrang is not valid,
     * or with status {@code 500 (Internal Server Error)} if the danhSachTinhTrang couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/danh-sach-tinh-trangs/{id}")
    public ResponseEntity<DanhSachTinhTrang> updateDanhSachTinhTrang(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody DanhSachTinhTrang danhSachTinhTrang
    ) throws URISyntaxException {
        //        log.debug("REST request to update DanhSachTinhTrang : {}, {}", id, danhSachTinhTrang);
        if (danhSachTinhTrang.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, danhSachTinhTrang.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!danhSachTinhTrangRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        DanhSachTinhTrang result = danhSachTinhTrangRepository.save(danhSachTinhTrang);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, danhSachTinhTrang.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /danh-sach-tinh-trangs/:id} : Partial updates given fields of an existing danhSachTinhTrang, field will ignore if it is null
     *
     * @param id the id of the danhSachTinhTrang to save.
     * @param danhSachTinhTrang the danhSachTinhTrang to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated danhSachTinhTrang,
     * or with status {@code 400 (Bad Request)} if the danhSachTinhTrang is not valid,
     * or with status {@code 404 (Not Found)} if the danhSachTinhTrang is not found,
     * or with status {@code 500 (Internal Server Error)} if the danhSachTinhTrang couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/danh-sach-tinh-trangs/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<DanhSachTinhTrang> partialUpdateDanhSachTinhTrang(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody DanhSachTinhTrang danhSachTinhTrang
    ) throws URISyntaxException {
        //        log.debug("REST request to partial update DanhSachTinhTrang partially : {}, {}", id, danhSachTinhTrang);
        if (danhSachTinhTrang.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, danhSachTinhTrang.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!danhSachTinhTrangRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<DanhSachTinhTrang> result = danhSachTinhTrangRepository
            .findById(danhSachTinhTrang.getId())
            .map(existingDanhSachTinhTrang -> {
                if (danhSachTinhTrang.getTenTinhTrangPhanLoai() != null) {
                    existingDanhSachTinhTrang.setTenTinhTrangPhanLoai(danhSachTinhTrang.getTenTinhTrangPhanLoai());
                }
                if (danhSachTinhTrang.getNgayTao() != null) {
                    existingDanhSachTinhTrang.setNgayTao(danhSachTinhTrang.getNgayTao());
                }
                if (danhSachTinhTrang.getNgayCapNhat() != null) {
                    existingDanhSachTinhTrang.setNgayCapNhat(danhSachTinhTrang.getNgayCapNhat());
                }
                if (danhSachTinhTrang.getUsername() != null) {
                    existingDanhSachTinhTrang.setUsername(danhSachTinhTrang.getUsername());
                }
                if (danhSachTinhTrang.getTrangThai() != null) {
                    existingDanhSachTinhTrang.setTrangThai(danhSachTinhTrang.getTrangThai());
                }

                return existingDanhSachTinhTrang;
            })
            .map(danhSachTinhTrangRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, danhSachTinhTrang.getId().toString())
        );
    }

    /**
     * {@code GET  /danh-sach-tinh-trangs} : get all the danhSachTinhTrangs.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of danhSachTinhTrangs in body.
     */
    @GetMapping("/danh-sach-tinh-trangs")
    public List<DanhSachTinhTrang> getAllDanhSachTinhTrangs() {
        //        log.debug("REST request to get all DanhSachTinhTrangs");
        return danhSachTinhTrangRepository.findAll();
    }

    /**
     * {@code GET  /danh-sach-tinh-trangs/:id} : get the "id" danhSachTinhTrang.
     *
     * @param id the id of the danhSachTinhTrang to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the danhSachTinhTrang, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/danh-sach-tinh-trangs/{id}")
    public ResponseEntity<DanhSachTinhTrang> getDanhSachTinhTrang(@PathVariable Long id) {
        //        log.debug("REST request to get DanhSachTinhTrang : {}", id);
        Optional<DanhSachTinhTrang> danhSachTinhTrang = danhSachTinhTrangRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(danhSachTinhTrang);
    }

    /**
     * {@code DELETE  /danh-sach-tinh-trangs/:id} : delete the "id" danhSachTinhTrang.
     *
     * @param id the id of the danhSachTinhTrang to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/danh-sach-tinh-trangs/{id}")
    public ResponseEntity<Void> deleteDanhSachTinhTrang(@PathVariable Long id) {
        //        log.debug("REST request to delete DanhSachTinhTrang : {}", id);
        danhSachTinhTrangRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
