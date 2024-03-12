package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.DonBaoHanh;
import com.mycompany.myapp.repository.DonBaoHanhRepository;
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
 * REST controller for managing {@link com.mycompany.myapp.domain.DonBaoHanh}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class DonBaoHanhResource {

    //    private final Logger log = LoggerFactory.getLogger(DonBaoHanhResource.class);

    private static final String ENTITY_NAME = "donBaoHanh";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final DonBaoHanhRepository donBaoHanhRepository;

    public DonBaoHanhResource(DonBaoHanhRepository donBaoHanhRepository) {
        this.donBaoHanhRepository = donBaoHanhRepository;
    }

    /**
     * {@code POST  /don-bao-hanhs} : Create a new donBaoHanh.
     *
     * @param donBaoHanh the donBaoHanh to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new donBaoHanh, or with status {@code 400 (Bad Request)} if the donBaoHanh has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/don-bao-hanhs")
    public ResponseEntity<DonBaoHanh> createDonBaoHanh(@RequestBody DonBaoHanh donBaoHanh) throws URISyntaxException {
        //        log.debug("REST request to save DonBaoHanh : {}", donBaoHanh);
        if (donBaoHanh.getId() != null) {
            throw new BadRequestAlertException("A new donBaoHanh cannot already have an ID", ENTITY_NAME, "idexists");
        }
        DonBaoHanh result = donBaoHanhRepository.save(donBaoHanh);
        return ResponseEntity
            .created(new URI("/api/don-bao-hanhs/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /don-bao-hanhs/:id} : Updates an existing donBaoHanh.
     *
     * @param id the id of the donBaoHanh to save.
     * @param donBaoHanh the donBaoHanh to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated donBaoHanh,
     * or with status {@code 400 (Bad Request)} if the donBaoHanh is not valid,
     * or with status {@code 500 (Internal Server Error)} if the donBaoHanh couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/don-bao-hanhs/{id}")
    public ResponseEntity<DonBaoHanh> updateDonBaoHanh(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody DonBaoHanh donBaoHanh
    ) throws URISyntaxException {
        //        log.debug("REST request to update DonBaoHanh : {}, {}", id, donBaoHanh);
        if (donBaoHanh.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, donBaoHanh.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!donBaoHanhRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        DonBaoHanh result = donBaoHanhRepository.save(donBaoHanh);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, donBaoHanh.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /don-bao-hanhs/:id} : Partial updates given fields of an existing donBaoHanh, field will ignore if it is null
     *
     * @param id the id of the donBaoHanh to save.
     * @param donBaoHanh the donBaoHanh to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated donBaoHanh,
     * or with status {@code 400 (Bad Request)} if the donBaoHanh is not valid,
     * or with status {@code 404 (Not Found)} if the donBaoHanh is not found,
     * or with status {@code 500 (Internal Server Error)} if the donBaoHanh couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/don-bao-hanhs/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<DonBaoHanh> partialUpdateDonBaoHanh(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody DonBaoHanh donBaoHanh
    ) throws URISyntaxException {
        //        log.debug("REST request to partial update DonBaoHanh partially : {}, {}", id, donBaoHanh);
        if (donBaoHanh.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, donBaoHanh.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!donBaoHanhRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<DonBaoHanh> result = donBaoHanhRepository
            .findById(donBaoHanh.getId())
            .map(existingDonBaoHanh -> {
                if (donBaoHanh.getNgayTiepNhan() != null) {
                    existingDonBaoHanh.setNgayTiepNhan(donBaoHanh.getNgayTiepNhan());
                }
                if (donBaoHanh.getTrangThai() != null) {
                    existingDonBaoHanh.setTrangThai(donBaoHanh.getTrangThai());
                }
                if (donBaoHanh.getNhanVienGiaoHang() != null) {
                    existingDonBaoHanh.setNhanVienGiaoHang(donBaoHanh.getNhanVienGiaoHang());
                }
                if (donBaoHanh.getNgaykhkb() != null) {
                    existingDonBaoHanh.setNgaykhkb(donBaoHanh.getNgaykhkb());
                }
                if (donBaoHanh.getNguoiTaoDon() != null) {
                    existingDonBaoHanh.setNguoiTaoDon(donBaoHanh.getNguoiTaoDon());
                }
                if (donBaoHanh.getSlTiepNhan() != null) {
                    existingDonBaoHanh.setSlTiepNhan(donBaoHanh.getSlTiepNhan());
                }
                if (donBaoHanh.getSlDaPhanTich() != null) {
                    existingDonBaoHanh.setSlDaPhanTich(donBaoHanh.getSlDaPhanTich());
                }
                if (donBaoHanh.getGhiChu() != null) {
                    existingDonBaoHanh.setGhiChu(donBaoHanh.getGhiChu());
                }
                if (donBaoHanh.getNgayTraBienBan() != null) {
                    existingDonBaoHanh.setNgayTraBienBan(donBaoHanh.getNgayTraBienBan());
                }

                return existingDonBaoHanh;
            })
            .map(donBaoHanhRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, donBaoHanh.getId().toString())
        );
    }

    /**
     * {@code GET  /don-bao-hanhs} : get all the donBaoHanhs.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of donBaoHanhs in body.
     */
    @GetMapping("/don-bao-hanhs")
    public List<DonBaoHanh> getAllDonBaoHanhs() {
        //        log.debug("REST request to get all DonBaoHanhs");
        return donBaoHanhRepository.findAll();
    }

    /**
     * {@code GET  /don-bao-hanhs/:id} : get the "id" donBaoHanh.
     *
     * @param id the id of the donBaoHanh to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the donBaoHanh, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/don-bao-hanhs/{id}")
    public ResponseEntity<DonBaoHanh> getDonBaoHanh(@PathVariable Long id) {
        //        log.debug("REST request to get DonBaoHanh : {}", id);
        Optional<DonBaoHanh> donBaoHanh = donBaoHanhRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(donBaoHanh);
    }

    /**
     * {@code DELETE  /don-bao-hanhs/:id} : delete the "id" donBaoHanh.
     *
     * @param id the id of the donBaoHanh to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/don-bao-hanhs/{id}")
    public ResponseEntity<Void> deleteDonBaoHanh(@PathVariable Long id) {
        //        log.debug("REST request to delete DonBaoHanh : {}", id);
        donBaoHanhRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
