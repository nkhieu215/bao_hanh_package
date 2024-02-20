package com.mycompany.myapp.web.rest;

import static com.mycompany.myapp.web.rest.TestUtil.sameInstant;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.DonBaoHanh;
import com.mycompany.myapp.repository.DonBaoHanhRepository;
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
 * Integration tests for the {@link DonBaoHanhResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class DonBaoHanhResourceIT {

    private static final String DEFAULT_NGAY_TIEP_NHAN = "AAAAAAAAAA";
    private static final String UPDATED_NGAY_TIEP_NHAN = "BBBBBBBBBB";

    private static final String DEFAULT_TRANG_THAI = "AAAAAAAAAA";
    private static final String UPDATED_TRANG_THAI = "BBBBBBBBBB";

    private static final String DEFAULT_NHAN_VIEN_GIAO_HANG = "AAAAAAAAAA";
    private static final String UPDATED_NHAN_VIEN_GIAO_HANG = "BBBBBBBBBB";

    private static final ZonedDateTime DEFAULT_NGAYKHKB = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_NGAYKHKB = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final String DEFAULT_NGUOI_TAO_DON = "AAAAAAAAAA";
    private static final String UPDATED_NGUOI_TAO_DON = "BBBBBBBBBB";

    private static final Integer DEFAULT_SL_TIEP_NHAN = 1;
    private static final Integer UPDATED_SL_TIEP_NHAN = 2;

    private static final Integer DEFAULT_SL_DA_PHAN_TICH = 1;
    private static final Integer UPDATED_SL_DA_PHAN_TICH = 2;

    private static final String DEFAULT_GHI_CHU = "AAAAAAAAAA";
    private static final String UPDATED_GHI_CHU = "BBBBBBBBBB";

    private static final ZonedDateTime DEFAULT_NGAY_TRA_BIEN_BAN = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_NGAY_TRA_BIEN_BAN = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final String ENTITY_API_URL = "/api/don-bao-hanhs";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private DonBaoHanhRepository donBaoHanhRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restDonBaoHanhMockMvc;

    private DonBaoHanh donBaoHanh;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static DonBaoHanh createEntity(EntityManager em) {
        DonBaoHanh donBaoHanh = new DonBaoHanh()
            .ngayTiepNhan(DEFAULT_NGAY_TIEP_NHAN)
            .trangThai(DEFAULT_TRANG_THAI)
            .nhanVienGiaoHang(DEFAULT_NHAN_VIEN_GIAO_HANG)
            .ngaykhkb(DEFAULT_NGAYKHKB)
            .nguoiTaoDon(DEFAULT_NGUOI_TAO_DON)
            .slTiepNhan(DEFAULT_SL_TIEP_NHAN)
            .slDaPhanTich(DEFAULT_SL_DA_PHAN_TICH)
            .ghiChu(DEFAULT_GHI_CHU)
            .ngayTraBienBan(DEFAULT_NGAY_TRA_BIEN_BAN);
        return donBaoHanh;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static DonBaoHanh createUpdatedEntity(EntityManager em) {
        DonBaoHanh donBaoHanh = new DonBaoHanh()
            .ngayTiepNhan(UPDATED_NGAY_TIEP_NHAN)
            .trangThai(UPDATED_TRANG_THAI)
            .nhanVienGiaoHang(UPDATED_NHAN_VIEN_GIAO_HANG)
            .ngaykhkb(UPDATED_NGAYKHKB)
            .nguoiTaoDon(UPDATED_NGUOI_TAO_DON)
            .slTiepNhan(UPDATED_SL_TIEP_NHAN)
            .slDaPhanTich(UPDATED_SL_DA_PHAN_TICH)
            .ghiChu(UPDATED_GHI_CHU)
            .ngayTraBienBan(UPDATED_NGAY_TRA_BIEN_BAN);
        return donBaoHanh;
    }

    @BeforeEach
    public void initTest() {
        donBaoHanh = createEntity(em);
    }

    @Test
    @Transactional
    void createDonBaoHanh() throws Exception {
        int databaseSizeBeforeCreate = donBaoHanhRepository.findAll().size();
        // Create the DonBaoHanh
        restDonBaoHanhMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(donBaoHanh))
            )
            .andExpect(status().isCreated());

        // Validate the DonBaoHanh in the database
        List<DonBaoHanh> donBaoHanhList = donBaoHanhRepository.findAll();
        assertThat(donBaoHanhList).hasSize(databaseSizeBeforeCreate + 1);
        DonBaoHanh testDonBaoHanh = donBaoHanhList.get(donBaoHanhList.size() - 1);
        assertThat(testDonBaoHanh.getNgayTiepNhan()).isEqualTo(DEFAULT_NGAY_TIEP_NHAN);
        assertThat(testDonBaoHanh.getTrangThai()).isEqualTo(DEFAULT_TRANG_THAI);
        assertThat(testDonBaoHanh.getNhanVienGiaoHang()).isEqualTo(DEFAULT_NHAN_VIEN_GIAO_HANG);
        assertThat(testDonBaoHanh.getNgaykhkb()).isEqualTo(DEFAULT_NGAYKHKB);
        assertThat(testDonBaoHanh.getNguoiTaoDon()).isEqualTo(DEFAULT_NGUOI_TAO_DON);
        assertThat(testDonBaoHanh.getSlTiepNhan()).isEqualTo(DEFAULT_SL_TIEP_NHAN);
        assertThat(testDonBaoHanh.getSlDaPhanTich()).isEqualTo(DEFAULT_SL_DA_PHAN_TICH);
        assertThat(testDonBaoHanh.getGhiChu()).isEqualTo(DEFAULT_GHI_CHU);
        assertThat(testDonBaoHanh.getNgayTraBienBan()).isEqualTo(DEFAULT_NGAY_TRA_BIEN_BAN);
    }

    @Test
    @Transactional
    void createDonBaoHanhWithExistingId() throws Exception {
        // Create the DonBaoHanh with an existing ID
        donBaoHanh.setId(1L);

        int databaseSizeBeforeCreate = donBaoHanhRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restDonBaoHanhMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(donBaoHanh))
            )
            .andExpect(status().isBadRequest());

        // Validate the DonBaoHanh in the database
        List<DonBaoHanh> donBaoHanhList = donBaoHanhRepository.findAll();
        assertThat(donBaoHanhList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllDonBaoHanhs() throws Exception {
        // Initialize the database
        donBaoHanhRepository.saveAndFlush(donBaoHanh);

        // Get all the donBaoHanhList
        restDonBaoHanhMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(donBaoHanh.getId().intValue())))
            .andExpect(jsonPath("$.[*].ngayTiepNhan").value(hasItem(DEFAULT_NGAY_TIEP_NHAN)))
            .andExpect(jsonPath("$.[*].trangThai").value(hasItem(DEFAULT_TRANG_THAI)))
            .andExpect(jsonPath("$.[*].nhanVienGiaoHang").value(hasItem(DEFAULT_NHAN_VIEN_GIAO_HANG)))
            .andExpect(jsonPath("$.[*].ngaykhkb").value(hasItem(sameInstant(DEFAULT_NGAYKHKB))))
            .andExpect(jsonPath("$.[*].nguoiTaoDon").value(hasItem(DEFAULT_NGUOI_TAO_DON)))
            .andExpect(jsonPath("$.[*].slTiepNhan").value(hasItem(DEFAULT_SL_TIEP_NHAN)))
            .andExpect(jsonPath("$.[*].slDaPhanTich").value(hasItem(DEFAULT_SL_DA_PHAN_TICH)))
            .andExpect(jsonPath("$.[*].ghiChu").value(hasItem(DEFAULT_GHI_CHU)))
            .andExpect(jsonPath("$.[*].ngayTraBienBan").value(hasItem(sameInstant(DEFAULT_NGAY_TRA_BIEN_BAN))));
    }

    @Test
    @Transactional
    void getDonBaoHanh() throws Exception {
        // Initialize the database
        donBaoHanhRepository.saveAndFlush(donBaoHanh);

        // Get the donBaoHanh
        restDonBaoHanhMockMvc
            .perform(get(ENTITY_API_URL_ID, donBaoHanh.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(donBaoHanh.getId().intValue()))
            .andExpect(jsonPath("$.ngayTiepNhan").value(DEFAULT_NGAY_TIEP_NHAN))
            .andExpect(jsonPath("$.trangThai").value(DEFAULT_TRANG_THAI))
            .andExpect(jsonPath("$.nhanVienGiaoHang").value(DEFAULT_NHAN_VIEN_GIAO_HANG))
            .andExpect(jsonPath("$.ngaykhkb").value(sameInstant(DEFAULT_NGAYKHKB)))
            .andExpect(jsonPath("$.nguoiTaoDon").value(DEFAULT_NGUOI_TAO_DON))
            .andExpect(jsonPath("$.slTiepNhan").value(DEFAULT_SL_TIEP_NHAN))
            .andExpect(jsonPath("$.slDaPhanTich").value(DEFAULT_SL_DA_PHAN_TICH))
            .andExpect(jsonPath("$.ghiChu").value(DEFAULT_GHI_CHU))
            .andExpect(jsonPath("$.ngayTraBienBan").value(sameInstant(DEFAULT_NGAY_TRA_BIEN_BAN)));
    }

    @Test
    @Transactional
    void getNonExistingDonBaoHanh() throws Exception {
        // Get the donBaoHanh
        restDonBaoHanhMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewDonBaoHanh() throws Exception {
        // Initialize the database
        donBaoHanhRepository.saveAndFlush(donBaoHanh);

        int databaseSizeBeforeUpdate = donBaoHanhRepository.findAll().size();

        // Update the donBaoHanh
        DonBaoHanh updatedDonBaoHanh = donBaoHanhRepository.findById(donBaoHanh.getId()).get();
        // Disconnect from session so that the updates on updatedDonBaoHanh are not directly saved in db
        em.detach(updatedDonBaoHanh);
        updatedDonBaoHanh
            .ngayTiepNhan(UPDATED_NGAY_TIEP_NHAN)
            .trangThai(UPDATED_TRANG_THAI)
            .nhanVienGiaoHang(UPDATED_NHAN_VIEN_GIAO_HANG)
            .ngaykhkb(UPDATED_NGAYKHKB)
            .nguoiTaoDon(UPDATED_NGUOI_TAO_DON)
            .slTiepNhan(UPDATED_SL_TIEP_NHAN)
            .slDaPhanTich(UPDATED_SL_DA_PHAN_TICH)
            .ghiChu(UPDATED_GHI_CHU)
            .ngayTraBienBan(UPDATED_NGAY_TRA_BIEN_BAN);

        restDonBaoHanhMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedDonBaoHanh.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedDonBaoHanh))
            )
            .andExpect(status().isOk());

        // Validate the DonBaoHanh in the database
        List<DonBaoHanh> donBaoHanhList = donBaoHanhRepository.findAll();
        assertThat(donBaoHanhList).hasSize(databaseSizeBeforeUpdate);
        DonBaoHanh testDonBaoHanh = donBaoHanhList.get(donBaoHanhList.size() - 1);
        assertThat(testDonBaoHanh.getNgayTiepNhan()).isEqualTo(UPDATED_NGAY_TIEP_NHAN);
        assertThat(testDonBaoHanh.getTrangThai()).isEqualTo(UPDATED_TRANG_THAI);
        assertThat(testDonBaoHanh.getNhanVienGiaoHang()).isEqualTo(UPDATED_NHAN_VIEN_GIAO_HANG);
        assertThat(testDonBaoHanh.getNgaykhkb()).isEqualTo(UPDATED_NGAYKHKB);
        assertThat(testDonBaoHanh.getNguoiTaoDon()).isEqualTo(UPDATED_NGUOI_TAO_DON);
        assertThat(testDonBaoHanh.getSlTiepNhan()).isEqualTo(UPDATED_SL_TIEP_NHAN);
        assertThat(testDonBaoHanh.getSlDaPhanTich()).isEqualTo(UPDATED_SL_DA_PHAN_TICH);
        assertThat(testDonBaoHanh.getGhiChu()).isEqualTo(UPDATED_GHI_CHU);
        assertThat(testDonBaoHanh.getNgayTraBienBan()).isEqualTo(UPDATED_NGAY_TRA_BIEN_BAN);
    }

    @Test
    @Transactional
    void putNonExistingDonBaoHanh() throws Exception {
        int databaseSizeBeforeUpdate = donBaoHanhRepository.findAll().size();
        donBaoHanh.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restDonBaoHanhMockMvc
            .perform(
                put(ENTITY_API_URL_ID, donBaoHanh.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(donBaoHanh))
            )
            .andExpect(status().isBadRequest());

        // Validate the DonBaoHanh in the database
        List<DonBaoHanh> donBaoHanhList = donBaoHanhRepository.findAll();
        assertThat(donBaoHanhList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchDonBaoHanh() throws Exception {
        int databaseSizeBeforeUpdate = donBaoHanhRepository.findAll().size();
        donBaoHanh.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDonBaoHanhMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(donBaoHanh))
            )
            .andExpect(status().isBadRequest());

        // Validate the DonBaoHanh in the database
        List<DonBaoHanh> donBaoHanhList = donBaoHanhRepository.findAll();
        assertThat(donBaoHanhList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamDonBaoHanh() throws Exception {
        int databaseSizeBeforeUpdate = donBaoHanhRepository.findAll().size();
        donBaoHanh.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDonBaoHanhMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(donBaoHanh))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the DonBaoHanh in the database
        List<DonBaoHanh> donBaoHanhList = donBaoHanhRepository.findAll();
        assertThat(donBaoHanhList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateDonBaoHanhWithPatch() throws Exception {
        // Initialize the database
        donBaoHanhRepository.saveAndFlush(donBaoHanh);

        int databaseSizeBeforeUpdate = donBaoHanhRepository.findAll().size();

        // Update the donBaoHanh using partial update
        DonBaoHanh partialUpdatedDonBaoHanh = new DonBaoHanh();
        partialUpdatedDonBaoHanh.setId(donBaoHanh.getId());

        partialUpdatedDonBaoHanh
            .trangThai(UPDATED_TRANG_THAI)
            .ngaykhkb(UPDATED_NGAYKHKB)
            .nguoiTaoDon(UPDATED_NGUOI_TAO_DON)
            .ghiChu(UPDATED_GHI_CHU);

        restDonBaoHanhMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedDonBaoHanh.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedDonBaoHanh))
            )
            .andExpect(status().isOk());

        // Validate the DonBaoHanh in the database
        List<DonBaoHanh> donBaoHanhList = donBaoHanhRepository.findAll();
        assertThat(donBaoHanhList).hasSize(databaseSizeBeforeUpdate);
        DonBaoHanh testDonBaoHanh = donBaoHanhList.get(donBaoHanhList.size() - 1);
        assertThat(testDonBaoHanh.getNgayTiepNhan()).isEqualTo(DEFAULT_NGAY_TIEP_NHAN);
        assertThat(testDonBaoHanh.getTrangThai()).isEqualTo(UPDATED_TRANG_THAI);
        assertThat(testDonBaoHanh.getNhanVienGiaoHang()).isEqualTo(DEFAULT_NHAN_VIEN_GIAO_HANG);
        assertThat(testDonBaoHanh.getNgaykhkb()).isEqualTo(UPDATED_NGAYKHKB);
        assertThat(testDonBaoHanh.getNguoiTaoDon()).isEqualTo(UPDATED_NGUOI_TAO_DON);
        assertThat(testDonBaoHanh.getSlTiepNhan()).isEqualTo(DEFAULT_SL_TIEP_NHAN);
        assertThat(testDonBaoHanh.getSlDaPhanTich()).isEqualTo(DEFAULT_SL_DA_PHAN_TICH);
        assertThat(testDonBaoHanh.getGhiChu()).isEqualTo(UPDATED_GHI_CHU);
        assertThat(testDonBaoHanh.getNgayTraBienBan()).isEqualTo(DEFAULT_NGAY_TRA_BIEN_BAN);
    }

    @Test
    @Transactional
    void fullUpdateDonBaoHanhWithPatch() throws Exception {
        // Initialize the database
        donBaoHanhRepository.saveAndFlush(donBaoHanh);

        int databaseSizeBeforeUpdate = donBaoHanhRepository.findAll().size();

        // Update the donBaoHanh using partial update
        DonBaoHanh partialUpdatedDonBaoHanh = new DonBaoHanh();
        partialUpdatedDonBaoHanh.setId(donBaoHanh.getId());

        partialUpdatedDonBaoHanh
            .ngayTiepNhan(UPDATED_NGAY_TIEP_NHAN)
            .trangThai(UPDATED_TRANG_THAI)
            .nhanVienGiaoHang(UPDATED_NHAN_VIEN_GIAO_HANG)
            .ngaykhkb(UPDATED_NGAYKHKB)
            .nguoiTaoDon(UPDATED_NGUOI_TAO_DON)
            .slTiepNhan(UPDATED_SL_TIEP_NHAN)
            .slDaPhanTich(UPDATED_SL_DA_PHAN_TICH)
            .ghiChu(UPDATED_GHI_CHU)
            .ngayTraBienBan(UPDATED_NGAY_TRA_BIEN_BAN);

        restDonBaoHanhMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedDonBaoHanh.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedDonBaoHanh))
            )
            .andExpect(status().isOk());

        // Validate the DonBaoHanh in the database
        List<DonBaoHanh> donBaoHanhList = donBaoHanhRepository.findAll();
        assertThat(donBaoHanhList).hasSize(databaseSizeBeforeUpdate);
        DonBaoHanh testDonBaoHanh = donBaoHanhList.get(donBaoHanhList.size() - 1);
        assertThat(testDonBaoHanh.getNgayTiepNhan()).isEqualTo(UPDATED_NGAY_TIEP_NHAN);
        assertThat(testDonBaoHanh.getTrangThai()).isEqualTo(UPDATED_TRANG_THAI);
        assertThat(testDonBaoHanh.getNhanVienGiaoHang()).isEqualTo(UPDATED_NHAN_VIEN_GIAO_HANG);
        assertThat(testDonBaoHanh.getNgaykhkb()).isEqualTo(UPDATED_NGAYKHKB);
        assertThat(testDonBaoHanh.getNguoiTaoDon()).isEqualTo(UPDATED_NGUOI_TAO_DON);
        assertThat(testDonBaoHanh.getSlTiepNhan()).isEqualTo(UPDATED_SL_TIEP_NHAN);
        assertThat(testDonBaoHanh.getSlDaPhanTich()).isEqualTo(UPDATED_SL_DA_PHAN_TICH);
        assertThat(testDonBaoHanh.getGhiChu()).isEqualTo(UPDATED_GHI_CHU);
        assertThat(testDonBaoHanh.getNgayTraBienBan()).isEqualTo(UPDATED_NGAY_TRA_BIEN_BAN);
    }

    @Test
    @Transactional
    void patchNonExistingDonBaoHanh() throws Exception {
        int databaseSizeBeforeUpdate = donBaoHanhRepository.findAll().size();
        donBaoHanh.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restDonBaoHanhMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, donBaoHanh.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(donBaoHanh))
            )
            .andExpect(status().isBadRequest());

        // Validate the DonBaoHanh in the database
        List<DonBaoHanh> donBaoHanhList = donBaoHanhRepository.findAll();
        assertThat(donBaoHanhList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchDonBaoHanh() throws Exception {
        int databaseSizeBeforeUpdate = donBaoHanhRepository.findAll().size();
        donBaoHanh.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDonBaoHanhMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(donBaoHanh))
            )
            .andExpect(status().isBadRequest());

        // Validate the DonBaoHanh in the database
        List<DonBaoHanh> donBaoHanhList = donBaoHanhRepository.findAll();
        assertThat(donBaoHanhList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamDonBaoHanh() throws Exception {
        int databaseSizeBeforeUpdate = donBaoHanhRepository.findAll().size();
        donBaoHanh.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDonBaoHanhMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(donBaoHanh))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the DonBaoHanh in the database
        List<DonBaoHanh> donBaoHanhList = donBaoHanhRepository.findAll();
        assertThat(donBaoHanhList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteDonBaoHanh() throws Exception {
        // Initialize the database
        donBaoHanhRepository.saveAndFlush(donBaoHanh);

        int databaseSizeBeforeDelete = donBaoHanhRepository.findAll().size();

        // Delete the donBaoHanh
        restDonBaoHanhMockMvc
            .perform(delete(ENTITY_API_URL_ID, donBaoHanh.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<DonBaoHanh> donBaoHanhList = donBaoHanhRepository.findAll();
        assertThat(donBaoHanhList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
