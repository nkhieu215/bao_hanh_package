package com.mycompany.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.KhachHang;
import com.mycompany.myapp.repository.KhachHangRepository;
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
 * Integration tests for the {@link KhachHangResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class KhachHangResourceIT {

    private static final String DEFAULT_MA_KHACH_HANG = "AAAAAAAAAA";
    private static final String UPDATED_MA_KHACH_HANG = "BBBBBBBBBB";

    private static final String DEFAULT_TEN_KHACH_HANG = "AAAAAAAAAA";
    private static final String UPDATED_TEN_KHACH_HANG = "BBBBBBBBBB";

    private static final String DEFAULT_SO_DIEN_THOAI = "AAAAAAAAAA";
    private static final String UPDATED_SO_DIEN_THOAI = "BBBBBBBBBB";

    private static final String DEFAULT_DIA_CHI = "AAAAAAAAAA";
    private static final String UPDATED_DIA_CHI = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/khach-hangs";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private KhachHangRepository khachHangRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restKhachHangMockMvc;

    private KhachHang khachHang;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static KhachHang createEntity(EntityManager em) {
        KhachHang khachHang = new KhachHang()
            .maKhachHang(DEFAULT_MA_KHACH_HANG)
            .tenKhachHang(DEFAULT_TEN_KHACH_HANG)
            .soDienThoai(DEFAULT_SO_DIEN_THOAI)
            .diaChi(DEFAULT_DIA_CHI);
        return khachHang;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static KhachHang createUpdatedEntity(EntityManager em) {
        KhachHang khachHang = new KhachHang()
            .maKhachHang(UPDATED_MA_KHACH_HANG)
            .tenKhachHang(UPDATED_TEN_KHACH_HANG)
            .soDienThoai(UPDATED_SO_DIEN_THOAI)
            .diaChi(UPDATED_DIA_CHI);
        return khachHang;
    }

    @BeforeEach
    public void initTest() {
        khachHang = createEntity(em);
    }

    @Test
    @Transactional
    void createKhachHang() throws Exception {
        int databaseSizeBeforeCreate = khachHangRepository.findAll().size();
        // Create the KhachHang
        restKhachHangMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(khachHang))
            )
            .andExpect(status().isCreated());

        // Validate the KhachHang in the database
        List<KhachHang> khachHangList = khachHangRepository.findAll();
        assertThat(khachHangList).hasSize(databaseSizeBeforeCreate + 1);
        KhachHang testKhachHang = khachHangList.get(khachHangList.size() - 1);
        assertThat(testKhachHang.getMaKhachHang()).isEqualTo(DEFAULT_MA_KHACH_HANG);
        assertThat(testKhachHang.getTenKhachHang()).isEqualTo(DEFAULT_TEN_KHACH_HANG);
        assertThat(testKhachHang.getSoDienThoai()).isEqualTo(DEFAULT_SO_DIEN_THOAI);
        assertThat(testKhachHang.getDiaChi()).isEqualTo(DEFAULT_DIA_CHI);
    }

    @Test
    @Transactional
    void createKhachHangWithExistingId() throws Exception {
        // Create the KhachHang with an existing ID
        khachHang.setId(1L);

        int databaseSizeBeforeCreate = khachHangRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restKhachHangMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(khachHang))
            )
            .andExpect(status().isBadRequest());

        // Validate the KhachHang in the database
        List<KhachHang> khachHangList = khachHangRepository.findAll();
        assertThat(khachHangList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllKhachHangs() throws Exception {
        // Initialize the database
        khachHangRepository.saveAndFlush(khachHang);

        // Get all the khachHangList
        restKhachHangMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(khachHang.getId().intValue())))
            .andExpect(jsonPath("$.[*].maKhachHang").value(hasItem(DEFAULT_MA_KHACH_HANG)))
            .andExpect(jsonPath("$.[*].tenKhachHang").value(hasItem(DEFAULT_TEN_KHACH_HANG)))
            .andExpect(jsonPath("$.[*].soDienThoai").value(hasItem(DEFAULT_SO_DIEN_THOAI)))
            .andExpect(jsonPath("$.[*].diaChi").value(hasItem(DEFAULT_DIA_CHI)));
    }

    @Test
    @Transactional
    void getKhachHang() throws Exception {
        // Initialize the database
        khachHangRepository.saveAndFlush(khachHang);

        // Get the khachHang
        restKhachHangMockMvc
            .perform(get(ENTITY_API_URL_ID, khachHang.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(khachHang.getId().intValue()))
            .andExpect(jsonPath("$.maKhachHang").value(DEFAULT_MA_KHACH_HANG))
            .andExpect(jsonPath("$.tenKhachHang").value(DEFAULT_TEN_KHACH_HANG))
            .andExpect(jsonPath("$.soDienThoai").value(DEFAULT_SO_DIEN_THOAI))
            .andExpect(jsonPath("$.diaChi").value(DEFAULT_DIA_CHI));
    }

    @Test
    @Transactional
    void getNonExistingKhachHang() throws Exception {
        // Get the khachHang
        restKhachHangMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewKhachHang() throws Exception {
        // Initialize the database
        khachHangRepository.saveAndFlush(khachHang);

        int databaseSizeBeforeUpdate = khachHangRepository.findAll().size();

        // Update the khachHang
        KhachHang updatedKhachHang = khachHangRepository.findById(khachHang.getId()).get();
        // Disconnect from session so that the updates on updatedKhachHang are not directly saved in db
        em.detach(updatedKhachHang);
        updatedKhachHang
            .maKhachHang(UPDATED_MA_KHACH_HANG)
            .tenKhachHang(UPDATED_TEN_KHACH_HANG)
            .soDienThoai(UPDATED_SO_DIEN_THOAI)
            .diaChi(UPDATED_DIA_CHI);

        restKhachHangMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedKhachHang.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedKhachHang))
            )
            .andExpect(status().isOk());

        // Validate the KhachHang in the database
        List<KhachHang> khachHangList = khachHangRepository.findAll();
        assertThat(khachHangList).hasSize(databaseSizeBeforeUpdate);
        KhachHang testKhachHang = khachHangList.get(khachHangList.size() - 1);
        assertThat(testKhachHang.getMaKhachHang()).isEqualTo(UPDATED_MA_KHACH_HANG);
        assertThat(testKhachHang.getTenKhachHang()).isEqualTo(UPDATED_TEN_KHACH_HANG);
        assertThat(testKhachHang.getSoDienThoai()).isEqualTo(UPDATED_SO_DIEN_THOAI);
        assertThat(testKhachHang.getDiaChi()).isEqualTo(UPDATED_DIA_CHI);
    }

    @Test
    @Transactional
    void putNonExistingKhachHang() throws Exception {
        int databaseSizeBeforeUpdate = khachHangRepository.findAll().size();
        khachHang.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restKhachHangMockMvc
            .perform(
                put(ENTITY_API_URL_ID, khachHang.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(khachHang))
            )
            .andExpect(status().isBadRequest());

        // Validate the KhachHang in the database
        List<KhachHang> khachHangList = khachHangRepository.findAll();
        assertThat(khachHangList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchKhachHang() throws Exception {
        int databaseSizeBeforeUpdate = khachHangRepository.findAll().size();
        khachHang.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restKhachHangMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(khachHang))
            )
            .andExpect(status().isBadRequest());

        // Validate the KhachHang in the database
        List<KhachHang> khachHangList = khachHangRepository.findAll();
        assertThat(khachHangList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamKhachHang() throws Exception {
        int databaseSizeBeforeUpdate = khachHangRepository.findAll().size();
        khachHang.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restKhachHangMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(khachHang))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the KhachHang in the database
        List<KhachHang> khachHangList = khachHangRepository.findAll();
        assertThat(khachHangList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateKhachHangWithPatch() throws Exception {
        // Initialize the database
        khachHangRepository.saveAndFlush(khachHang);

        int databaseSizeBeforeUpdate = khachHangRepository.findAll().size();

        // Update the khachHang using partial update
        KhachHang partialUpdatedKhachHang = new KhachHang();
        partialUpdatedKhachHang.setId(khachHang.getId());

        partialUpdatedKhachHang.maKhachHang(UPDATED_MA_KHACH_HANG).tenKhachHang(UPDATED_TEN_KHACH_HANG);

        restKhachHangMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedKhachHang.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedKhachHang))
            )
            .andExpect(status().isOk());

        // Validate the KhachHang in the database
        List<KhachHang> khachHangList = khachHangRepository.findAll();
        assertThat(khachHangList).hasSize(databaseSizeBeforeUpdate);
        KhachHang testKhachHang = khachHangList.get(khachHangList.size() - 1);
        assertThat(testKhachHang.getMaKhachHang()).isEqualTo(UPDATED_MA_KHACH_HANG);
        assertThat(testKhachHang.getTenKhachHang()).isEqualTo(UPDATED_TEN_KHACH_HANG);
        assertThat(testKhachHang.getSoDienThoai()).isEqualTo(DEFAULT_SO_DIEN_THOAI);
        assertThat(testKhachHang.getDiaChi()).isEqualTo(DEFAULT_DIA_CHI);
    }

    @Test
    @Transactional
    void fullUpdateKhachHangWithPatch() throws Exception {
        // Initialize the database
        khachHangRepository.saveAndFlush(khachHang);

        int databaseSizeBeforeUpdate = khachHangRepository.findAll().size();

        // Update the khachHang using partial update
        KhachHang partialUpdatedKhachHang = new KhachHang();
        partialUpdatedKhachHang.setId(khachHang.getId());

        partialUpdatedKhachHang
            .maKhachHang(UPDATED_MA_KHACH_HANG)
            .tenKhachHang(UPDATED_TEN_KHACH_HANG)
            .soDienThoai(UPDATED_SO_DIEN_THOAI)
            .diaChi(UPDATED_DIA_CHI);

        restKhachHangMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedKhachHang.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedKhachHang))
            )
            .andExpect(status().isOk());

        // Validate the KhachHang in the database
        List<KhachHang> khachHangList = khachHangRepository.findAll();
        assertThat(khachHangList).hasSize(databaseSizeBeforeUpdate);
        KhachHang testKhachHang = khachHangList.get(khachHangList.size() - 1);
        assertThat(testKhachHang.getMaKhachHang()).isEqualTo(UPDATED_MA_KHACH_HANG);
        assertThat(testKhachHang.getTenKhachHang()).isEqualTo(UPDATED_TEN_KHACH_HANG);
        assertThat(testKhachHang.getSoDienThoai()).isEqualTo(UPDATED_SO_DIEN_THOAI);
        assertThat(testKhachHang.getDiaChi()).isEqualTo(UPDATED_DIA_CHI);
    }

    @Test
    @Transactional
    void patchNonExistingKhachHang() throws Exception {
        int databaseSizeBeforeUpdate = khachHangRepository.findAll().size();
        khachHang.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restKhachHangMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, khachHang.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(khachHang))
            )
            .andExpect(status().isBadRequest());

        // Validate the KhachHang in the database
        List<KhachHang> khachHangList = khachHangRepository.findAll();
        assertThat(khachHangList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchKhachHang() throws Exception {
        int databaseSizeBeforeUpdate = khachHangRepository.findAll().size();
        khachHang.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restKhachHangMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(khachHang))
            )
            .andExpect(status().isBadRequest());

        // Validate the KhachHang in the database
        List<KhachHang> khachHangList = khachHangRepository.findAll();
        assertThat(khachHangList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamKhachHang() throws Exception {
        int databaseSizeBeforeUpdate = khachHangRepository.findAll().size();
        khachHang.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restKhachHangMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(khachHang))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the KhachHang in the database
        List<KhachHang> khachHangList = khachHangRepository.findAll();
        assertThat(khachHangList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteKhachHang() throws Exception {
        // Initialize the database
        khachHangRepository.saveAndFlush(khachHang);

        int databaseSizeBeforeDelete = khachHangRepository.findAll().size();

        // Delete the khachHang
        restKhachHangMockMvc
            .perform(delete(ENTITY_API_URL_ID, khachHang.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<KhachHang> khachHangList = khachHangRepository.findAll();
        assertThat(khachHangList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
