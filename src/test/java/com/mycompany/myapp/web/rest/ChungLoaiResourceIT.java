package com.mycompany.myapp.web.rest;

import static com.mycompany.myapp.web.rest.TestUtil.sameInstant;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.ChungLoai;
import com.mycompany.myapp.repository.ChungLoaiRepository;
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
 * Integration tests for the {@link ChungLoaiResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ChungLoaiResourceIT {

    private static final String DEFAULT_MA_CHUNG_LOAI = "AAAAAAAAAA";
    private static final String UPDATED_MA_CHUNG_LOAI = "BBBBBBBBBB";

    private static final String DEFAULT_TEN_CHUNG_LOAI = "AAAAAAAAAA";
    private static final String UPDATED_TEN_CHUNG_LOAI = "BBBBBBBBBB";

    private static final ZonedDateTime DEFAULT_NGAY_TAO = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_NGAY_TAO = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final String DEFAULT_USERNAME = "AAAAAAAAAA";
    private static final String UPDATED_USERNAME = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/chung-loais";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ChungLoaiRepository chungLoaiRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restChungLoaiMockMvc;

    private ChungLoai chungLoai;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ChungLoai createEntity(EntityManager em) {
        ChungLoai chungLoai = new ChungLoai()
            .maChungLoai(DEFAULT_MA_CHUNG_LOAI)
            .tenChungLoai(DEFAULT_TEN_CHUNG_LOAI)
            .ngayTao(DEFAULT_NGAY_TAO)
            .username(DEFAULT_USERNAME);
        return chungLoai;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ChungLoai createUpdatedEntity(EntityManager em) {
        ChungLoai chungLoai = new ChungLoai()
            .maChungLoai(UPDATED_MA_CHUNG_LOAI)
            .tenChungLoai(UPDATED_TEN_CHUNG_LOAI)
            .ngayTao(UPDATED_NGAY_TAO)
            .username(UPDATED_USERNAME);
        return chungLoai;
    }

    @BeforeEach
    public void initTest() {
        chungLoai = createEntity(em);
    }

    @Test
    @Transactional
    void createChungLoai() throws Exception {
        int databaseSizeBeforeCreate = chungLoaiRepository.findAll().size();
        // Create the ChungLoai
        restChungLoaiMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(chungLoai))
            )
            .andExpect(status().isCreated());

        // Validate the ChungLoai in the database
        List<ChungLoai> chungLoaiList = chungLoaiRepository.findAll();
        assertThat(chungLoaiList).hasSize(databaseSizeBeforeCreate + 1);
        ChungLoai testChungLoai = chungLoaiList.get(chungLoaiList.size() - 1);
        assertThat(testChungLoai.getMaChungLoai()).isEqualTo(DEFAULT_MA_CHUNG_LOAI);
        assertThat(testChungLoai.getTenChungLoai()).isEqualTo(DEFAULT_TEN_CHUNG_LOAI);
        assertThat(testChungLoai.getNgayTao()).isEqualTo(DEFAULT_NGAY_TAO);
        assertThat(testChungLoai.getUsername()).isEqualTo(DEFAULT_USERNAME);
    }

    @Test
    @Transactional
    void createChungLoaiWithExistingId() throws Exception {
        // Create the ChungLoai with an existing ID
        chungLoai.setId(1L);

        int databaseSizeBeforeCreate = chungLoaiRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restChungLoaiMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(chungLoai))
            )
            .andExpect(status().isBadRequest());

        // Validate the ChungLoai in the database
        List<ChungLoai> chungLoaiList = chungLoaiRepository.findAll();
        assertThat(chungLoaiList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllChungLoais() throws Exception {
        // Initialize the database
        chungLoaiRepository.saveAndFlush(chungLoai);

        // Get all the chungLoaiList
        restChungLoaiMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(chungLoai.getId().intValue())))
            .andExpect(jsonPath("$.[*].maChungLoai").value(hasItem(DEFAULT_MA_CHUNG_LOAI)))
            .andExpect(jsonPath("$.[*].tenChungLoai").value(hasItem(DEFAULT_TEN_CHUNG_LOAI)))
            .andExpect(jsonPath("$.[*].ngayTao").value(hasItem(sameInstant(DEFAULT_NGAY_TAO))))
            .andExpect(jsonPath("$.[*].username").value(hasItem(DEFAULT_USERNAME)));
    }

    @Test
    @Transactional
    void getChungLoai() throws Exception {
        // Initialize the database
        chungLoaiRepository.saveAndFlush(chungLoai);

        // Get the chungLoai
        restChungLoaiMockMvc
            .perform(get(ENTITY_API_URL_ID, chungLoai.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(chungLoai.getId().intValue()))
            .andExpect(jsonPath("$.maChungLoai").value(DEFAULT_MA_CHUNG_LOAI))
            .andExpect(jsonPath("$.tenChungLoai").value(DEFAULT_TEN_CHUNG_LOAI))
            .andExpect(jsonPath("$.ngayTao").value(sameInstant(DEFAULT_NGAY_TAO)))
            .andExpect(jsonPath("$.username").value(DEFAULT_USERNAME));
    }

    @Test
    @Transactional
    void getNonExistingChungLoai() throws Exception {
        // Get the chungLoai
        restChungLoaiMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewChungLoai() throws Exception {
        // Initialize the database
        chungLoaiRepository.saveAndFlush(chungLoai);

        int databaseSizeBeforeUpdate = chungLoaiRepository.findAll().size();

        // Update the chungLoai
        ChungLoai updatedChungLoai = chungLoaiRepository.findById(chungLoai.getId()).get();
        // Disconnect from session so that the updates on updatedChungLoai are not directly saved in db
        em.detach(updatedChungLoai);
        updatedChungLoai
            .maChungLoai(UPDATED_MA_CHUNG_LOAI)
            .tenChungLoai(UPDATED_TEN_CHUNG_LOAI)
            .ngayTao(UPDATED_NGAY_TAO)
            .username(UPDATED_USERNAME);

        restChungLoaiMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedChungLoai.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedChungLoai))
            )
            .andExpect(status().isOk());

        // Validate the ChungLoai in the database
        List<ChungLoai> chungLoaiList = chungLoaiRepository.findAll();
        assertThat(chungLoaiList).hasSize(databaseSizeBeforeUpdate);
        ChungLoai testChungLoai = chungLoaiList.get(chungLoaiList.size() - 1);
        assertThat(testChungLoai.getMaChungLoai()).isEqualTo(UPDATED_MA_CHUNG_LOAI);
        assertThat(testChungLoai.getTenChungLoai()).isEqualTo(UPDATED_TEN_CHUNG_LOAI);
        assertThat(testChungLoai.getNgayTao()).isEqualTo(UPDATED_NGAY_TAO);
        assertThat(testChungLoai.getUsername()).isEqualTo(UPDATED_USERNAME);
    }

    @Test
    @Transactional
    void putNonExistingChungLoai() throws Exception {
        int databaseSizeBeforeUpdate = chungLoaiRepository.findAll().size();
        chungLoai.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restChungLoaiMockMvc
            .perform(
                put(ENTITY_API_URL_ID, chungLoai.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(chungLoai))
            )
            .andExpect(status().isBadRequest());

        // Validate the ChungLoai in the database
        List<ChungLoai> chungLoaiList = chungLoaiRepository.findAll();
        assertThat(chungLoaiList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchChungLoai() throws Exception {
        int databaseSizeBeforeUpdate = chungLoaiRepository.findAll().size();
        chungLoai.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restChungLoaiMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(chungLoai))
            )
            .andExpect(status().isBadRequest());

        // Validate the ChungLoai in the database
        List<ChungLoai> chungLoaiList = chungLoaiRepository.findAll();
        assertThat(chungLoaiList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamChungLoai() throws Exception {
        int databaseSizeBeforeUpdate = chungLoaiRepository.findAll().size();
        chungLoai.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restChungLoaiMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(chungLoai))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ChungLoai in the database
        List<ChungLoai> chungLoaiList = chungLoaiRepository.findAll();
        assertThat(chungLoaiList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateChungLoaiWithPatch() throws Exception {
        // Initialize the database
        chungLoaiRepository.saveAndFlush(chungLoai);

        int databaseSizeBeforeUpdate = chungLoaiRepository.findAll().size();

        // Update the chungLoai using partial update
        ChungLoai partialUpdatedChungLoai = new ChungLoai();
        partialUpdatedChungLoai.setId(chungLoai.getId());

        partialUpdatedChungLoai.maChungLoai(UPDATED_MA_CHUNG_LOAI).tenChungLoai(UPDATED_TEN_CHUNG_LOAI);

        restChungLoaiMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedChungLoai.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedChungLoai))
            )
            .andExpect(status().isOk());

        // Validate the ChungLoai in the database
        List<ChungLoai> chungLoaiList = chungLoaiRepository.findAll();
        assertThat(chungLoaiList).hasSize(databaseSizeBeforeUpdate);
        ChungLoai testChungLoai = chungLoaiList.get(chungLoaiList.size() - 1);
        assertThat(testChungLoai.getMaChungLoai()).isEqualTo(UPDATED_MA_CHUNG_LOAI);
        assertThat(testChungLoai.getTenChungLoai()).isEqualTo(UPDATED_TEN_CHUNG_LOAI);
        assertThat(testChungLoai.getNgayTao()).isEqualTo(DEFAULT_NGAY_TAO);
        assertThat(testChungLoai.getUsername()).isEqualTo(DEFAULT_USERNAME);
    }

    @Test
    @Transactional
    void fullUpdateChungLoaiWithPatch() throws Exception {
        // Initialize the database
        chungLoaiRepository.saveAndFlush(chungLoai);

        int databaseSizeBeforeUpdate = chungLoaiRepository.findAll().size();

        // Update the chungLoai using partial update
        ChungLoai partialUpdatedChungLoai = new ChungLoai();
        partialUpdatedChungLoai.setId(chungLoai.getId());

        partialUpdatedChungLoai
            .maChungLoai(UPDATED_MA_CHUNG_LOAI)
            .tenChungLoai(UPDATED_TEN_CHUNG_LOAI)
            .ngayTao(UPDATED_NGAY_TAO)
            .username(UPDATED_USERNAME);

        restChungLoaiMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedChungLoai.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedChungLoai))
            )
            .andExpect(status().isOk());

        // Validate the ChungLoai in the database
        List<ChungLoai> chungLoaiList = chungLoaiRepository.findAll();
        assertThat(chungLoaiList).hasSize(databaseSizeBeforeUpdate);
        ChungLoai testChungLoai = chungLoaiList.get(chungLoaiList.size() - 1);
        assertThat(testChungLoai.getMaChungLoai()).isEqualTo(UPDATED_MA_CHUNG_LOAI);
        assertThat(testChungLoai.getTenChungLoai()).isEqualTo(UPDATED_TEN_CHUNG_LOAI);
        assertThat(testChungLoai.getNgayTao()).isEqualTo(UPDATED_NGAY_TAO);
        assertThat(testChungLoai.getUsername()).isEqualTo(UPDATED_USERNAME);
    }

    @Test
    @Transactional
    void patchNonExistingChungLoai() throws Exception {
        int databaseSizeBeforeUpdate = chungLoaiRepository.findAll().size();
        chungLoai.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restChungLoaiMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, chungLoai.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(chungLoai))
            )
            .andExpect(status().isBadRequest());

        // Validate the ChungLoai in the database
        List<ChungLoai> chungLoaiList = chungLoaiRepository.findAll();
        assertThat(chungLoaiList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchChungLoai() throws Exception {
        int databaseSizeBeforeUpdate = chungLoaiRepository.findAll().size();
        chungLoai.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restChungLoaiMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(chungLoai))
            )
            .andExpect(status().isBadRequest());

        // Validate the ChungLoai in the database
        List<ChungLoai> chungLoaiList = chungLoaiRepository.findAll();
        assertThat(chungLoaiList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamChungLoai() throws Exception {
        int databaseSizeBeforeUpdate = chungLoaiRepository.findAll().size();
        chungLoai.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restChungLoaiMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(chungLoai))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ChungLoai in the database
        List<ChungLoai> chungLoaiList = chungLoaiRepository.findAll();
        assertThat(chungLoaiList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteChungLoai() throws Exception {
        // Initialize the database
        chungLoaiRepository.saveAndFlush(chungLoai);

        int databaseSizeBeforeDelete = chungLoaiRepository.findAll().size();

        // Delete the chungLoai
        restChungLoaiMockMvc
            .perform(delete(ENTITY_API_URL_ID, chungLoai.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<ChungLoai> chungLoaiList = chungLoaiRepository.findAll();
        assertThat(chungLoaiList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
