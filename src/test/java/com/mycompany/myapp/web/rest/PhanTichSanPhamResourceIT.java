package com.mycompany.myapp.web.rest;

import static com.mycompany.myapp.web.rest.TestUtil.sameInstant;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.PhanTichSanPham;
import com.mycompany.myapp.repository.PhanTichSanPhamRepository;
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
 * Integration tests for the {@link PhanTichSanPhamResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class PhanTichSanPhamResourceIT {

    private static final String DEFAULT_TEN_NHAN_VIEN_PHAN_TICH = "AAAAAAAAAA";
    private static final String UPDATED_TEN_NHAN_VIEN_PHAN_TICH = "BBBBBBBBBB";

    private static final String DEFAULT_THE_LOAI_PHAN_TICH = "AAAAAAAAAA";
    private static final String UPDATED_THE_LOAI_PHAN_TICH = "BBBBBBBBBB";

    private static final String DEFAULT_LOT_NUMBER = "AAAAAAAAAA";
    private static final String UPDATED_LOT_NUMBER = "BBBBBBBBBB";

    private static final String DEFAULT_DETAIL = "AAAAAAAAAA";
    private static final String UPDATED_DETAIL = "BBBBBBBBBB";

    private static final Integer DEFAULT_SO_LUONG = 1;
    private static final Integer UPDATED_SO_LUONG = 2;

    private static final ZonedDateTime DEFAULT_NGAY_KIEM_TRA = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_NGAY_KIEM_TRA = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final String DEFAULT_USERNAME = "AAAAAAAAAA";
    private static final String UPDATED_USERNAME = "BBBBBBBBBB";

    private static final String DEFAULT_NAM_SAN_XUAT = "AAAAAAAAAA";
    private static final String UPDATED_NAM_SAN_XUAT = "BBBBBBBBBB";

    private static final String DEFAULT_TRANG_THAI = "AAAAAAAAAA";
    private static final String UPDATED_TRANG_THAI = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/phan-tich-san-phams";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private PhanTichSanPhamRepository phanTichSanPhamRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restPhanTichSanPhamMockMvc;

    private PhanTichSanPham phanTichSanPham;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static PhanTichSanPham createEntity(EntityManager em) {
        PhanTichSanPham phanTichSanPham = new PhanTichSanPham()
            .tenNhanVienPhanTich(DEFAULT_TEN_NHAN_VIEN_PHAN_TICH)
            .theLoaiPhanTich(DEFAULT_THE_LOAI_PHAN_TICH)
            .lotNumber(DEFAULT_LOT_NUMBER)
            .detail(DEFAULT_DETAIL)
            .soLuong(DEFAULT_SO_LUONG)
            .ngayKiemTra(DEFAULT_NGAY_KIEM_TRA)
            .username(DEFAULT_USERNAME)
            .namSanXuat(DEFAULT_NAM_SAN_XUAT)
            .trangThai(DEFAULT_TRANG_THAI);
        return phanTichSanPham;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static PhanTichSanPham createUpdatedEntity(EntityManager em) {
        PhanTichSanPham phanTichSanPham = new PhanTichSanPham()
            .tenNhanVienPhanTich(UPDATED_TEN_NHAN_VIEN_PHAN_TICH)
            .theLoaiPhanTich(UPDATED_THE_LOAI_PHAN_TICH)
            .lotNumber(UPDATED_LOT_NUMBER)
            .detail(UPDATED_DETAIL)
            .soLuong(UPDATED_SO_LUONG)
            .ngayKiemTra(UPDATED_NGAY_KIEM_TRA)
            .username(UPDATED_USERNAME)
            .namSanXuat(UPDATED_NAM_SAN_XUAT)
            .trangThai(UPDATED_TRANG_THAI);
        return phanTichSanPham;
    }

    @BeforeEach
    public void initTest() {
        phanTichSanPham = createEntity(em);
    }

    @Test
    @Transactional
    void createPhanTichSanPham() throws Exception {
        int databaseSizeBeforeCreate = phanTichSanPhamRepository.findAll().size();
        // Create the PhanTichSanPham
        restPhanTichSanPhamMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(phanTichSanPham))
            )
            .andExpect(status().isCreated());

        // Validate the PhanTichSanPham in the database
        List<PhanTichSanPham> phanTichSanPhamList = phanTichSanPhamRepository.findAll();
        assertThat(phanTichSanPhamList).hasSize(databaseSizeBeforeCreate + 1);
        PhanTichSanPham testPhanTichSanPham = phanTichSanPhamList.get(phanTichSanPhamList.size() - 1);
        assertThat(testPhanTichSanPham.getTenNhanVienPhanTich()).isEqualTo(DEFAULT_TEN_NHAN_VIEN_PHAN_TICH);
        assertThat(testPhanTichSanPham.getTheLoaiPhanTich()).isEqualTo(DEFAULT_THE_LOAI_PHAN_TICH);
        assertThat(testPhanTichSanPham.getLotNumber()).isEqualTo(DEFAULT_LOT_NUMBER);
        assertThat(testPhanTichSanPham.getDetail()).isEqualTo(DEFAULT_DETAIL);
        assertThat(testPhanTichSanPham.getSoLuong()).isEqualTo(DEFAULT_SO_LUONG);
        assertThat(testPhanTichSanPham.getNgayKiemTra()).isEqualTo(DEFAULT_NGAY_KIEM_TRA);
        assertThat(testPhanTichSanPham.getUsername()).isEqualTo(DEFAULT_USERNAME);
        assertThat(testPhanTichSanPham.getNamSanXuat()).isEqualTo(DEFAULT_NAM_SAN_XUAT);
        assertThat(testPhanTichSanPham.getTrangThai()).isEqualTo(DEFAULT_TRANG_THAI);
    }

    @Test
    @Transactional
    void createPhanTichSanPhamWithExistingId() throws Exception {
        // Create the PhanTichSanPham with an existing ID
        phanTichSanPham.setId(1L);

        int databaseSizeBeforeCreate = phanTichSanPhamRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restPhanTichSanPhamMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(phanTichSanPham))
            )
            .andExpect(status().isBadRequest());

        // Validate the PhanTichSanPham in the database
        List<PhanTichSanPham> phanTichSanPhamList = phanTichSanPhamRepository.findAll();
        assertThat(phanTichSanPhamList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllPhanTichSanPhams() throws Exception {
        // Initialize the database
        phanTichSanPhamRepository.saveAndFlush(phanTichSanPham);

        // Get all the phanTichSanPhamList
        restPhanTichSanPhamMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(phanTichSanPham.getId().intValue())))
            .andExpect(jsonPath("$.[*].tenNhanVienPhanTich").value(hasItem(DEFAULT_TEN_NHAN_VIEN_PHAN_TICH)))
            .andExpect(jsonPath("$.[*].theLoaiPhanTich").value(hasItem(DEFAULT_THE_LOAI_PHAN_TICH)))
            .andExpect(jsonPath("$.[*].lotNumber").value(hasItem(DEFAULT_LOT_NUMBER)))
            .andExpect(jsonPath("$.[*].detail").value(hasItem(DEFAULT_DETAIL)))
            .andExpect(jsonPath("$.[*].soLuong").value(hasItem(DEFAULT_SO_LUONG)))
            .andExpect(jsonPath("$.[*].ngayKiemTra").value(hasItem(sameInstant(DEFAULT_NGAY_KIEM_TRA))))
            .andExpect(jsonPath("$.[*].username").value(hasItem(DEFAULT_USERNAME)))
            .andExpect(jsonPath("$.[*].namSanXuat").value(hasItem(DEFAULT_NAM_SAN_XUAT)))
            .andExpect(jsonPath("$.[*].trangThai").value(hasItem(DEFAULT_TRANG_THAI)));
    }

    @Test
    @Transactional
    void getPhanTichSanPham() throws Exception {
        // Initialize the database
        phanTichSanPhamRepository.saveAndFlush(phanTichSanPham);

        // Get the phanTichSanPham
        restPhanTichSanPhamMockMvc
            .perform(get(ENTITY_API_URL_ID, phanTichSanPham.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(phanTichSanPham.getId().intValue()))
            .andExpect(jsonPath("$.tenNhanVienPhanTich").value(DEFAULT_TEN_NHAN_VIEN_PHAN_TICH))
            .andExpect(jsonPath("$.theLoaiPhanTich").value(DEFAULT_THE_LOAI_PHAN_TICH))
            .andExpect(jsonPath("$.lotNumber").value(DEFAULT_LOT_NUMBER))
            .andExpect(jsonPath("$.detail").value(DEFAULT_DETAIL))
            .andExpect(jsonPath("$.soLuong").value(DEFAULT_SO_LUONG))
            .andExpect(jsonPath("$.ngayKiemTra").value(sameInstant(DEFAULT_NGAY_KIEM_TRA)))
            .andExpect(jsonPath("$.username").value(DEFAULT_USERNAME))
            .andExpect(jsonPath("$.namSanXuat").value(DEFAULT_NAM_SAN_XUAT))
            .andExpect(jsonPath("$.trangThai").value(DEFAULT_TRANG_THAI));
    }

    @Test
    @Transactional
    void getNonExistingPhanTichSanPham() throws Exception {
        // Get the phanTichSanPham
        restPhanTichSanPhamMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewPhanTichSanPham() throws Exception {
        // Initialize the database
        phanTichSanPhamRepository.saveAndFlush(phanTichSanPham);

        int databaseSizeBeforeUpdate = phanTichSanPhamRepository.findAll().size();

        // Update the phanTichSanPham
        PhanTichSanPham updatedPhanTichSanPham = phanTichSanPhamRepository.findById(phanTichSanPham.getId()).get();
        // Disconnect from session so that the updates on updatedPhanTichSanPham are not directly saved in db
        em.detach(updatedPhanTichSanPham);
        updatedPhanTichSanPham
            .tenNhanVienPhanTich(UPDATED_TEN_NHAN_VIEN_PHAN_TICH)
            .theLoaiPhanTich(UPDATED_THE_LOAI_PHAN_TICH)
            .lotNumber(UPDATED_LOT_NUMBER)
            .detail(UPDATED_DETAIL)
            .soLuong(UPDATED_SO_LUONG)
            .ngayKiemTra(UPDATED_NGAY_KIEM_TRA)
            .username(UPDATED_USERNAME)
            .namSanXuat(UPDATED_NAM_SAN_XUAT)
            .trangThai(UPDATED_TRANG_THAI);

        restPhanTichSanPhamMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedPhanTichSanPham.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedPhanTichSanPham))
            )
            .andExpect(status().isOk());

        // Validate the PhanTichSanPham in the database
        List<PhanTichSanPham> phanTichSanPhamList = phanTichSanPhamRepository.findAll();
        assertThat(phanTichSanPhamList).hasSize(databaseSizeBeforeUpdate);
        PhanTichSanPham testPhanTichSanPham = phanTichSanPhamList.get(phanTichSanPhamList.size() - 1);
        assertThat(testPhanTichSanPham.getTenNhanVienPhanTich()).isEqualTo(UPDATED_TEN_NHAN_VIEN_PHAN_TICH);
        assertThat(testPhanTichSanPham.getTheLoaiPhanTich()).isEqualTo(UPDATED_THE_LOAI_PHAN_TICH);
        assertThat(testPhanTichSanPham.getLotNumber()).isEqualTo(UPDATED_LOT_NUMBER);
        assertThat(testPhanTichSanPham.getDetail()).isEqualTo(UPDATED_DETAIL);
        assertThat(testPhanTichSanPham.getSoLuong()).isEqualTo(UPDATED_SO_LUONG);
        assertThat(testPhanTichSanPham.getNgayKiemTra()).isEqualTo(UPDATED_NGAY_KIEM_TRA);
        assertThat(testPhanTichSanPham.getUsername()).isEqualTo(UPDATED_USERNAME);
        assertThat(testPhanTichSanPham.getNamSanXuat()).isEqualTo(UPDATED_NAM_SAN_XUAT);
        assertThat(testPhanTichSanPham.getTrangThai()).isEqualTo(UPDATED_TRANG_THAI);
    }

    @Test
    @Transactional
    void putNonExistingPhanTichSanPham() throws Exception {
        int databaseSizeBeforeUpdate = phanTichSanPhamRepository.findAll().size();
        phanTichSanPham.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPhanTichSanPhamMockMvc
            .perform(
                put(ENTITY_API_URL_ID, phanTichSanPham.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(phanTichSanPham))
            )
            .andExpect(status().isBadRequest());

        // Validate the PhanTichSanPham in the database
        List<PhanTichSanPham> phanTichSanPhamList = phanTichSanPhamRepository.findAll();
        assertThat(phanTichSanPhamList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchPhanTichSanPham() throws Exception {
        int databaseSizeBeforeUpdate = phanTichSanPhamRepository.findAll().size();
        phanTichSanPham.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPhanTichSanPhamMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(phanTichSanPham))
            )
            .andExpect(status().isBadRequest());

        // Validate the PhanTichSanPham in the database
        List<PhanTichSanPham> phanTichSanPhamList = phanTichSanPhamRepository.findAll();
        assertThat(phanTichSanPhamList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamPhanTichSanPham() throws Exception {
        int databaseSizeBeforeUpdate = phanTichSanPhamRepository.findAll().size();
        phanTichSanPham.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPhanTichSanPhamMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(phanTichSanPham))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the PhanTichSanPham in the database
        List<PhanTichSanPham> phanTichSanPhamList = phanTichSanPhamRepository.findAll();
        assertThat(phanTichSanPhamList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdatePhanTichSanPhamWithPatch() throws Exception {
        // Initialize the database
        phanTichSanPhamRepository.saveAndFlush(phanTichSanPham);

        int databaseSizeBeforeUpdate = phanTichSanPhamRepository.findAll().size();

        // Update the phanTichSanPham using partial update
        PhanTichSanPham partialUpdatedPhanTichSanPham = new PhanTichSanPham();
        partialUpdatedPhanTichSanPham.setId(phanTichSanPham.getId());

        partialUpdatedPhanTichSanPham.lotNumber(UPDATED_LOT_NUMBER).namSanXuat(UPDATED_NAM_SAN_XUAT).trangThai(UPDATED_TRANG_THAI);

        restPhanTichSanPhamMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPhanTichSanPham.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedPhanTichSanPham))
            )
            .andExpect(status().isOk());

        // Validate the PhanTichSanPham in the database
        List<PhanTichSanPham> phanTichSanPhamList = phanTichSanPhamRepository.findAll();
        assertThat(phanTichSanPhamList).hasSize(databaseSizeBeforeUpdate);
        PhanTichSanPham testPhanTichSanPham = phanTichSanPhamList.get(phanTichSanPhamList.size() - 1);
        assertThat(testPhanTichSanPham.getTenNhanVienPhanTich()).isEqualTo(DEFAULT_TEN_NHAN_VIEN_PHAN_TICH);
        assertThat(testPhanTichSanPham.getTheLoaiPhanTich()).isEqualTo(DEFAULT_THE_LOAI_PHAN_TICH);
        assertThat(testPhanTichSanPham.getLotNumber()).isEqualTo(UPDATED_LOT_NUMBER);
        assertThat(testPhanTichSanPham.getDetail()).isEqualTo(DEFAULT_DETAIL);
        assertThat(testPhanTichSanPham.getSoLuong()).isEqualTo(DEFAULT_SO_LUONG);
        assertThat(testPhanTichSanPham.getNgayKiemTra()).isEqualTo(DEFAULT_NGAY_KIEM_TRA);
        assertThat(testPhanTichSanPham.getUsername()).isEqualTo(DEFAULT_USERNAME);
        assertThat(testPhanTichSanPham.getNamSanXuat()).isEqualTo(UPDATED_NAM_SAN_XUAT);
        assertThat(testPhanTichSanPham.getTrangThai()).isEqualTo(UPDATED_TRANG_THAI);
    }

    @Test
    @Transactional
    void fullUpdatePhanTichSanPhamWithPatch() throws Exception {
        // Initialize the database
        phanTichSanPhamRepository.saveAndFlush(phanTichSanPham);

        int databaseSizeBeforeUpdate = phanTichSanPhamRepository.findAll().size();

        // Update the phanTichSanPham using partial update
        PhanTichSanPham partialUpdatedPhanTichSanPham = new PhanTichSanPham();
        partialUpdatedPhanTichSanPham.setId(phanTichSanPham.getId());

        partialUpdatedPhanTichSanPham
            .tenNhanVienPhanTich(UPDATED_TEN_NHAN_VIEN_PHAN_TICH)
            .theLoaiPhanTich(UPDATED_THE_LOAI_PHAN_TICH)
            .lotNumber(UPDATED_LOT_NUMBER)
            .detail(UPDATED_DETAIL)
            .soLuong(UPDATED_SO_LUONG)
            .ngayKiemTra(UPDATED_NGAY_KIEM_TRA)
            .username(UPDATED_USERNAME)
            .namSanXuat(UPDATED_NAM_SAN_XUAT)
            .trangThai(UPDATED_TRANG_THAI);

        restPhanTichSanPhamMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPhanTichSanPham.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedPhanTichSanPham))
            )
            .andExpect(status().isOk());

        // Validate the PhanTichSanPham in the database
        List<PhanTichSanPham> phanTichSanPhamList = phanTichSanPhamRepository.findAll();
        assertThat(phanTichSanPhamList).hasSize(databaseSizeBeforeUpdate);
        PhanTichSanPham testPhanTichSanPham = phanTichSanPhamList.get(phanTichSanPhamList.size() - 1);
        assertThat(testPhanTichSanPham.getTenNhanVienPhanTich()).isEqualTo(UPDATED_TEN_NHAN_VIEN_PHAN_TICH);
        assertThat(testPhanTichSanPham.getTheLoaiPhanTich()).isEqualTo(UPDATED_THE_LOAI_PHAN_TICH);
        assertThat(testPhanTichSanPham.getLotNumber()).isEqualTo(UPDATED_LOT_NUMBER);
        assertThat(testPhanTichSanPham.getDetail()).isEqualTo(UPDATED_DETAIL);
        assertThat(testPhanTichSanPham.getSoLuong()).isEqualTo(UPDATED_SO_LUONG);
        assertThat(testPhanTichSanPham.getNgayKiemTra()).isEqualTo(UPDATED_NGAY_KIEM_TRA);
        assertThat(testPhanTichSanPham.getUsername()).isEqualTo(UPDATED_USERNAME);
        assertThat(testPhanTichSanPham.getNamSanXuat()).isEqualTo(UPDATED_NAM_SAN_XUAT);
        assertThat(testPhanTichSanPham.getTrangThai()).isEqualTo(UPDATED_TRANG_THAI);
    }

    @Test
    @Transactional
    void patchNonExistingPhanTichSanPham() throws Exception {
        int databaseSizeBeforeUpdate = phanTichSanPhamRepository.findAll().size();
        phanTichSanPham.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPhanTichSanPhamMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, phanTichSanPham.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(phanTichSanPham))
            )
            .andExpect(status().isBadRequest());

        // Validate the PhanTichSanPham in the database
        List<PhanTichSanPham> phanTichSanPhamList = phanTichSanPhamRepository.findAll();
        assertThat(phanTichSanPhamList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchPhanTichSanPham() throws Exception {
        int databaseSizeBeforeUpdate = phanTichSanPhamRepository.findAll().size();
        phanTichSanPham.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPhanTichSanPhamMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(phanTichSanPham))
            )
            .andExpect(status().isBadRequest());

        // Validate the PhanTichSanPham in the database
        List<PhanTichSanPham> phanTichSanPhamList = phanTichSanPhamRepository.findAll();
        assertThat(phanTichSanPhamList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamPhanTichSanPham() throws Exception {
        int databaseSizeBeforeUpdate = phanTichSanPhamRepository.findAll().size();
        phanTichSanPham.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPhanTichSanPhamMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(phanTichSanPham))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the PhanTichSanPham in the database
        List<PhanTichSanPham> phanTichSanPhamList = phanTichSanPhamRepository.findAll();
        assertThat(phanTichSanPhamList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deletePhanTichSanPham() throws Exception {
        // Initialize the database
        phanTichSanPhamRepository.saveAndFlush(phanTichSanPham);

        int databaseSizeBeforeDelete = phanTichSanPhamRepository.findAll().size();

        // Delete the phanTichSanPham
        restPhanTichSanPhamMockMvc
            .perform(delete(ENTITY_API_URL_ID, phanTichSanPham.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<PhanTichSanPham> phanTichSanPhamList = phanTichSanPhamRepository.findAll();
        assertThat(phanTichSanPhamList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
