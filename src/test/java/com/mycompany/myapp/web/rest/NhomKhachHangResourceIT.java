package com.mycompany.myapp.web.rest;

import static com.mycompany.myapp.web.rest.TestUtil.sameInstant;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.NhomKhachHang;
import com.mycompany.myapp.repository.NhomKhachHangRepository;
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
 * Integration tests for the {@link NhomKhachHangResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class NhomKhachHangResourceIT {

    private static final String DEFAULT_TEN_NHOM_KHACH_HANG = "AAAAAAAAAA";
    private static final String UPDATED_TEN_NHOM_KHACH_HANG = "BBBBBBBBBB";

    private static final ZonedDateTime DEFAULT_NGAY_TAO = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_NGAY_TAO = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final ZonedDateTime DEFAULT_NGAY_CAP_NHAT = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_NGAY_CAP_NHAT = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final String DEFAULT_USERNAME = "AAAAAAAAAA";
    private static final String UPDATED_USERNAME = "BBBBBBBBBB";

    private static final String DEFAULT_TRANG_THAI = "AAAAAAAAAA";
    private static final String UPDATED_TRANG_THAI = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/nhom-khach-hangs";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private NhomKhachHangRepository nhomKhachHangRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restNhomKhachHangMockMvc;

    private NhomKhachHang nhomKhachHang;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static NhomKhachHang createEntity(EntityManager em) {
        NhomKhachHang nhomKhachHang = new NhomKhachHang()
            .tenNhomKhachHang(DEFAULT_TEN_NHOM_KHACH_HANG)
            .ngayTao(DEFAULT_NGAY_TAO)
            .ngayCapNhat(DEFAULT_NGAY_CAP_NHAT)
            .username(DEFAULT_USERNAME)
            .trangThai(DEFAULT_TRANG_THAI);
        return nhomKhachHang;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static NhomKhachHang createUpdatedEntity(EntityManager em) {
        NhomKhachHang nhomKhachHang = new NhomKhachHang()
            .tenNhomKhachHang(UPDATED_TEN_NHOM_KHACH_HANG)
            .ngayTao(UPDATED_NGAY_TAO)
            .ngayCapNhat(UPDATED_NGAY_CAP_NHAT)
            .username(UPDATED_USERNAME)
            .trangThai(UPDATED_TRANG_THAI);
        return nhomKhachHang;
    }

    @BeforeEach
    public void initTest() {
        nhomKhachHang = createEntity(em);
    }

    @Test
    @Transactional
    void createNhomKhachHang() throws Exception {
        int databaseSizeBeforeCreate = nhomKhachHangRepository.findAll().size();
        // Create the NhomKhachHang
        restNhomKhachHangMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(nhomKhachHang))
            )
            .andExpect(status().isCreated());

        // Validate the NhomKhachHang in the database
        List<NhomKhachHang> nhomKhachHangList = nhomKhachHangRepository.findAll();
        assertThat(nhomKhachHangList).hasSize(databaseSizeBeforeCreate + 1);
        NhomKhachHang testNhomKhachHang = nhomKhachHangList.get(nhomKhachHangList.size() - 1);
        assertThat(testNhomKhachHang.getTenNhomKhachHang()).isEqualTo(DEFAULT_TEN_NHOM_KHACH_HANG);
        assertThat(testNhomKhachHang.getNgayTao()).isEqualTo(DEFAULT_NGAY_TAO);
        assertThat(testNhomKhachHang.getNgayCapNhat()).isEqualTo(DEFAULT_NGAY_CAP_NHAT);
        assertThat(testNhomKhachHang.getUsername()).isEqualTo(DEFAULT_USERNAME);
        assertThat(testNhomKhachHang.getTrangThai()).isEqualTo(DEFAULT_TRANG_THAI);
    }

    @Test
    @Transactional
    void createNhomKhachHangWithExistingId() throws Exception {
        // Create the NhomKhachHang with an existing ID
        nhomKhachHang.setId(1L);

        int databaseSizeBeforeCreate = nhomKhachHangRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restNhomKhachHangMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(nhomKhachHang))
            )
            .andExpect(status().isBadRequest());

        // Validate the NhomKhachHang in the database
        List<NhomKhachHang> nhomKhachHangList = nhomKhachHangRepository.findAll();
        assertThat(nhomKhachHangList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllNhomKhachHangs() throws Exception {
        // Initialize the database
        nhomKhachHangRepository.saveAndFlush(nhomKhachHang);

        // Get all the nhomKhachHangList
        restNhomKhachHangMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(nhomKhachHang.getId().intValue())))
            .andExpect(jsonPath("$.[*].tenNhomKhachHang").value(hasItem(DEFAULT_TEN_NHOM_KHACH_HANG)))
            .andExpect(jsonPath("$.[*].ngayTao").value(hasItem(sameInstant(DEFAULT_NGAY_TAO))))
            .andExpect(jsonPath("$.[*].ngayCapNhat").value(hasItem(sameInstant(DEFAULT_NGAY_CAP_NHAT))))
            .andExpect(jsonPath("$.[*].username").value(hasItem(DEFAULT_USERNAME)))
            .andExpect(jsonPath("$.[*].trangThai").value(hasItem(DEFAULT_TRANG_THAI)));
    }

    @Test
    @Transactional
    void getNhomKhachHang() throws Exception {
        // Initialize the database
        nhomKhachHangRepository.saveAndFlush(nhomKhachHang);

        // Get the nhomKhachHang
        restNhomKhachHangMockMvc
            .perform(get(ENTITY_API_URL_ID, nhomKhachHang.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(nhomKhachHang.getId().intValue()))
            .andExpect(jsonPath("$.tenNhomKhachHang").value(DEFAULT_TEN_NHOM_KHACH_HANG))
            .andExpect(jsonPath("$.ngayTao").value(sameInstant(DEFAULT_NGAY_TAO)))
            .andExpect(jsonPath("$.ngayCapNhat").value(sameInstant(DEFAULT_NGAY_CAP_NHAT)))
            .andExpect(jsonPath("$.username").value(DEFAULT_USERNAME))
            .andExpect(jsonPath("$.trangThai").value(DEFAULT_TRANG_THAI));
    }

    @Test
    @Transactional
    void getNonExistingNhomKhachHang() throws Exception {
        // Get the nhomKhachHang
        restNhomKhachHangMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewNhomKhachHang() throws Exception {
        // Initialize the database
        nhomKhachHangRepository.saveAndFlush(nhomKhachHang);

        int databaseSizeBeforeUpdate = nhomKhachHangRepository.findAll().size();

        // Update the nhomKhachHang
        NhomKhachHang updatedNhomKhachHang = nhomKhachHangRepository.findById(nhomKhachHang.getId()).get();
        // Disconnect from session so that the updates on updatedNhomKhachHang are not directly saved in db
        em.detach(updatedNhomKhachHang);
        updatedNhomKhachHang
            .tenNhomKhachHang(UPDATED_TEN_NHOM_KHACH_HANG)
            .ngayTao(UPDATED_NGAY_TAO)
            .ngayCapNhat(UPDATED_NGAY_CAP_NHAT)
            .username(UPDATED_USERNAME)
            .trangThai(UPDATED_TRANG_THAI);

        restNhomKhachHangMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedNhomKhachHang.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedNhomKhachHang))
            )
            .andExpect(status().isOk());

        // Validate the NhomKhachHang in the database
        List<NhomKhachHang> nhomKhachHangList = nhomKhachHangRepository.findAll();
        assertThat(nhomKhachHangList).hasSize(databaseSizeBeforeUpdate);
        NhomKhachHang testNhomKhachHang = nhomKhachHangList.get(nhomKhachHangList.size() - 1);
        assertThat(testNhomKhachHang.getTenNhomKhachHang()).isEqualTo(UPDATED_TEN_NHOM_KHACH_HANG);
        assertThat(testNhomKhachHang.getNgayTao()).isEqualTo(UPDATED_NGAY_TAO);
        assertThat(testNhomKhachHang.getNgayCapNhat()).isEqualTo(UPDATED_NGAY_CAP_NHAT);
        assertThat(testNhomKhachHang.getUsername()).isEqualTo(UPDATED_USERNAME);
        assertThat(testNhomKhachHang.getTrangThai()).isEqualTo(UPDATED_TRANG_THAI);
    }

    @Test
    @Transactional
    void putNonExistingNhomKhachHang() throws Exception {
        int databaseSizeBeforeUpdate = nhomKhachHangRepository.findAll().size();
        nhomKhachHang.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restNhomKhachHangMockMvc
            .perform(
                put(ENTITY_API_URL_ID, nhomKhachHang.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(nhomKhachHang))
            )
            .andExpect(status().isBadRequest());

        // Validate the NhomKhachHang in the database
        List<NhomKhachHang> nhomKhachHangList = nhomKhachHangRepository.findAll();
        assertThat(nhomKhachHangList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchNhomKhachHang() throws Exception {
        int databaseSizeBeforeUpdate = nhomKhachHangRepository.findAll().size();
        nhomKhachHang.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restNhomKhachHangMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(nhomKhachHang))
            )
            .andExpect(status().isBadRequest());

        // Validate the NhomKhachHang in the database
        List<NhomKhachHang> nhomKhachHangList = nhomKhachHangRepository.findAll();
        assertThat(nhomKhachHangList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamNhomKhachHang() throws Exception {
        int databaseSizeBeforeUpdate = nhomKhachHangRepository.findAll().size();
        nhomKhachHang.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restNhomKhachHangMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(nhomKhachHang))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the NhomKhachHang in the database
        List<NhomKhachHang> nhomKhachHangList = nhomKhachHangRepository.findAll();
        assertThat(nhomKhachHangList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateNhomKhachHangWithPatch() throws Exception {
        // Initialize the database
        nhomKhachHangRepository.saveAndFlush(nhomKhachHang);

        int databaseSizeBeforeUpdate = nhomKhachHangRepository.findAll().size();

        // Update the nhomKhachHang using partial update
        NhomKhachHang partialUpdatedNhomKhachHang = new NhomKhachHang();
        partialUpdatedNhomKhachHang.setId(nhomKhachHang.getId());

        partialUpdatedNhomKhachHang
            .tenNhomKhachHang(UPDATED_TEN_NHOM_KHACH_HANG)
            .ngayTao(UPDATED_NGAY_TAO)
            .ngayCapNhat(UPDATED_NGAY_CAP_NHAT)
            .trangThai(UPDATED_TRANG_THAI);

        restNhomKhachHangMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedNhomKhachHang.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedNhomKhachHang))
            )
            .andExpect(status().isOk());

        // Validate the NhomKhachHang in the database
        List<NhomKhachHang> nhomKhachHangList = nhomKhachHangRepository.findAll();
        assertThat(nhomKhachHangList).hasSize(databaseSizeBeforeUpdate);
        NhomKhachHang testNhomKhachHang = nhomKhachHangList.get(nhomKhachHangList.size() - 1);
        assertThat(testNhomKhachHang.getTenNhomKhachHang()).isEqualTo(UPDATED_TEN_NHOM_KHACH_HANG);
        assertThat(testNhomKhachHang.getNgayTao()).isEqualTo(UPDATED_NGAY_TAO);
        assertThat(testNhomKhachHang.getNgayCapNhat()).isEqualTo(UPDATED_NGAY_CAP_NHAT);
        assertThat(testNhomKhachHang.getUsername()).isEqualTo(DEFAULT_USERNAME);
        assertThat(testNhomKhachHang.getTrangThai()).isEqualTo(UPDATED_TRANG_THAI);
    }

    @Test
    @Transactional
    void fullUpdateNhomKhachHangWithPatch() throws Exception {
        // Initialize the database
        nhomKhachHangRepository.saveAndFlush(nhomKhachHang);

        int databaseSizeBeforeUpdate = nhomKhachHangRepository.findAll().size();

        // Update the nhomKhachHang using partial update
        NhomKhachHang partialUpdatedNhomKhachHang = new NhomKhachHang();
        partialUpdatedNhomKhachHang.setId(nhomKhachHang.getId());

        partialUpdatedNhomKhachHang
            .tenNhomKhachHang(UPDATED_TEN_NHOM_KHACH_HANG)
            .ngayTao(UPDATED_NGAY_TAO)
            .ngayCapNhat(UPDATED_NGAY_CAP_NHAT)
            .username(UPDATED_USERNAME)
            .trangThai(UPDATED_TRANG_THAI);

        restNhomKhachHangMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedNhomKhachHang.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedNhomKhachHang))
            )
            .andExpect(status().isOk());

        // Validate the NhomKhachHang in the database
        List<NhomKhachHang> nhomKhachHangList = nhomKhachHangRepository.findAll();
        assertThat(nhomKhachHangList).hasSize(databaseSizeBeforeUpdate);
        NhomKhachHang testNhomKhachHang = nhomKhachHangList.get(nhomKhachHangList.size() - 1);
        assertThat(testNhomKhachHang.getTenNhomKhachHang()).isEqualTo(UPDATED_TEN_NHOM_KHACH_HANG);
        assertThat(testNhomKhachHang.getNgayTao()).isEqualTo(UPDATED_NGAY_TAO);
        assertThat(testNhomKhachHang.getNgayCapNhat()).isEqualTo(UPDATED_NGAY_CAP_NHAT);
        assertThat(testNhomKhachHang.getUsername()).isEqualTo(UPDATED_USERNAME);
        assertThat(testNhomKhachHang.getTrangThai()).isEqualTo(UPDATED_TRANG_THAI);
    }

    @Test
    @Transactional
    void patchNonExistingNhomKhachHang() throws Exception {
        int databaseSizeBeforeUpdate = nhomKhachHangRepository.findAll().size();
        nhomKhachHang.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restNhomKhachHangMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, nhomKhachHang.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(nhomKhachHang))
            )
            .andExpect(status().isBadRequest());

        // Validate the NhomKhachHang in the database
        List<NhomKhachHang> nhomKhachHangList = nhomKhachHangRepository.findAll();
        assertThat(nhomKhachHangList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchNhomKhachHang() throws Exception {
        int databaseSizeBeforeUpdate = nhomKhachHangRepository.findAll().size();
        nhomKhachHang.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restNhomKhachHangMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(nhomKhachHang))
            )
            .andExpect(status().isBadRequest());

        // Validate the NhomKhachHang in the database
        List<NhomKhachHang> nhomKhachHangList = nhomKhachHangRepository.findAll();
        assertThat(nhomKhachHangList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamNhomKhachHang() throws Exception {
        int databaseSizeBeforeUpdate = nhomKhachHangRepository.findAll().size();
        nhomKhachHang.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restNhomKhachHangMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(nhomKhachHang))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the NhomKhachHang in the database
        List<NhomKhachHang> nhomKhachHangList = nhomKhachHangRepository.findAll();
        assertThat(nhomKhachHangList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteNhomKhachHang() throws Exception {
        // Initialize the database
        nhomKhachHangRepository.saveAndFlush(nhomKhachHang);

        int databaseSizeBeforeDelete = nhomKhachHangRepository.findAll().size();

        // Delete the nhomKhachHang
        restNhomKhachHangMockMvc
            .perform(delete(ENTITY_API_URL_ID, nhomKhachHang.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<NhomKhachHang> nhomKhachHangList = nhomKhachHangRepository.findAll();
        assertThat(nhomKhachHangList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
