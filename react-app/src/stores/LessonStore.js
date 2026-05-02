import { makeAutoObservable, runInAction } from "mobx";
import apiClient from "../api/client";

class LessonStore {
  lessons = [];
  isLoading = false;
  error = null;

  constructor() {
    makeAutoObservable(this);
  }

  async fetchAllLessons() {
    this.isLoading = true;
    this.error = null;

    try {
      const response = await apiClient.get("/lessons");

      runInAction(() => {
        ((this.lessons = response.data),
          (this.isLoading = false),
          (this.error = null));
      });

      return { success: true, data: response.data };
    } catch (error) {
      let errorMessage = "Ошибка загрузки уроков";

      console.log(error);

      runInAction(() => {
        ((this.isLoading = false), (this.error = errorMessage));
      });

      return { success: false, error: errorMessage };
    }
  }

  async createLesson(lessonData) {
    this.isLoading = true;
    this.error = null;

    try {
      const response = await apiClient.post("/lessons", lessonData);

      console.log(response);

      const data = response.data;

      runInAction(() => {
        this.lessons.push(data);
        this.isLoading = false;
        this.error = null;
      });

      return { success: true, data };
    } catch (error) {
      let errorMessage = "Ошибка при создании урока";
      let serverErrors = null;

      console.log(error);

      if (error.response) {
        const errorData = error.response.data;
        console.log("Error data from server:", errorData);

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

  async updateLesson(id, lessonData) {
    this.isLoading = true;
    this.error = null;

    try {
      const response = await apiClient.put(`/lessons/${id}`, lessonData);

      console.log(response);

      const data = response.data;

      runInAction(() => {
        const numericId = Number(id);
        const index = this.lessons.findIndex((l) => l.id === numericId);

        if (index !== -1) {
          this.lessons[index] = data;
        }

        this.isLoading = false;
        this.error = null;
      });

      return { success: true, data };
    } catch (error) {
      let errorMessage = "Ошибка при обновлении урока";
      let serverErrors = null;

      console.log(error);

      if (error.response) {
        const errorData = error.response.data;
        console.log("Error from server:", errorData);

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

  async deleteLesson(id) {
    this.isLoading = true;
    this.error = null;

    try {
      await apiClient.delete(`/lessons/${id}`);

      runInAction(() => {
        const numericId = Number(id);
        this.topics = this.lessons.filter((l) => l.id !== numericId);

        this.isLoading = false;
        this.error = null;
      });

      return { success: true };
    } catch (error) {
      let errorMessage = "Ошибка удаления урока";

      console.log(error);

      if (error.response) {
        const errorData = error.response.data;
        console.log("Error from server:", errorData);
        if (error?.message) {
          errorMessage = errorData.message;
        }
      }

      runInAction(() => {
        this.isLoading = false;
        this.error = errorMessage;
      });

      return { success: false, error: errorMessage };
    }
  }

  clearError() {
    this.error = null;
  }

  reset() {
    runInAction(() => {
      this.topics = [];
      this.currentTopic = null;
      this.isLoading = false;
      this.error = null;
    });
  }
}

export default new LessonStore();