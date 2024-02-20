package com.mycompany.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.SanPham;
import com.mycompany.myapp.repository.SanPhamRepository;
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
 * Integration tests for the {@link SanPhamResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class SanPhamResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_SAP_CODE = "AAAAAAAAAA";
    private static final String UPDATED_SAP_CODE = "BBBBBBBBBB";

    private static final String DEFAULT_RD_CODE = "AAAAAAAAAA";
    private static final String UPDATED_RD_CODE = "BBBBBBBBBB";

    private static final String DEFAULT_TEN_CHUNG_LOAI = "AAAAAAAAAA";
    private static final String UPDATED_TEN_CHUNG_LOAI = "BBBBBBBBBB";

    private static final String DEFAULT_DON_VI = "AAAAAAAAAA";
    private static final String UPDATED_DON_VI = "BBBBBBBBBB";

    private static final String DEFAULT_TO_SAN_XUAT = "AAAAAAAAAA";
    private static final String UPDATED_TO_SAN_XUAT = "BBBBBBBBBB";

    private static final String DEFAULT_PHAN_LOAI = "AAAAAAAAAA";
    private static final String UPDATED_PHAN_LOAI = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/san-phams";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private SanPhamRepository sanPhamRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restSanPhamMockMvc;

    private SanPham sanPham;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static SanPham createEntity(EntityManager em) {
        SanPham sanPham = new SanPham()
            .name(DEFAULT_NAME)
            .sapCode(DEFAULT_SAP_CODE)
            .rdCode(DEFAULT_RD_CODE)
            .tenChungLoai(DEFAULT_TEN_CHUNG_LOAI)
            .donVi(DEFAULT_DON_VI)
            .toSanXuat(DEFAULT_TO_SAN_XUAT)
            .phanLoai(DEFAULT_PHAN_LOAI);
        return sanPham;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static SanPham createUpdatedEntity(EntityManager em) {
        SanPham sanPham = new SanPham()
            .name(UPDATED_NAME)
            .sapCode(UPDATED_SAP_CODE)
            .rdCode(UPDATED_RD_CODE)
            .tenChungLoai(UPDATED_TEN_CHUNG_LOAI)
            .donVi(UPDATED_DON_VI)
            .toSanXuat(UPDATED_TO_SAN_XUAT)
            .phanLoai(UPDATED_PHAN_LOAI);
        return sanPham;
    }

    @BeforeEach
    public void initTest() {
        sanPham = createEntity(em);
    }

    @Test
    @Transactional
    void createSanPham() throws Exception {
        int databaseSizeBeforeCreate = sanPhamRepository.findAll().size();
        // Create the SanPham
        restSanPhamMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(sanPham))
            )
            .andExpect(status().isCreated());

        // Validate the SanPham in the database
        List<SanPham> sanPhamList = sanPhamRepository.findAll();
        assertThat(sanPhamList).hasSize(databaseSizeBeforeCreate + 1);
        SanPham testSanPham = sanPhamList.get(sanPhamList.size() - 1);
        assertThat(testSanPham.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testSanPham.getSapCode()).isEqualTo(DEFAULT_SAP_CODE);
        assertThat(testSanPham.getRdCode()).isEqualTo(DEFAULT_RD_CODE);
        assertThat(testSanPham.getTenChungLoai()).isEqualTo(DEFAULT_TEN_CHUNG_LOAI);
        assertThat(testSanPham.getDonVi()).isEqualTo(DEFAULT_DON_VI);
        assertThat(testSanPham.getToSanXuat()).isEqualTo(DEFAULT_TO_SAN_XUAT);
        assertThat(testSanPham.getPhanLoai()).isEqualTo(DEFAULT_PHAN_LOAI);
    }

    @Test
    @Transactional
    void createSanPhamWithExistingId() throws Exception {
        // Create the SanPham with an existing ID
        sanPham.setId(1L);

        int databaseSizeBeforeCreate = sanPhamRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restSanPhamMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(sanPham))
            )
            .andExpect(status().isBadRequest());

        // Validate the SanPham in the database
        List<SanPham> sanPhamList = sanPhamRepository.findAll();
        assertThat(sanPhamList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllSanPhams() throws Exception {
        // Initialize the database
        sanPhamRepository.saveAndFlush(sanPham);

        // Get all the sanPhamList
        restSanPhamMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(sanPham.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].sapCode").value(hasItem(DEFAULT_SAP_CODE)))
            .andExpect(jsonPath("$.[*].rdCode").value(hasItem(DEFAULT_RD_CODE)))
            .andExpect(jsonPath("$.[*].tenChungLoai").value(hasItem(DEFAULT_TEN_CHUNG_LOAI)))
            .andExpect(jsonPath("$.[*].donVi").value(hasItem(DEFAULT_DON_VI)))
            .andExpect(jsonPath("$.[*].toSanXuat").value(hasItem(DEFAULT_TO_SAN_XUAT)))
            .andExpect(jsonPath("$.[*].phanLoai").value(hasItem(DEFAULT_PHAN_LOAI)));
    }

    @Test
    @Transactional
    void getSanPham() throws Exception {
        // Initialize the database
        sanPhamRepository.saveAndFlush(sanPham);

        // Get the sanPham
        restSanPhamMockMvc
            .perform(get(ENTITY_API_URL_ID, sanPham.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(sanPham.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.sapCode").value(DEFAULT_SAP_CODE))
            .andExpect(jsonPath("$.rdCode").value(DEFAULT_RD_CODE))
            .andExpect(jsonPath("$.tenChungLoai").value(DEFAULT_TEN_CHUNG_LOAI))
            .andExpect(jsonPath("$.donVi").value(DEFAULT_DON_VI))
            .andExpect(jsonPath("$.toSanXuat").value(DEFAULT_TO_SAN_XUAT))
            .andExpect(jsonPath("$.phanLoai").value(DEFAULT_PHAN_LOAI));
    }

    @Test
    @Transactional
    void getNonExistingSanPham() throws Exception {
        // Get the sanPham
        restSanPhamMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewSanPham() throws Exception {
        // Initialize the database
        sanPhamRepository.saveAndFlush(sanPham);

        int databaseSizeBeforeUpdate = sanPhamRepository.findAll().size();

        // Update the sanPham
        SanPham updatedSanPham = sanPhamRepository.findById(sanPham.getId()).get();
        // Disconnect from session so that the updates on updatedSanPham are not directly saved in db
        em.detach(updatedSanPham);
        updatedSanPham
            .name(UPDATED_NAME)
            .sapCode(UPDATED_SAP_CODE)
            .rdCode(UPDATED_RD_CODE)
            .tenChungLoai(UPDATED_TEN_CHUNG_LOAI)
            .donVi(UPDATED_DON_VI)
            .toSanXuat(UPDATED_TO_SAN_XUAT)
            .phanLoai(UPDATED_PHAN_LOAI);

        restSanPhamMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedSanPham.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedSanPham))
            )
            .andExpect(status().isOk());

        // Validate the SanPham in the database
        List<SanPham> sanPhamList = sanPhamRepository.findAll();
        assertThat(sanPhamList).hasSize(databaseSizeBeforeUpdate);
        SanPham testSanPham = sanPhamList.get(sanPhamList.size() - 1);
        assertThat(testSanPham.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testSanPham.getSapCode()).isEqualTo(UPDATED_SAP_CODE);
        assertThat(testSanPham.getRdCode()).isEqualTo(UPDATED_RD_CODE);
        assertThat(testSanPham.getTenChungLoai()).isEqualTo(UPDATED_TEN_CHUNG_LOAI);
        assertThat(testSanPham.getDonVi()).isEqualTo(UPDATED_DON_VI);
        assertThat(testSanPham.getToSanXuat()).isEqualTo(UPDATED_TO_SAN_XUAT);
        assertThat(testSanPham.getPhanLoai()).isEqualTo(UPDATED_PHAN_LOAI);
    }

    @Test
    @Transactional
    void putNonExistingSanPham() throws Exception {
        int databaseSizeBeforeUpdate = sanPhamRepository.findAll().size();
        sanPham.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSanPhamMockMvc
            .perform(
                put(ENTITY_API_URL_ID, sanPham.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(sanPham))
            )
            .andExpect(status().isBadRequest());

        // Validate the SanPham in the database
        List<SanPham> sanPhamList = sanPhamRepository.findAll();
        assertThat(sanPhamList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchSanPham() throws Exception {
        int databaseSizeBeforeUpdate = sanPhamRepository.findAll().size();
        sanPham.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSanPhamMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(sanPham))
            )
            .andExpect(status().isBadRequest());

        // Validate the SanPham in the database
        List<SanPham> sanPhamList = sanPhamRepository.findAll();
        assertThat(sanPhamList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamSanPham() throws Exception {
        int databaseSizeBeforeUpdate = sanPhamRepository.findAll().size();
        sanPham.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSanPhamMockMvc
            .perform(
                put(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(sanPham))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the SanPham in the database
        List<SanPham> sanPhamList = sanPhamRepository.findAll();
        assertThat(sanPhamList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateSanPhamWithPatch() throws Exception {
        // Initialize the database
        sanPhamRepository.saveAndFlush(sanPham);

        int databaseSizeBeforeUpdate = sanPhamRepository.findAll().size();

        // Update the sanPham using partial update
        SanPham partialUpdatedSanPham = new SanPham();
        partialUpdatedSanPham.setId(sanPham.getId());

        partialUpdatedSanPham.rdCode(UPDATED_RD_CODE).tenChungLoai(UPDATED_TEN_CHUNG_LOAI);

        restSanPhamMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSanPham.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedSanPham))
            )
            .andExpect(status().isOk());

        // Validate the SanPham in the database
        List<SanPham> sanPhamList = sanPhamRepository.findAll();
        assertThat(sanPhamList).hasSize(databaseSizeBeforeUpdate);
        SanPham testSanPham = sanPhamList.get(sanPhamList.size() - 1);
        assertThat(testSanPham.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testSanPham.getSapCode()).isEqualTo(DEFAULT_SAP_CODE);
        assertThat(testSanPham.getRdCode()).isEqualTo(UPDATED_RD_CODE);
        assertThat(testSanPham.getTenChungLoai()).isEqualTo(UPDATED_TEN_CHUNG_LOAI);
        assertThat(testSanPham.getDonVi()).isEqualTo(DEFAULT_DON_VI);
        assertThat(testSanPham.getToSanXuat()).isEqualTo(DEFAULT_TO_SAN_XUAT);
        assertThat(testSanPham.getPhanLoai()).isEqualTo(DEFAULT_PHAN_LOAI);
    }

    @Test
    @Transactional
    void fullUpdateSanPhamWithPatch() throws Exception {
        // Initialize the database
        sanPhamRepository.saveAndFlush(sanPham);

        int databaseSizeBeforeUpdate = sanPhamRepository.findAll().size();

        // Update the sanPham using partial update
        SanPham partialUpdatedSanPham = new SanPham();
        partialUpdatedSanPham.setId(sanPham.getId());

        partialUpdatedSanPham
            .name(UPDATED_NAME)
            .sapCode(UPDATED_SAP_CODE)
            .rdCode(UPDATED_RD_CODE)
            .tenChungLoai(UPDATED_TEN_CHUNG_LOAI)
            .donVi(UPDATED_DON_VI)
            .toSanXuat(UPDATED_TO_SAN_XUAT)
            .phanLoai(UPDATED_PHAN_LOAI);

        restSanPhamMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSanPham.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedSanPham))
            )
            .andExpect(status().isOk());

        // Validate the SanPham in the database
        List<SanPham> sanPhamList = sanPhamRepository.findAll();
        assertThat(sanPhamList).hasSize(databaseSizeBeforeUpdate);
        SanPham testSanPham = sanPhamList.get(sanPhamList.size() - 1);
        assertThat(testSanPham.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testSanPham.getSapCode()).isEqualTo(UPDATED_SAP_CODE);
        assertThat(testSanPham.getRdCode()).isEqualTo(UPDATED_RD_CODE);
        assertThat(testSanPham.getTenChungLoai()).isEqualTo(UPDATED_TEN_CHUNG_LOAI);
        assertThat(testSanPham.getDonVi()).isEqualTo(UPDATED_DON_VI);
        assertThat(testSanPham.getToSanXuat()).isEqualTo(UPDATED_TO_SAN_XUAT);
        assertThat(testSanPham.getPhanLoai()).isEqualTo(UPDATED_PHAN_LOAI);
    }

    @Test
    @Transactional
    void patchNonExistingSanPham() throws Exception {
        int databaseSizeBeforeUpdate = sanPhamRepository.findAll().size();
        sanPham.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSanPhamMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, sanPham.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(sanPham))
            )
            .andExpect(status().isBadRequest());

        // Validate the SanPham in the database
        List<SanPham> sanPhamList = sanPhamRepository.findAll();
        assertThat(sanPhamList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchSanPham() throws Exception {
        int databaseSizeBeforeUpdate = sanPhamRepository.findAll().size();
        sanPham.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSanPhamMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(sanPham))
            )
            .andExpect(status().isBadRequest());

        // Validate the SanPham in the database
        List<SanPham> sanPhamList = sanPhamRepository.findAll();
        assertThat(sanPhamList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamSanPham() throws Exception {
        int databaseSizeBeforeUpdate = sanPhamRepository.findAll().size();
        sanPham.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSanPhamMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(sanPham))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the SanPham in the database
        List<SanPham> sanPhamList = sanPhamRepository.findAll();
        assertThat(sanPhamList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteSanPham() throws Exception {
        // Initialize the database
        sanPhamRepository.saveAndFlush(sanPham);

        int databaseSizeBeforeDelete = sanPhamRepository.findAll().size();

        // Delete the sanPham
        restSanPhamMockMvc
            .perform(delete(ENTITY_API_URL_ID, sanPham.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<SanPham> sanPhamList = sanPhamRepository.findAll();
        assertThat(sanPhamList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
