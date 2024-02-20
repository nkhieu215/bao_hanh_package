package com.mycompany.myapp.web.rest;

import static com.mycompany.myapp.web.rest.TestUtil.sameInstant;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.ChiTietSanPhamTiepNhan;
import com.mycompany.myapp.repository.ChiTietSanPhamTiepNhanRepository;
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
 * Integration tests for the {@link ChiTietSanPhamTiepNhanResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ChiTietSanPhamTiepNhanResourceIT {

    private static final Integer DEFAULT_SO_LUONG_KHACH_HANG = 1;
    private static final Integer UPDATED_SO_LUONG_KHACH_HANG = 2;

    private static final String DEFAULT_ID_KHO = "AAAAAAAAAA";
    private static final String UPDATED_ID_KHO = "BBBBBBBBBB";

    private static final String DEFAULT_ID_BIEN_BAN = "AAAAAAAAAA";
    private static final String UPDATED_ID_BIEN_BAN = "BBBBBBBBBB";

    private static final Integer DEFAULT_TONG_LOI_KI_THUAT = 1;
    private static final Integer UPDATED_TONG_LOI_KI_THUAT = 2;

    private static final Integer DEFAULT_TONG_LOI_LINH_DONG = 1;
    private static final Integer UPDATED_TONG_LOI_LINH_DONG = 2;

    private static final ZonedDateTime DEFAULT_NGAY_PHAN_LOAI = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_NGAY_PHAN_LOAI = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final Integer DEFAULT_SL_TIEP_NHAN = 1;
    private static final Integer UPDATED_SL_TIEP_NHAN = 2;

    private static final Integer DEFAULT_SL_TON = 1;
    private static final Integer UPDATED_SL_TON = 2;

    private static final String DEFAULT_TINH_TRANG_BAO_HANH = "AAAAAAAAAA";
    private static final String UPDATED_TINH_TRANG_BAO_HANH = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/chi-tiet-san-pham-tiep-nhans";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ChiTietSanPhamTiepNhanRepository chiTietSanPhamTiepNhanRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restChiTietSanPhamTiepNhanMockMvc;

    private ChiTietSanPhamTiepNhan chiTietSanPhamTiepNhan;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ChiTietSanPhamTiepNhan createEntity(EntityManager em) {
        ChiTietSanPhamTiepNhan chiTietSanPhamTiepNhan = new ChiTietSanPhamTiepNhan()
            .soLuongKhachHang(DEFAULT_SO_LUONG_KHACH_HANG)
            .idKho(DEFAULT_ID_KHO)
            .idBienBan(DEFAULT_ID_BIEN_BAN)
            .tongLoiKiThuat(DEFAULT_TONG_LOI_KI_THUAT)
            .tongLoiLinhDong(DEFAULT_TONG_LOI_LINH_DONG)
            .ngayPhanLoai(DEFAULT_NGAY_PHAN_LOAI)
            .slTiepNhan(DEFAULT_SL_TIEP_NHAN)
            .slTon(DEFAULT_SL_TON)
            .tinhTrangBaoHanh(DEFAULT_TINH_TRANG_BAO_HANH);
        return chiTietSanPhamTiepNhan;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ChiTietSanPhamTiepNhan createUpdatedEntity(EntityManager em) {
        ChiTietSanPhamTiepNhan chiTietSanPhamTiepNhan = new ChiTietSanPhamTiepNhan()
            .soLuongKhachHang(UPDATED_SO_LUONG_KHACH_HANG)
            .idKho(UPDATED_ID_KHO)
            .idBienBan(UPDATED_ID_BIEN_BAN)
            .tongLoiKiThuat(UPDATED_TONG_LOI_KI_THUAT)
            .tongLoiLinhDong(UPDATED_TONG_LOI_LINH_DONG)
            .ngayPhanLoai(UPDATED_NGAY_PHAN_LOAI)
            .slTiepNhan(UPDATED_SL_TIEP_NHAN)
            .slTon(UPDATED_SL_TON)
            .tinhTrangBaoHanh(UPDATED_TINH_TRANG_BAO_HANH);
        return chiTietSanPhamTiepNhan;
    }

    @BeforeEach
    public void initTest() {
        chiTietSanPhamTiepNhan = createEntity(em);
    }

    @Test
    @Transactional
    void createChiTietSanPhamTiepNhan() throws Exception {
        int databaseSizeBeforeCreate = chiTietSanPhamTiepNhanRepository.findAll().size();
        // Create the ChiTietSanPhamTiepNhan
        restChiTietSanPhamTiepNhanMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(chiTietSanPhamTiepNhan))
            )
            .andExpect(status().isCreated());

        // Validate the ChiTietSanPhamTiepNhan in the database
        List<ChiTietSanPhamTiepNhan> chiTietSanPhamTiepNhanList = chiTietSanPhamTiepNhanRepository.findAll();
        assertThat(chiTietSanPhamTiepNhanList).hasSize(databaseSizeBeforeCreate + 1);
        ChiTietSanPhamTiepNhan testChiTietSanPhamTiepNhan = chiTietSanPhamTiepNhanList.get(chiTietSanPhamTiepNhanList.size() - 1);
        assertThat(testChiTietSanPhamTiepNhan.getSoLuongKhachHang()).isEqualTo(DEFAULT_SO_LUONG_KHACH_HANG);
        assertThat(testChiTietSanPhamTiepNhan.getIdKho()).isEqualTo(DEFAULT_ID_KHO);
        assertThat(testChiTietSanPhamTiepNhan.getIdBienBan()).isEqualTo(DEFAULT_ID_BIEN_BAN);
        assertThat(testChiTietSanPhamTiepNhan.getTongLoiKiThuat()).isEqualTo(DEFAULT_TONG_LOI_KI_THUAT);
        assertThat(testChiTietSanPhamTiepNhan.getTongLoiLinhDong()).isEqualTo(DEFAULT_TONG_LOI_LINH_DONG);
        assertThat(testChiTietSanPhamTiepNhan.getNgayPhanLoai()).isEqualTo(DEFAULT_NGAY_PHAN_LOAI);
        assertThat(testChiTietSanPhamTiepNhan.getSlTiepNhan()).isEqualTo(DEFAULT_SL_TIEP_NHAN);
        assertThat(testChiTietSanPhamTiepNhan.getSlTon()).isEqualTo(DEFAULT_SL_TON);
        assertThat(testChiTietSanPhamTiepNhan.getTinhTrangBaoHanh()).isEqualTo(DEFAULT_TINH_TRANG_BAO_HANH);
    }

    @Test
    @Transactional
    void createChiTietSanPhamTiepNhanWithExistingId() throws Exception {
        // Create the ChiTietSanPhamTiepNhan with an existing ID
        chiTietSanPhamTiepNhan.setId(1L);

        int databaseSizeBeforeCreate = chiTietSanPhamTiepNhanRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restChiTietSanPhamTiepNhanMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(chiTietSanPhamTiepNhan))
            )
            .andExpect(status().isBadRequest());

        // Validate the ChiTietSanPhamTiepNhan in the database
        List<ChiTietSanPhamTiepNhan> chiTietSanPhamTiepNhanList = chiTietSanPhamTiepNhanRepository.findAll();
        assertThat(chiTietSanPhamTiepNhanList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllChiTietSanPhamTiepNhans() throws Exception {
        // Initialize the database
        chiTietSanPhamTiepNhanRepository.saveAndFlush(chiTietSanPhamTiepNhan);

        // Get all the chiTietSanPhamTiepNhanList
        restChiTietSanPhamTiepNhanMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(chiTietSanPhamTiepNhan.getId().intValue())))
            .andExpect(jsonPath("$.[*].soLuongKhachHang").value(hasItem(DEFAULT_SO_LUONG_KHACH_HANG)))
            .andExpect(jsonPath("$.[*].idKho").value(hasItem(DEFAULT_ID_KHO)))
            .andExpect(jsonPath("$.[*].idBienBan").value(hasItem(DEFAULT_ID_BIEN_BAN)))
            .andExpect(jsonPath("$.[*].tongLoiKiThuat").value(hasItem(DEFAULT_TONG_LOI_KI_THUAT)))
            .andExpect(jsonPath("$.[*].tongLoiLinhDong").value(hasItem(DEFAULT_TONG_LOI_LINH_DONG)))
            .andExpect(jsonPath("$.[*].ngayPhanLoai").value(hasItem(sameInstant(DEFAULT_NGAY_PHAN_LOAI))))
            .andExpect(jsonPath("$.[*].slTiepNhan").value(hasItem(DEFAULT_SL_TIEP_NHAN)))
            .andExpect(jsonPath("$.[*].slTon").value(hasItem(DEFAULT_SL_TON)))
            .andExpect(jsonPath("$.[*].tinhTrangBaoHanh").value(hasItem(DEFAULT_TINH_TRANG_BAO_HANH)));
    }

    @Test
    @Transactional
    void getChiTietSanPhamTiepNhan() throws Exception {
        // Initialize the database
        chiTietSanPhamTiepNhanRepository.saveAndFlush(chiTietSanPhamTiepNhan);

        // Get the chiTietSanPhamTiepNhan
        restChiTietSanPhamTiepNhanMockMvc
            .perform(get(ENTITY_API_URL_ID, chiTietSanPhamTiepNhan.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(chiTietSanPhamTiepNhan.getId().intValue()))
            .andExpect(jsonPath("$.soLuongKhachHang").value(DEFAULT_SO_LUONG_KHACH_HANG))
            .andExpect(jsonPath("$.idKho").value(DEFAULT_ID_KHO))
            .andExpect(jsonPath("$.idBienBan").value(DEFAULT_ID_BIEN_BAN))
            .andExpect(jsonPath("$.tongLoiKiThuat").value(DEFAULT_TONG_LOI_KI_THUAT))
            .andExpect(jsonPath("$.tongLoiLinhDong").value(DEFAULT_TONG_LOI_LINH_DONG))
            .andExpect(jsonPath("$.ngayPhanLoai").value(sameInstant(DEFAULT_NGAY_PHAN_LOAI)))
            .andExpect(jsonPath("$.slTiepNhan").value(DEFAULT_SL_TIEP_NHAN))
            .andExpect(jsonPath("$.slTon").value(DEFAULT_SL_TON))
            .andExpect(jsonPath("$.tinhTrangBaoHanh").value(DEFAULT_TINH_TRANG_BAO_HANH));
    }

    @Test
    @Transactional
    void getNonExistingChiTietSanPhamTiepNhan() throws Exception {
        // Get the chiTietSanPhamTiepNhan
        restChiTietSanPhamTiepNhanMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewChiTietSanPhamTiepNhan() throws Exception {
        // Initialize the database
        chiTietSanPhamTiepNhanRepository.saveAndFlush(chiTietSanPhamTiepNhan);

        int databaseSizeBeforeUpdate = chiTietSanPhamTiepNhanRepository.findAll().size();

        // Update the chiTietSanPhamTiepNhan
        ChiTietSanPhamTiepNhan updatedChiTietSanPhamTiepNhan = chiTietSanPhamTiepNhanRepository
            .findById(chiTietSanPhamTiepNhan.getId())
            .get();
        // Disconnect from session so that the updates on updatedChiTietSanPhamTiepNhan are not directly saved in db
        em.detach(updatedChiTietSanPhamTiepNhan);
        updatedChiTietSanPhamTiepNhan
            .soLuongKhachHang(UPDATED_SO_LUONG_KHACH_HANG)
            .idKho(UPDATED_ID_KHO)
            .idBienBan(UPDATED_ID_BIEN_BAN)
            .tongLoiKiThuat(UPDATED_TONG_LOI_KI_THUAT)
            .tongLoiLinhDong(UPDATED_TONG_LOI_LINH_DONG)
            .ngayPhanLoai(UPDATED_NGAY_PHAN_LOAI)
            .slTiepNhan(UPDATED_SL_TIEP_NHAN)
            .slTon(UPDATED_SL_TON)
            .tinhTrangBaoHanh(UPDATED_TINH_TRANG_BAO_HANH);

        restChiTietSanPhamTiepNhanMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedChiTietSanPhamTiepNhan.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedChiTietSanPhamTiepNhan))
            )
            .andExpect(status().isOk());

        // Validate the ChiTietSanPhamTiepNhan in the database
        List<ChiTietSanPhamTiepNhan> chiTietSanPhamTiepNhanList = chiTietSanPhamTiepNhanRepository.findAll();
        assertThat(chiTietSanPhamTiepNhanList).hasSize(databaseSizeBeforeUpdate);
        ChiTietSanPhamTiepNhan testChiTietSanPhamTiepNhan = chiTietSanPhamTiepNhanList.get(chiTietSanPhamTiepNhanList.size() - 1);
        assertThat(testChiTietSanPhamTiepNhan.getSoLuongKhachHang()).isEqualTo(UPDATED_SO_LUONG_KHACH_HANG);
        assertThat(testChiTietSanPhamTiepNhan.getIdKho()).isEqualTo(UPDATED_ID_KHO);
        assertThat(testChiTietSanPhamTiepNhan.getIdBienBan()).isEqualTo(UPDATED_ID_BIEN_BAN);
        assertThat(testChiTietSanPhamTiepNhan.getTongLoiKiThuat()).isEqualTo(UPDATED_TONG_LOI_KI_THUAT);
        assertThat(testChiTietSanPhamTiepNhan.getTongLoiLinhDong()).isEqualTo(UPDATED_TONG_LOI_LINH_DONG);
        assertThat(testChiTietSanPhamTiepNhan.getNgayPhanLoai()).isEqualTo(UPDATED_NGAY_PHAN_LOAI);
        assertThat(testChiTietSanPhamTiepNhan.getSlTiepNhan()).isEqualTo(UPDATED_SL_TIEP_NHAN);
        assertThat(testChiTietSanPhamTiepNhan.getSlTon()).isEqualTo(UPDATED_SL_TON);
        assertThat(testChiTietSanPhamTiepNhan.getTinhTrangBaoHanh()).isEqualTo(UPDATED_TINH_TRANG_BAO_HANH);
    }

    @Test
    @Transactional
    void putNonExistingChiTietSanPhamTiepNhan() throws Exception {
        int databaseSizeBeforeUpdate = chiTietSanPhamTiepNhanRepository.findAll().size();
        chiTietSanPhamTiepNhan.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restChiTietSanPhamTiepNhanMockMvc
            .perform(
                put(ENTITY_API_URL_ID, chiTietSanPhamTiepNhan.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(chiTietSanPhamTiepNhan))
            )
            .andExpect(status().isBadRequest());

        // Validate the ChiTietSanPhamTiepNhan in the database
        List<ChiTietSanPhamTiepNhan> chiTietSanPhamTiepNhanList = chiTietSanPhamTiepNhanRepository.findAll();
        assertThat(chiTietSanPhamTiepNhanList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchChiTietSanPhamTiepNhan() throws Exception {
        int databaseSizeBeforeUpdate = chiTietSanPhamTiepNhanRepository.findAll().size();
        chiTietSanPhamTiepNhan.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restChiTietSanPhamTiepNhanMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(chiTietSanPhamTiepNhan))
            )
            .andExpect(status().isBadRequest());

        // Validate the ChiTietSanPhamTiepNhan in the database
        List<ChiTietSanPhamTiepNhan> chiTietSanPhamTiepNhanList = chiTietSanPhamTiepNhanRepository.findAll();
        assertThat(chiTietSanPhamTiepNhanList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamChiTietSanPhamTiepNhan() throws Exception {
        int databaseSizeBeforeUpdate = chiTietSanPhamTiepNhanRepository.findAll().size();
        chiTietSanPhamTiepNhan.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restChiTietSanPhamTiepNhanMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(chiTietSanPhamTiepNhan))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ChiTietSanPhamTiepNhan in the database
        List<ChiTietSanPhamTiepNhan> chiTietSanPhamTiepNhanList = chiTietSanPhamTiepNhanRepository.findAll();
        assertThat(chiTietSanPhamTiepNhanList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateChiTietSanPhamTiepNhanWithPatch() throws Exception {
        // Initialize the database
        chiTietSanPhamTiepNhanRepository.saveAndFlush(chiTietSanPhamTiepNhan);

        int databaseSizeBeforeUpdate = chiTietSanPhamTiepNhanRepository.findAll().size();

        // Update the chiTietSanPhamTiepNhan using partial update
        ChiTietSanPhamTiepNhan partialUpdatedChiTietSanPhamTiepNhan = new ChiTietSanPhamTiepNhan();
        partialUpdatedChiTietSanPhamTiepNhan.setId(chiTietSanPhamTiepNhan.getId());

        partialUpdatedChiTietSanPhamTiepNhan
            .soLuongKhachHang(UPDATED_SO_LUONG_KHACH_HANG)
            .tongLoiKiThuat(UPDATED_TONG_LOI_KI_THUAT)
            .slTiepNhan(UPDATED_SL_TIEP_NHAN)
            .tinhTrangBaoHanh(UPDATED_TINH_TRANG_BAO_HANH);

        restChiTietSanPhamTiepNhanMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedChiTietSanPhamTiepNhan.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedChiTietSanPhamTiepNhan))
            )
            .andExpect(status().isOk());

        // Validate the ChiTietSanPhamTiepNhan in the database
        List<ChiTietSanPhamTiepNhan> chiTietSanPhamTiepNhanList = chiTietSanPhamTiepNhanRepository.findAll();
        assertThat(chiTietSanPhamTiepNhanList).hasSize(databaseSizeBeforeUpdate);
        ChiTietSanPhamTiepNhan testChiTietSanPhamTiepNhan = chiTietSanPhamTiepNhanList.get(chiTietSanPhamTiepNhanList.size() - 1);
        assertThat(testChiTietSanPhamTiepNhan.getSoLuongKhachHang()).isEqualTo(UPDATED_SO_LUONG_KHACH_HANG);
        assertThat(testChiTietSanPhamTiepNhan.getIdKho()).isEqualTo(DEFAULT_ID_KHO);
        assertThat(testChiTietSanPhamTiepNhan.getIdBienBan()).isEqualTo(DEFAULT_ID_BIEN_BAN);
        assertThat(testChiTietSanPhamTiepNhan.getTongLoiKiThuat()).isEqualTo(UPDATED_TONG_LOI_KI_THUAT);
        assertThat(testChiTietSanPhamTiepNhan.getTongLoiLinhDong()).isEqualTo(DEFAULT_TONG_LOI_LINH_DONG);
        assertThat(testChiTietSanPhamTiepNhan.getNgayPhanLoai()).isEqualTo(DEFAULT_NGAY_PHAN_LOAI);
        assertThat(testChiTietSanPhamTiepNhan.getSlTiepNhan()).isEqualTo(UPDATED_SL_TIEP_NHAN);
        assertThat(testChiTietSanPhamTiepNhan.getSlTon()).isEqualTo(DEFAULT_SL_TON);
        assertThat(testChiTietSanPhamTiepNhan.getTinhTrangBaoHanh()).isEqualTo(UPDATED_TINH_TRANG_BAO_HANH);
    }

    @Test
    @Transactional
    void fullUpdateChiTietSanPhamTiepNhanWithPatch() throws Exception {
        // Initialize the database
        chiTietSanPhamTiepNhanRepository.saveAndFlush(chiTietSanPhamTiepNhan);

        int databaseSizeBeforeUpdate = chiTietSanPhamTiepNhanRepository.findAll().size();

        // Update the chiTietSanPhamTiepNhan using partial update
        ChiTietSanPhamTiepNhan partialUpdatedChiTietSanPhamTiepNhan = new ChiTietSanPhamTiepNhan();
        partialUpdatedChiTietSanPhamTiepNhan.setId(chiTietSanPhamTiepNhan.getId());

        partialUpdatedChiTietSanPhamTiepNhan
            .soLuongKhachHang(UPDATED_SO_LUONG_KHACH_HANG)
            .idKho(UPDATED_ID_KHO)
            .idBienBan(UPDATED_ID_BIEN_BAN)
            .tongLoiKiThuat(UPDATED_TONG_LOI_KI_THUAT)
            .tongLoiLinhDong(UPDATED_TONG_LOI_LINH_DONG)
            .ngayPhanLoai(UPDATED_NGAY_PHAN_LOAI)
            .slTiepNhan(UPDATED_SL_TIEP_NHAN)
            .slTon(UPDATED_SL_TON)
            .tinhTrangBaoHanh(UPDATED_TINH_TRANG_BAO_HANH);

        restChiTietSanPhamTiepNhanMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedChiTietSanPhamTiepNhan.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedChiTietSanPhamTiepNhan))
            )
            .andExpect(status().isOk());

        // Validate the ChiTietSanPhamTiepNhan in the database
        List<ChiTietSanPhamTiepNhan> chiTietSanPhamTiepNhanList = chiTietSanPhamTiepNhanRepository.findAll();
        assertThat(chiTietSanPhamTiepNhanList).hasSize(databaseSizeBeforeUpdate);
        ChiTietSanPhamTiepNhan testChiTietSanPhamTiepNhan = chiTietSanPhamTiepNhanList.get(chiTietSanPhamTiepNhanList.size() - 1);
        assertThat(testChiTietSanPhamTiepNhan.getSoLuongKhachHang()).isEqualTo(UPDATED_SO_LUONG_KHACH_HANG);
        assertThat(testChiTietSanPhamTiepNhan.getIdKho()).isEqualTo(UPDATED_ID_KHO);
        assertThat(testChiTietSanPhamTiepNhan.getIdBienBan()).isEqualTo(UPDATED_ID_BIEN_BAN);
        assertThat(testChiTietSanPhamTiepNhan.getTongLoiKiThuat()).isEqualTo(UPDATED_TONG_LOI_KI_THUAT);
        assertThat(testChiTietSanPhamTiepNhan.getTongLoiLinhDong()).isEqualTo(UPDATED_TONG_LOI_LINH_DONG);
        assertThat(testChiTietSanPhamTiepNhan.getNgayPhanLoai()).isEqualTo(UPDATED_NGAY_PHAN_LOAI);
        assertThat(testChiTietSanPhamTiepNhan.getSlTiepNhan()).isEqualTo(UPDATED_SL_TIEP_NHAN);
        assertThat(testChiTietSanPhamTiepNhan.getSlTon()).isEqualTo(UPDATED_SL_TON);
        assertThat(testChiTietSanPhamTiepNhan.getTinhTrangBaoHanh()).isEqualTo(UPDATED_TINH_TRANG_BAO_HANH);
    }

    @Test
    @Transactional
    void patchNonExistingChiTietSanPhamTiepNhan() throws Exception {
        int databaseSizeBeforeUpdate = chiTietSanPhamTiepNhanRepository.findAll().size();
        chiTietSanPhamTiepNhan.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restChiTietSanPhamTiepNhanMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, chiTietSanPhamTiepNhan.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(chiTietSanPhamTiepNhan))
            )
            .andExpect(status().isBadRequest());

        // Validate the ChiTietSanPhamTiepNhan in the database
        List<ChiTietSanPhamTiepNhan> chiTietSanPhamTiepNhanList = chiTietSanPhamTiepNhanRepository.findAll();
        assertThat(chiTietSanPhamTiepNhanList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchChiTietSanPhamTiepNhan() throws Exception {
        int databaseSizeBeforeUpdate = chiTietSanPhamTiepNhanRepository.findAll().size();
        chiTietSanPhamTiepNhan.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restChiTietSanPhamTiepNhanMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(chiTietSanPhamTiepNhan))
            )
            .andExpect(status().isBadRequest());

        // Validate the ChiTietSanPhamTiepNhan in the database
        List<ChiTietSanPhamTiepNhan> chiTietSanPhamTiepNhanList = chiTietSanPhamTiepNhanRepository.findAll();
        assertThat(chiTietSanPhamTiepNhanList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamChiTietSanPhamTiepNhan() throws Exception {
        int databaseSizeBeforeUpdate = chiTietSanPhamTiepNhanRepository.findAll().size();
        chiTietSanPhamTiepNhan.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restChiTietSanPhamTiepNhanMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(chiTietSanPhamTiepNhan))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ChiTietSanPhamTiepNhan in the database
        List<ChiTietSanPhamTiepNhan> chiTietSanPhamTiepNhanList = chiTietSanPhamTiepNhanRepository.findAll();
        assertThat(chiTietSanPhamTiepNhanList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteChiTietSanPhamTiepNhan() throws Exception {
        // Initialize the database
        chiTietSanPhamTiepNhanRepository.saveAndFlush(chiTietSanPhamTiepNhan);

        int databaseSizeBeforeDelete = chiTietSanPhamTiepNhanRepository.findAll().size();

        // Delete the chiTietSanPhamTiepNhan
        restChiTietSanPhamTiepNhanMockMvc
            .perform(delete(ENTITY_API_URL_ID, chiTietSanPhamTiepNhan.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<ChiTietSanPhamTiepNhan> chiTietSanPhamTiepNhanList = chiTietSanPhamTiepNhanRepository.findAll();
        assertThat(chiTietSanPhamTiepNhanList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
