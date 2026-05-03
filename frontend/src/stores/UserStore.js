import { makeAutoObservable, runInAction } from "mobx";
import apiClient from "../api/client";

class UserStore {
  users = [];
  isLoading = false;
  error = null;

  constructor() {
    makeAutoObservable(this);
  }

  async getAllUsers() {
    this.isLoading = true;
    this.error = null;

    try {
      const response = await apiClient.get("/users");

      runInAction(() => {
        this.users = response.data;
        this.isLoading = false;
        this.error = null;
      });

      return { success: true, data: response.data };
    } catch (error) {
      let errorMessage = "Ошибка загрузки пользователей";

      console.log(error);

      runInAction(() => {
        this.isLoading = false;
        this.error = errorMessage;
      });

      return { success: false, error: errorMessage };
    }
  }

  async bindUserWithGrade(gradeId, userId) {
    this.isLoading = true;
    this.error = null;

    try {
      const response = await apiClient.put(
        `/users/${userId}/bind-grade`,
        gradeId,
      );

      console.log(response);

      const data = response.data;

      runInAction(() => {
        const numericId = Number(userId);
        const index = this.users.findIndex((u) => u.id === numericId);

        if (index !== -1) {
          this.users[index] = data;
        }

        ((this.isLoading = false), (this.error = null));
      });

      return { success: true, data };
    } catch (error) {
      let errorMessage = "Ошибка добавления пользователя к классу";
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
        ((this.isLoading = false), (this.error = errorMessage));
      });

      return {
        success: false,
        error: errorMessage,
        serverErrors: serverErrors,
      };
    }
  }

  async unbindUserWithGrade(userId) {
    this.isLoading = true;
    this.error = null;

    try {
      const response = await apiClient.put(`/users/${userId}/unbind-grade`);

      const data = response.data;

      runInAction(() => {
        const numericId = Number(userId);
        const index = this.users.findIndex((u) => u.id === numericId);

        if (index !== -1) {
          this.users[index] = data;
        }

        this.isLoading = false;
        this.error = null;
      });
      return { success: true, data };
    } catch (error) {
      let errorMessage = "Не удалось снять пользователя с класса";
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
        ((this.isLoading = false), (this.error = errorMessage));
      });

      return {
        success: false,
        error: errorMessage,
        serverErrors: serverErrors,
      };
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
export default  new UserStore();