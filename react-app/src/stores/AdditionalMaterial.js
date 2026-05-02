import apiClient from "../api/client";
import { makeAutoObservable, runInAction } from "mobx";

class AdditionalMaterialStore {
  additionalMaterials = [];
  currentMaterial = null;
  isLoading = false;
  error = null;

  constructor() {
    makeAutoObservable(this);
  }

  async createAddMaterial(addMaterialData) {
    this.isLoading = true;
    this.error = null;

    try {
      const response = await apiClient.post(
        "/additional-materials",
        addMaterialData,
      );

      const data = response.data;

      runInAction(() => {
        this.additionalMaterials.push(data);
        this.isLoading = false;
        this.error = null;
      });

      return { success: true, data };
    } catch (error) {
      let errorMessage = "Ошибка создания дополнительного материала";
      let serverErrors = null;

      if (error.response) {
        const errorData = error.response.data;
        if (errorData?.message) {
          errorMessage = errorData.message;
        }
        if (errorData?.errors) {
          serverErrors = errorData.errors;
        }
      }

      runInAction(() => {
        this.isLoading = false;
        this.error = errorMessage;
      });

      return {
        success: false,
        error: errorMessage,
        serverErrors: serverErrors,
      };
    }
  }

  async fetchByLessonId(lessonId) {
    this.isLoading = true;
    this.error = null;

    try {
      const response = await apiClient.get(
        `/additional-materials/lesson/${lessonId}`,
      );
      const data = response.data;

      runInAction(() => {

        const lessonMaterials = data;
        const otherMaterials = this.additionalMaterials.filter(
          (m) => m.lessonId !== lessonId,
        );

        this.additionalMaterials = [...otherMaterials, ...lessonMaterials];
        this.isLoading = false;
        this.error = null;
      });

      return { success: true, data };
    } catch (error) {
      let errorMessage = "Ошибка загрузки дополнительных материалов";

        console.log(error);
        
      runInAction(() => {
        this.isLoading = false;
        this.error = errorMessage;
      });

      return { success: false, error: errorMessage };
    }
  }

  async fetchAddMaterialById(id) {
    this.isLoading = true;
    this.error = null;

    try {
      const response = await apiClient.get(`/additional-materials/${id}`);
      const data = response.data;

      runInAction(() => {
        this.currentMaterial = data;
        this.isLoading = false;
        this.error = null;
      });

      return { success: true, data };
    } catch (error) {
      let errorMessage = "Ошибка загрузки материала";

      if (error.response?.status === 404) {
        errorMessage = "Материал не найден";
      }

      runInAction(() => {
        this.isLoading = false;
        this.error = errorMessage;
        this.currentMaterial = null;
      });

      return { success: false, error: errorMessage };
    }
  }

  async updateMaterial(id, updateData) {
    this.isLoading = true;
    this.error = null;

    try {
      const response = await apiClient.put(
        `/additional-materials/${id}`,
        updateData,
      );
      const data = response.data;

      runInAction(() => {
        const index = this.additionalMaterials.findIndex((m) => m.id === id);
        if (index !== -1) {
          this.additionalMaterials[index] = data;
        }
        if (this.currentMaterial?.id === id) {
          this.currentMaterial = data;
        }
        this.isLoading = false;
        this.error = null;
      });

      return { success: true, data };
    } catch (error) {
      let errorMessage = "Ошибка обновления материала";
      let serverErrors = null;

      if (error.response) {
        const errorData = error.response.data;
        if (errorData?.message) {
          errorMessage = errorData.message;
        }
        if (errorData?.errors) {
          serverErrors = errorData.errors;
        }
      }

      runInAction(() => {
        this.isLoading = false;
        this.error = errorMessage;
      });

      return {
        success: false,
        error: errorMessage,
        serverErrors: serverErrors,
      };
    }
  }

  async deleteMaterial(id) {
    this.isLoading = true;
    this.error = null;

    try {
      await apiClient.delete(`/additional-materials/${id}`);

      runInAction(() => {
        this.additionalMaterials = this.additionalMaterials.filter(
          (m) => m.id !== id,
        );
        if (this.currentMaterial?.id === id) {
          this.currentMaterial = null;
        }
        this.isLoading = false;
        this.error = null;
      });

      return { success: true };
    } catch (error) {
      let errorMessage = "Ошибка удаления материала";

      if (error.response?.status === 404) {
        errorMessage = "Материал не найден";
      }

      runInAction(() => {
        this.isLoading = false;
        this.error = errorMessage;
      });

      return { success: false, error: errorMessage };
    }
  }

  async fetchMaterialsByLessonId(lessonId) {
    return this.fetchByLessonId(lessonId);
  }

  clearError() {
    this.error = null;
  }

  reset() {
    runInAction(() => {
      this.additionalMaterials = [];
      this.currentMaterial = null;
      this.isLoading = false;
      this.error = null;
    });
  }

  clearLessonMaterials(lessonId) {
    runInAction(() => {
      this.additionalMaterials = this.additionalMaterials.filter(
        (m) => m.lessonId !== lessonId,
      );
    });
  }

  getMaterialsByLessonId(lessonId) {
    return this.additionalMaterials.filter((m) => m.lessonId === lessonId);
  }
}

export default new AdditionalMaterialStore();
