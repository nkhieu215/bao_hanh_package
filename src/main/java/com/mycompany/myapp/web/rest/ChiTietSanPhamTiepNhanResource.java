package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.ChiTietSanPhamTiepNhan;
import com.mycompany.myapp.repository.ChiTietSanPhamTiepNhanRepository;
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
 * REST controller for managing {@link com.mycompany.myapp.domain.ChiTietSanPhamTiepNhan}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class ChiTietSanPhamTiepNhanResource {

    //    private final Logger log = LoggerFactory.getLogger(ChiTietSanPhamTiepNhanResource.class);

    private static final String ENTITY_NAME = "chiTietSanPhamTiepNhan";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ChiTietSanPhamTiepNhanRepository chiTietSanPhamTiepNhanRepository;

    public ChiTietSanPhamTiepNhanResource(ChiTietSanPhamTiepNhanRepository chiTietSanPhamTiepNhanRepository) {
        this.chiTietSanPhamTiepNhanRepository = chiTietSanPhamTiepNhanRepository;
    }

    /**
     * {@code POST  /chi-tiet-san-pham-tiep-nhans} : Create a new chiTietSanPhamTiepNhan.
     *
     * @param chiTietSanPhamTiepNhan the chiTietSanPhamTiepNhan to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new chiTietSanPhamTiepNhan, or with status {@code 400 (Bad Request)} if the chiTietSanPhamTiepNhan has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/chi-tiet-san-pham-tiep-nhans")
    public ResponseEntity<ChiTietSanPhamTiepNhan> createChiTietSanPhamTiepNhan(@RequestBody ChiTietSanPhamTiepNhan chiTietSanPhamTiepNhan)
        throws URISyntaxException {
        //        log.debug("REST request to save ChiTietSanPhamTiepNhan : {}", chiTietSanPhamTiepNhan);
        if (chiTietSanPhamTiepNhan.getId() != null) {
            throw new BadRequestAlertException("A new chiTietSanPhamTiepNhan cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ChiTietSanPhamTiepNhan result = chiTietSanPhamTiepNhanRepository.save(chiTietSanPhamTiepNhan);
        return ResponseEntity
            .created(new URI("/api/chi-tiet-san-pham-tiep-nhans/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /chi-tiet-san-pham-tiep-nhans/:id} : Updates an existing chiTietSanPhamTiepNhan.
     *
     * @param id the id of the chiTietSanPhamTiepNhan to save.
     * @param chiTietSanPhamTiepNhan the chiTietSanPhamTiepNhan to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated chiTietSanPhamTiepNhan,
     * or with status {@code 400 (Bad Request)} if the chiTietSanPhamTiepNhan is not valid,
     * or with status {@code 500 (Internal Server Error)} if the chiTietSanPhamTiepNhan couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/chi-tiet-san-pham-tiep-nhans/{id}")
    public ResponseEntity<ChiTietSanPhamTiepNhan> updateChiTietSanPhamTiepNhan(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ChiTietSanPhamTiepNhan chiTietSanPhamTiepNhan
    ) throws URISyntaxException {
        //        log.debug("REST request to update ChiTietSanPhamTiepNhan : {}, {}", id, chiTietSanPhamTiepNhan);
        if (chiTietSanPhamTiepNhan.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, chiTietSanPhamTiepNhan.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!chiTietSanPhamTiepNhanRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        ChiTietSanPhamTiepNhan result = chiTietSanPhamTiepNhanRepository.save(chiTietSanPhamTiepNhan);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, chiTietSanPhamTiepNhan.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /chi-tiet-san-pham-tiep-nhans/:id} : Partial updates given fields of an existing chiTietSanPhamTiepNhan, field will ignore if it is null
     *
     * @param id the id of the chiTietSanPhamTiepNhan to save.
     * @param chiTietSanPhamTiepNhan the chiTietSanPhamTiepNhan to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated chiTietSanPhamTiepNhan,
     * or with status {@code 400 (Bad Request)} if the chiTietSanPhamTiepNhan is not valid,
     * or with status {@code 404 (Not Found)} if the chiTietSanPhamTiepNhan is not found,
     * or with status {@code 500 (Internal Server Error)} if the chiTietSanPhamTiepNhan couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/chi-tiet-san-pham-tiep-nhans/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<ChiTietSanPhamTiepNhan> partialUpdateChiTietSanPhamTiepNhan(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ChiTietSanPhamTiepNhan chiTietSanPhamTiepNhan
    ) throws URISyntaxException {
        //        log.debug("REST request to partial update ChiTietSanPhamTiepNhan partially : {}, {}", id, chiTietSanPhamTiepNhan);
        if (chiTietSanPhamTiepNhan.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, chiTietSanPhamTiepNhan.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!chiTietSanPhamTiepNhanRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<ChiTietSanPhamTiepNhan> result = chiTietSanPhamTiepNhanRepository
            .findById(chiTietSanPhamTiepNhan.getId())
            .map(existingChiTietSanPhamTiepNhan -> {
                if (chiTietSanPhamTiepNhan.getSoLuongKhachHang() != null) {
                    existingChiTietSanPhamTiepNhan.setSoLuongKhachHang(chiTietSanPhamTiepNhan.getSoLuongKhachHang());
                }
                if (chiTietSanPhamTiepNhan.getIdKho() != null) {
                    existingChiTietSanPhamTiepNhan.setIdKho(chiTietSanPhamTiepNhan.getIdKho());
                }
                if (chiTietSanPhamTiepNhan.getIdBienBan() != null) {
                    existingChiTietSanPhamTiepNhan.setIdBienBan(chiTietSanPhamTiepNhan.getIdBienBan());
                }
                if (chiTietSanPhamTiepNhan.getTongLoiKiThuat() != null) {
                    existingChiTietSanPhamTiepNhan.setTongLoiKiThuat(chiTietSanPhamTiepNhan.getTongLoiKiThuat());
                }
                if (chiTietSanPhamTiepNhan.getTongLoiLinhDong() != null) {
                    existingChiTietSanPhamTiepNhan.setTongLoiLinhDong(chiTietSanPhamTiepNhan.getTongLoiLinhDong());
                }
                if (chiTietSanPhamTiepNhan.getNgayPhanLoai() != null) {
                    existingChiTietSanPhamTiepNhan.setNgayPhanLoai(chiTietSanPhamTiepNhan.getNgayPhanLoai());
                }
                if (chiTietSanPhamTiepNhan.getSlTiepNhan() != null) {
                    existingChiTietSanPhamTiepNhan.setSlTiepNhan(chiTietSanPhamTiepNhan.getSlTiepNhan());
                }
                if (chiTietSanPhamTiepNhan.getSlTon() != null) {
                    existingChiTietSanPhamTiepNhan.setSlTon(chiTietSanPhamTiepNhan.getSlTon());
                }
                if (chiTietSanPhamTiepNhan.getTinhTrangBaoHanh() != null) {
                    existingChiTietSanPhamTiepNhan.setTinhTrangBaoHanh(chiTietSanPhamTiepNhan.getTinhTrangBaoHanh());
                }

                return existingChiTietSanPhamTiepNhan;
            })
            .map(chiTietSanPhamTiepNhanRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, chiTietSanPhamTiepNhan.getId().toString())
        );
    }

    /**
     * {@code GET  /chi-tiet-san-pham-tiep-nhans} : get all the chiTietSanPhamTiepNhans.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of chiTietSanPhamTiepNhans in body.
     */
    @GetMapping("/chi-tiet-san-pham-tiep-nhans")
    public List<ChiTietSanPhamTiepNhan> getAllChiTietSanPhamTiepNhans() {
        //        log.debug("REST request to get all ChiTietSanPhamTiepNhans");
        return chiTietSanPhamTiepNhanRepository.findAll();
    }

    /**
     * {@code GET  /chi-tiet-san-pham-tiep-nhans/:id} : get the "id" chiTietSanPhamTiepNhan.
     *
     * @param id the id of the chiTietSanPhamTiepNhan to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the chiTietSanPhamTiepNhan, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/chi-tiet-san-pham-tiep-nhans/{id}")
    public ResponseEntity<ChiTietSanPhamTiepNhan> getChiTietSanPhamTiepNhan(@PathVariable Long id) {
        //        log.debug("REST request to get ChiTietSanPhamTiepNhan : {}", id);
        Optional<ChiTietSanPhamTiepNhan> chiTietSanPhamTiepNhan = chiTietSanPhamTiepNhanRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(chiTietSanPhamTiepNhan);
    }

    /**
     * {@code DELETE  /chi-tiet-san-pham-tiep-nhans/:id} : delete the "id" chiTietSanPhamTiepNhan.
     *
     * @param id the id of the chiTietSanPhamTiepNhan to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/chi-tiet-san-pham-tiep-nhans/{id}")
    public ResponseEntity<Void> deleteChiTietSanPhamTiepNhan(@PathVariable Long id) {
        //        log.debug("REST request to delete ChiTietSanPhamTiepNhan : {}", id);
        chiTietSanPhamTiepNhanRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
