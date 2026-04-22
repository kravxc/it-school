import { makeAutoObservable, runInAction } from "mobx";
import apiClient from "../api/client";

class FileStore {
  lessonFiles = [];
  isLoading = false;
  error = null;

  constructor() {
    makeAutoObservable(this);
  }

  async fetchLessonFiles(lessonId) {
    this.isLoading = true;
    this.error = null;

    try {
      const response = await apiClient.get(`/lesson-files/lesson/${lessonId}`);
      console.log(response);

      runInAction(() => {
        const newFiles = response.data;
        const existingIds = new Set(this.lessonFiles.map((f) => f.id));
        const filesToAdd = newFiles.filter((f) => !existingIds.has(f.id));

        this.lessonFiles = [...this.lessonFiles, ...filesToAdd];
        this.isLoading = false;
        this.error = null;
      });

      return { success: true, data: response.data };
    } catch (error) {
      let errorMessage = "Ошибка загрузки файлов урока";
      console.log(error);

      runInAction(() => {
        this.isLoading = false;
        this.error = errorMessage;
      });

      return { success: false, error: errorMessage };
    }
  }

  async downloadFile(fileId, fileName) {
    this.isLoading = true;
    this.error = null;

    try {
      const response = await apiClient.get(`/files/download/${fileId}`, {
        responseType: "blob",
      });

      console.log("File response:", response);

      const blob = new Blob([response.data]);

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName || "file";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(url);

      runInAction(() => {
        this.isLoading = false;
        this.error = null;
      });

      return { success: true };
    } catch (error) {
      let errorMessage = "Ошибка скачивания файла";
      console.log(error);

      runInAction(() => {
        this.isLoading = false;
        this.error = errorMessage;
      });

      return { success: false, error: errorMessage };
    }
  }

  async getFilePreview(fileId) {
    try {
      const response = await apiClient.get(`/files/download/${fileId}`, {
        responseType: "blob",
      });

      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);

      return { success: true, url };
    } catch (error) {
      console.log("Error getting file preview:", error);
      return { success: false, error: "Ошибка загрузки превью" };
    }
  }

  isImageFile(fileName) {
    if (!fileName) return false;
    const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "webp", "svg"];
    const ext = fileName.split(".").pop()?.toLowerCase();
    return imageExtensions.includes(ext);
  }

  async getFileInfo(fileId) {
    try {
      const response = await apiClient.get(`/lesson-files/${fileId}`);
      return { success: true, data: response.data };
    } catch (error) {
      console.log("Error getting file info:", error);
      return { success: false, error: "Ошибка получения информации о файле" };
    }
  }

  async uploadFile(lessonId, file, fileData = {}) {
    this.isLoading = true;
    this.error = null;

    try {
      const formData = new FormData();
      formData.append("file", file);

      if (fileData.title) {
        formData.append("title", fileData.title);
      }
      if (fileData.description) {
        formData.append("description", fileData.description);
      }

      const response = await apiClient.post(
        `/lesson-files/upload/${lessonId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      console.log("Upload response:", response);

      runInAction(() => {
        this.lessonFiles.push(response.data);
        this.isLoading = false;
        this.error = null;
      });

      return { success: true, data: response.data };
    } catch (error) {
      let errorMessage = "Ошибка загрузки файла";
      console.log(error);

      runInAction(() => {
        this.isLoading = false;
        this.error = errorMessage;
      });

      return { success: false, error: errorMessage };
    }
  }

  async deleteFile(fileId) {
    this.isLoading = true;
    this.error = null;

    try {
      await apiClient.delete(`/lesson-files/${fileId}`);

      runInAction(() => {
        this.lessonFiles = this.lessonFiles.filter((f) => f.id !== fileId);
        this.isLoading = false;
        this.error = null;
      });

      return { success: true };
    } catch (error) {
      let errorMessage = "Ошибка удаления файла";
      console.log(error);

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
      this.lessonFiles = [];
      this.isLoading = false;
      this.error = null;
    });
  }

  clearLessonFiles(lessonId) {
    runInAction(() => {
      this.lessonFiles = this.lessonFiles.filter(
        (f) => f.lessonId !== lessonId,
      );
    });
  }
}

export default new FileStore();
