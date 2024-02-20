package com.mycompany.myapp.web.rest;

import static com.mycompany.myapp.web.rest.TestUtil.sameInstant;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.DanhSachTinhTrang;
import com.mycompany.myapp.repository.DanhSachTinhTrangRepository;
import java.time.Instant;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link DanhSachTinhTrangResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class DanhSachTinhTrangResourceIT {

    private static final String DEFAULT_TEN_TINH_TRANG_PHAN_LOAI = "AAAAAAAAAA";
    private static final String UPDATED_TEN_TINH_TRANG_PHAN_LOAI = "BBBBBBBBBB";

    private static final ZonedDateTime DEFAULT_NGAY_TAO = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_NGAY_TAO = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final ZonedDateTime DEFAULT_NGAY_CAP_NHAT = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_NGAY_CAP_NHAT = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final String DEFAULT_USERNAME = "AAAAAAAAAA";
    private static final String UPDATED_USERNAME = "BBBBBBBBBB";

    private static final String DEFAULT_TRANG_THAI = "AAAAAAAAAA";
    private static final String UPDATED_TRANG_THAI = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/danh-sach-tinh-trangs";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private DanhSachTinhTrangRepository danhSachTinhTrangRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restDanhSachTinhTrangMockMvc;

    private DanhSachTinhTrang danhSachTinhTrang;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static DanhSachTinhTrang createEntity(EntityManager em) {
        DanhSachTinhTrang danhSachTinhTrang = new DanhSachTinhTrang()
            .tenTinhTrangPhanLoai(DEFAULT_TEN_TINH_TRANG_PHAN_LOAI)
            .ngayTao(DEFAULT_NGAY_TAO)
            .ngayCapNhat(DEFAULT_NGAY_CAP_NHAT)
            .username(DEFAULT_USERNAME)
            .trangThai(DEFAULT_TRANG_THAI);
        return danhSachTinhTrang;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static DanhSachTinhTrang createUpdatedEntity(EntityManager em) {
        DanhSachTinhTrang danhSachTinhTrang = new DanhSachTinhTrang()
            .tenTinhTrangPhanLoai(UPDATED_TEN_TINH_TRANG_PHAN_LOAI)
            .ngayTao(UPDATED_NGAY_TAO)
            .ngayCapNhat(UPDATED_NGAY_CAP_NHAT)
            .username(UPDATED_USERNAME)
            .trangThai(UPDATED_TRANG_THAI);
        return danhSachTinhTrang;
    }

    @BeforeEach
    public void initTest() {
        danhSachTinhTrang = createEntity(em);
    }

    @Test
    @Transactional
    void createDanhSachTinhTrang() throws Exception {
        int databaseSizeBeforeCreate = danhSachTinhTrangRepository.findAll().size();
        // Create the DanhSachTinhTrang
        restDanhSachTinhTrangMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(danhSachTinhTrang))
            )
            .andExpect(status().isCreated());

        // Validate the DanhSachTinhTrang in the database
        List<DanhSachTinhTrang> danhSachTinhTrangList = danhSachTinhTrangRepository.findAll();
        assertThat(danhSachTinhTrangList).hasSize(databaseSizeBeforeCreate + 1);
        DanhSachTinhTrang testDanhSachTinhTrang = danhSachTinhTrangList.get(danhSachTinhTrangList.size() - 1);
        assertThat(testDanhSachTinhTrang.getTenTinhTrangPhanLoai()).isEqualTo(DEFAULT_TEN_TINH_TRANG_PHAN_LOAI);
        assertThat(testDanhSachTinhTrang.getNgayTao()).isEqualTo(DEFAULT_NGAY_TAO);
        assertThat(testDanhSachTinhTrang.getNgayCapNhat()).isEqualTo(DEFAULT_NGAY_CAP_NHAT);
        assertThat(testDanhSachTinhTrang.getUsername()).isEqualTo(DEFAULT_USERNAME);
        assertThat(testDanhSachTinhTrang.getTrangThai()).isEqualTo(DEFAULT_TRANG_THAI);
    }

    @Test
    @Transactional
    void createDanhSachTinhTrangWithExistingId() throws Exception {
        // Create the DanhSachTinhTrang with an existing ID
        danhSachTinhTrang.setId(1L);

        int databaseSizeBeforeCreate = danhSachTinhTrangRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restDanhSachTinhTrangMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(danhSachTinhTrang))
            )
            .andExpect(status().isBadRequest());

        // Validate the DanhSachTinhTrang in the database
        List<DanhSachTinhTrang> danhSachTinhTrangList = danhSachTinhTrangRepository.findAll();
        assertThat(danhSachTinhTrangList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllDanhSachTinhTrangs() throws Exception {
        // Initialize the database
        danhSachTinhTrangRepository.saveAndFlush(danhSachTinhTrang);

        // Get all the danhSachTinhTrangList
        restDanhSachTinhTrangMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(danhSachTinhTrang.getId().intValue())))
            .andExpect(jsonPath("$.[*].tenTinhTrangPhanLoai").value(hasItem(DEFAULT_TEN_TINH_TRANG_PHAN_LOAI)))
            .andExpect(jsonPath("$.[*].ngayTao").value(hasItem(sameInstant(DEFAULT_NGAY_TAO))))
            .andExpect(jsonPath("$.[*].ngayCapNhat").value(hasItem(sameInstant(DEFAULT_NGAY_CAP_NHAT))))
            .andExpect(jsonPath("$.[*].username").value(hasItem(DEFAULT_USERNAME)))
            .andExpect(jsonPath("$.[*].trangThai").value(hasItem(DEFAULT_TRANG_THAI)));
    }

    @Test
    @Transactional
    void getDanhSachTinhTrang() throws Exception {
        // Initialize the database
        danhSachTinhTrangRepository.saveAndFlush(danhSachTinhTrang);

        // Get the danhSachTinhTrang
        restDanhSachTinhTrangMockMvc
            .perform(get(ENTITY_API_URL_ID, danhSachTinhTrang.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(danhSachTinhTrang.getId().intValue()))
            .andExpect(jsonPath("$.tenTinhTrangPhanLoai").value(DEFAULT_TEN_TINH_TRANG_PHAN_LOAI))
            .andExpect(jsonPath("$.ngayTao").value(sameInstant(DEFAULT_NGAY_TAO)))
            .andExpect(jsonPath("$.ngayCapNhat").value(sameInstant(DEFAULT_NGAY_CAP_NHAT)))
            .andExpect(jsonPath("$.username").value(DEFAULT_USERNAME))
            .andExpect(jsonPath("$.trangThai").value(DEFAULT_TRANG_THAI));
    }

    @Test
    @Transactional
    void getNonExistingDanhSachTinhTrang() throws Exception {
        // Get the danhSachTinhTrang
        restDanhSachTinhTrangMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewDanhSachTinhTrang() throws Exception {
        // Initialize the database
        danhSachTinhTrangRepository.saveAndFlush(danhSachTinhTrang);

        int databaseSizeBeforeUpdate = danhSachTinhTrangRepository.findAll().size();

        // Update the danhSachTinhTrang
        DanhSachTinhTrang updatedDanhSachTinhTrang = danhSachTinhTrangRepository.findById(danhSachTinhTrang.getId()).get();
        // Disconnect from session so that the updates on updatedDanhSachTinhTrang are not directly saved in db
        em.detach(updatedDanhSachTinhTrang);
        updatedDanhSachTinhTrang
            .tenTinhTrangPhanLoai(UPDATED_TEN_TINH_TRANG_PHAN_LOAI)
            .ngayTao(UPDATED_NGAY_TAO)
            .ngayCapNhat(UPDATED_NGAY_CAP_NHAT)
            .username(UPDATED_USERNAME)
            .trangThai(UPDATED_TRANG_THAI);

        restDanhSachTinhTrangMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedDanhSachTinhTrang.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedDanhSachTinhTrang))
            )
            .andExpect(status().isOk());

        // Validate the DanhSachTinhTrang in the database
        List<DanhSachTinhTrang> danhSachTinhTrangList = danhSachTinhTrangRepository.findAll();
        assertThat(danhSachTinhTrangList).hasSize(databaseSizeBeforeUpdate);
        DanhSachTinhTrang testDanhSachTinhTrang = danhSachTinhTrangList.get(danhSachTinhTrangList.size() - 1);
        assertThat(testDanhSachTinhTrang.getTenTinhTrangPhanLoai()).isEqualTo(UPDATED_TEN_TINH_TRANG_PHAN_LOAI);
        assertThat(testDanhSachTinhTrang.getNgayTao()).isEqualTo(UPDATED_NGAY_TAO);
        assertThat(testDanhSachTinhTrang.getNgayCapNhat()).isEqualTo(UPDATED_NGAY_CAP_NHAT);
        assertThat(testDanhSachTinhTrang.getUsername()).isEqualTo(UPDATED_USERNAME);
        assertThat(testDanhSachTinhTrang.getTrangThai()).isEqualTo(UPDATED_TRANG_THAI);
    }

    @Test
    @Transactional
    void putNonExistingDanhSachTinhTrang() throws Exception {
        int databaseSizeBeforeUpdate = danhSachTinhTrangRepository.findAll().size();
        danhSachTinhTrang.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restDanhSachTinhTrangMockMvc
            .perform(
                put(ENTITY_API_URL_ID, danhSachTinhTrang.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(danhSachTinhTrang))
            )
            .andExpect(status().isBadRequest());

        // Validate the DanhSachTinhTrang in the database
        List<DanhSachTinhTrang> danhSachTinhTrangList = danhSachTinhTrangRepository.findAll();
        assertThat(danhSachTinhTrangList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchDanhSachTinhTrang() throws Exception {
        int databaseSizeBeforeUpdate = danhSachTinhTrangRepository.findAll().size();
        danhSachTinhTrang.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDanhSachTinhTrangMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(danhSachTinhTrang))
            )
            .andExpect(status().isBadRequest());

        // Validate the DanhSachTinhTrang in the database
        List<DanhSachTinhTrang> danhSachTinhTrangList = danhSachTinhTrangRepository.findAll();
        assertThat(danhSachTinhTrangList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamDanhSachTinhTrang() throws Exception {
        int databaseSizeBeforeUpdate = danhSachTinhTrangRepository.findAll().size();
        danhSachTinhTrang.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDanhSachTinhTrangMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(danhSachTinhTrang))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the DanhSachTinhTrang in the database
        List<DanhSachTinhTrang> danhSachTinhTrangList = danhSachTinhTrangRepository.findAll();
        assertThat(danhSachTinhTrangList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateDanhSachTinhTrangWithPatch() throws Exception {
        // Initialize the database
        danhSachTinhTrangRepository.saveAndFlush(danhSachTinhTrang);

        int databaseSizeBeforeUpdate = danhSachTinhTrangRepository.findAll().size();

        // Update the danhSachTinhTrang using partial update
        DanhSachTinhTrang partialUpdatedDanhSachTinhTrang = new DanhSachTinhTrang();
        partialUpdatedDanhSachTinhTrang.setId(danhSachTinhTrang.getId());

        partialUpdatedDanhSachTinhTrang.ngayTao(UPDATED_NGAY_TAO);

        restDanhSachTinhTrangMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedDanhSachTinhTrang.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedDanhSachTinhTrang))
            )
            .andExpect(status().isOk());

        // Validate the DanhSachTinhTrang in the database
        List<DanhSachTinhTrang> danhSachTinhTrangList = danhSachTinhTrangRepository.findAll();
        assertThat(danhSachTinhTrangList).hasSize(databaseSizeBeforeUpdate);
        DanhSachTinhTrang testDanhSachTinhTrang = danhSachTinhTrangList.get(danhSachTinhTrangList.size() - 1);
        assertThat(testDanhSachTinhTrang.getTenTinhTrangPhanLoai()).isEqualTo(DEFAULT_TEN_TINH_TRANG_PHAN_LOAI);
        assertThat(testDanhSachTinhTrang.getNgayTao()).isEqualTo(UPDATED_NGAY_TAO);
        assertThat(testDanhSachTinhTrang.getNgayCapNhat()).isEqualTo(DEFAULT_NGAY_CAP_NHAT);
        assertThat(testDanhSachTinhTrang.getUsername()).isEqualTo(DEFAULT_USERNAME);
        assertThat(testDanhSachTinhTrang.getTrangThai()).isEqualTo(DEFAULT_TRANG_THAI);
    }

    @Test
    @Transactional
    void fullUpdateDanhSachTinhTrangWithPatch() throws Exception {
        // Initialize the database
        danhSachTinhTrangRepository.saveAndFlush(danhSachTinhTrang);

        int databaseSizeBeforeUpdate = danhSachTinhTrangRepository.findAll().size();

        // Update the danhSachTinhTrang using partial update
        DanhSachTinhTrang partialUpdatedDanhSachTinhTrang = new DanhSachTinhTrang();
        partialUpdatedDanhSachTinhTrang.setId(danhSachTinhTrang.getId());

        partialUpdatedDanhSachTinhTrang
            .tenTinhTrangPhanLoai(UPDATED_TEN_TINH_TRANG_PHAN_LOAI)
            .ngayTao(UPDATED_NGAY_TAO)
            .ngayCapNhat(UPDATED_NGAY_CAP_NHAT)
            .username(UPDATED_USERNAME)
            .trangThai(UPDATED_TRANG_THAI);

        restDanhSachTinhTrangMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedDanhSachTinhTrang.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedDanhSachTinhTrang))
            )
            .andExpect(status().isOk());

        // Validate the DanhSachTinhTrang in the database
        List<DanhSachTinhTrang> danhSachTinhTrangList = danhSachTinhTrangRepository.findAll();
        assertThat(danhSachTinhTrangList).hasSize(databaseSizeBeforeUpdate);
        DanhSachTinhTrang testDanhSachTinhTrang = danhSachTinhTrangList.get(danhSachTinhTrangList.size() - 1);
        assertThat(testDanhSachTinhTrang.getTenTinhTrangPhanLoai()).isEqualTo(UPDATED_TEN_TINH_TRANG_PHAN_LOAI);
        assertThat(testDanhSachTinhTrang.getNgayTao()).isEqualTo(UPDATED_NGAY_TAO);
        assertThat(testDanhSachTinhTrang.getNgayCapNhat()).isEqualTo(UPDATED_NGAY_CAP_NHAT);
        assertThat(testDanhSachTinhTrang.getUsername()).isEqualTo(UPDATED_USERNAME);
        assertThat(testDanhSachTinhTrang.getTrangThai()).isEqualTo(UPDATED_TRANG_THAI);
    }

    @Test
    @Transactional
    void patchNonExistingDanhSachTinhTrang() throws Exception {
        int databaseSizeBeforeUpdate = danhSachTinhTrangRepository.findAll().size();
        danhSachTinhTrang.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restDanhSachTinhTrangMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, danhSachTinhTrang.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(danhSachTinhTrang))
            )
            .andExpect(status().isBadRequest());

        // Validate the DanhSachTinhTrang in the database
        List<DanhSachTinhTrang> danhSachTinhTrangList = danhSachTinhTrangRepository.findAll();
        assertThat(danhSachTinhTrangList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchDanhSachTinhTrang() throws Exception {
        int databaseSizeBeforeUpdate = danhSachTinhTrangRepository.findAll().size();
        danhSachTinhTrang.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDanhSachTinhTrangMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(danhSachTinhTrang))
            )
            .andExpect(status().isBadRequest());

        // Validate the DanhSachTinhTrang in the database
        List<DanhSachTinhTrang> danhSachTinhTrangList = danhSachTinhTrangRepository.findAll();
        assertThat(danhSachTinhTrangList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamDanhSachTinhTrang() throws Exception {
        int databaseSizeBeforeUpdate = danhSachTinhTrangRepository.findAll().size();
        danhSachTinhTrang.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDanhSachTinhTrangMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(danhSachTinhTrang))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the DanhSachTinhTrang in the database
        List<DanhSachTinhTrang> danhSachTinhTrangList = danhSachTinhTrangRepository.findAll();
        assertThat(danhSachTinhTrangList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteDanhSachTinhTrang() throws Exception {
        // Initialize the database
        danhSachTinhTrangRepository.saveAndFlush(danhSachTinhTrang);

        int databaseSizeBeforeDelete = danhSachTinhTrangRepository.findAll().size();

        // Delete the danhSachTinhTrang
        restDanhSachTinhTrangMockMvc
            .perform(delete(ENTITY_API_URL_ID, danhSachTinhTrang.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<DanhSachTinhTrang> danhSachTinhTrangList = danhSachTinhTrangRepository.findAll();
        assertThat(danhSachTinhTrangList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
