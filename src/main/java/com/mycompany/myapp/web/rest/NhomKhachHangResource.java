package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.NhomKhachHang;
import com.mycompany.myapp.repository.NhomKhachHangRepository;
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
 * REST controller for managing {@link com.mycompany.myapp.domain.NhomKhachHang}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class NhomKhachHangResource {

    //    private final Logger log = LoggerFactory.getLogger(NhomKhachHangResource.class);

    private static final String ENTITY_NAME = "nhomKhachHang";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final NhomKhachHangRepository nhomKhachHangRepository;

    public NhomKhachHangResource(NhomKhachHangRepository nhomKhachHangRepository) {
        this.nhomKhachHangRepository = nhomKhachHangRepository;
    }

    /**
     * {@code POST  /nhom-khach-hangs} : Create a new nhomKhachHang.
     *
     * @param nhomKhachHang the nhomKhachHang to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new nhomKhachHang, or with status {@code 400 (Bad Request)} if the nhomKhachHang has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/nhom-khach-hangs")
    public ResponseEntity<NhomKhachHang> createNhomKhachHang(@RequestBody NhomKhachHang nhomKhachHang) throws URISyntaxException {
        //        log.debug("REST request to save NhomKhachHang : {}", nhomKhachHang);
        if (nhomKhachHang.getId() != null) {
            throw new BadRequestAlertException("A new nhomKhachHang cannot already have an ID", ENTITY_NAME, "idexists");
        }
        NhomKhachHang result = nhomKhachHangRepository.save(nhomKhachHang);
        return ResponseEntity
            .created(new URI("/api/nhom-khach-hangs/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /nhom-khach-hangs/:id} : Updates an existing nhomKhachHang.
     *
     * @param id the id of the nhomKhachHang to save.
     * @param nhomKhachHang the nhomKhachHang to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated nhomKhachHang,
     * or with status {@code 400 (Bad Request)} if the nhomKhachHang is not valid,
     * or with status {@code 500 (Internal Server Error)} if the nhomKhachHang couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/nhom-khach-hangs/{id}")
    public ResponseEntity<NhomKhachHang> updateNhomKhachHang(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody NhomKhachHang nhomKhachHang
    ) throws URISyntaxException {
        //        log.debug("REST request to update NhomKhachHang : {}, {}", id, nhomKhachHang);
        if (nhomKhachHang.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, nhomKhachHang.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!nhomKhachHangRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        NhomKhachHang result = nhomKhachHangRepository.save(nhomKhachHang);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, nhomKhachHang.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /nhom-khach-hangs/:id} : Partial updates given fields of an existing nhomKhachHang, field will ignore if it is null
     *
     * @param id the id of the nhomKhachHang to save.
     * @param nhomKhachHang the nhomKhachHang to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated nhomKhachHang,
     * or with status {@code 400 (Bad Request)} if the nhomKhachHang is not valid,
     * or with status {@code 404 (Not Found)} if the nhomKhachHang is not found,
     * or with status {@code 500 (Internal Server Error)} if the nhomKhachHang couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/nhom-khach-hangs/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<NhomKhachHang> partialUpdateNhomKhachHang(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody NhomKhachHang nhomKhachHang
    ) throws URISyntaxException {
        //        log.debug("REST request to partial update NhomKhachHang partially : {}, {}", id, nhomKhachHang);
        if (nhomKhachHang.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, nhomKhachHang.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!nhomKhachHangRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<NhomKhachHang> result = nhomKhachHangRepository
            .findById(nhomKhachHang.getId())
            .map(existingNhomKhachHang -> {
                if (nhomKhachHang.getTenNhomKhachHang() != null) {
                    existingNhomKhachHang.setTenNhomKhachHang(nhomKhachHang.getTenNhomKhachHang());
                }
                if (nhomKhachHang.getNgayTao() != null) {
                    existingNhomKhachHang.setNgayTao(nhomKhachHang.getNgayTao());
                }
                if (nhomKhachHang.getNgayCapNhat() != null) {
                    existingNhomKhachHang.setNgayCapNhat(nhomKhachHang.getNgayCapNhat());
                }
                if (nhomKhachHang.getUsername() != null) {
                    existingNhomKhachHang.setUsername(nhomKhachHang.getUsername());
                }
                if (nhomKhachHang.getTrangThai() != null) {
                    existingNhomKhachHang.setTrangThai(nhomKhachHang.getTrangThai());
                }

                return existingNhomKhachHang;
            })
            .map(nhomKhachHangRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, nhomKhachHang.getId().toString())
        );
    }

    /**
     * {@code GET  /nhom-khach-hangs} : get all the nhomKhachHangs.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of nhomKhachHangs in body.
     */
    @GetMapping("/nhom-khach-hangs")
    public List<NhomKhachHang> getAllNhomKhachHangs() {
        //        log.debug("REST request to get all NhomKhachHangs");
        return nhomKhachHangRepository.findAll();
    }

    /**
     * {@code GET  /nhom-khach-hangs/:id} : get the "id" nhomKhachHang.
     *
     * @param id the id of the nhomKhachHang to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the nhomKhachHang, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/nhom-khach-hangs/{id}")
    public ResponseEntity<NhomKhachHang> getNhomKhachHang(@PathVariable Long id) {
        //        log.debug("REST request to get NhomKhachHang : {}", id);
        Optional<NhomKhachHang> nhomKhachHang = nhomKhachHangRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(nhomKhachHang);
    }

    /**
     * {@code DELETE  /nhom-khach-hangs/:id} : delete the "id" nhomKhachHang.
     *
     * @param id the id of the nhomKhachHang to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/nhom-khach-hangs/{id}")
    public ResponseEntity<Void> deleteNhomKhachHang(@PathVariable Long id) {
        //        log.debug("REST request to delete NhomKhachHang : {}", id);
        nhomKhachHangRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
