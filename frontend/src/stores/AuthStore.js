import { makeAutoObservable, runInAction } from "mobx";
import { deleteCookie, getCookie, setCookie } from "../utils/cookies";
import apiClient from "../api/client";

class AuthStore {
  user = null;
  token = getCookie("auth_token");
  isLoading = false;
  error = null;
  isAuthenticated = false;

  constructor() {
    makeAutoObservable(this);

    const savedToken = getCookie("auth_token");
    console.log("Constructor - saved token:", savedToken);

    if (savedToken) {
      this.token = savedToken;
      this.isAuthenticated = true;
      this.fetchCurrentUser();
    }
  }

  get gradeId() {
    return this.user?.gradeId || null;
  }

  get gradeDisplayName() {
    return this.user?.gradeDisplayName || null;
  }

  get redirectPath() {
    if (!this.user) return "/";
    if (this.isAdmin) return "/admin";
    return "/courses";
  }

  async signup(userData) {
    this.isLoading = true;
    this.error = null;

    try {
      const response = await apiClient.post("/auth/signup", userData);
      const data = response.data;
      console.log("Signup response:", data);

      runInAction(() => {
        setCookie("auth_token", data.token, 1);
        this.token = data.token;
        this.isAuthenticated = true;
      });

      console.log("Token saved:", getCookie("auth_token"));

      await this.fetchCurrentUser();

      runInAction(() => {
        this.isLoading = false;
        this.error = null;
      });

      return { success: true, data };
    } catch (error) {
      runInAction(() => {
        this.error = error.response?.data?.message || "Ошибка регистрации";
        this.isLoading = false;
      });
      return {
        success: false,
        error: this.error,
        serverErrors: error.response?.data?.errors || null,
      };
    }
  }

  async login(email, password) {
    this.isLoading = true;
    this.error = null;

    try {
      const response = await apiClient.post("/auth/login", { email, password });
      console.log(response);

      const data = response.data;
      console.log(data);

      setCookie("auth_token", data.token, 1);

      runInAction(() => {
        this.token = data.token;
        this.isAuthenticated = true;
      });

      await this.fetchCurrentUser();

      runInAction(() => {
        this.isLoading = false;
        this.error = null;
      });

      return { success: true, data };
    } catch (error) {
      let errorMessage = "Ошибка входа";
      let serverErrors = null;

      if (error.response) {
        const errorData = error.response.data;
        console.log("Error data:", errorData);

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
        this.isAuthenticated = false;
      });

      return {
        success: false,
        error: errorMessage,
        serverErrors: serverErrors,
      };
    }
  }

  async fetchCurrentUser() {
    const currentToken = this.token || getCookie("auth_token");

    if (!currentToken) {
      console.warn("No token available for fetchCurrentUser");
      return;
    }

    try {
      const response = await apiClient.get("/users/me");
      console.log("Current user: ", response.data);

      runInAction(() => {
        this.user = {
          id: response.data.id,
          name: response.data.name,
          email: response.data.email,
          role: response.data.role,
          gradeId: response.data.gradeId,
          gradeName: response.data.gradeName,
          gradeDisplayName: response.data.gradeDisplayName,
          createdAt: response.data.createdAt,
          updatedAt: response.data.updatedAt
        };
        this.isAuthenticated = true;
      });

      console.log("User loaded successfully:", this.user);
    } catch (error) {
      console.error("Failed to fetch user:", error);
      if (error.response?.status === 401) {
        this.logout();
      }
    }
  }

  logout() {
    deleteCookie("auth_token");
    runInAction(() => {
      this.user = null;
      this.token = null;
      this.isAuthenticated = false;
      this.error = null;
    });
  }

  clearError() {
    this.error = null;
  }

  get isTeacher() {
    return this.user?.role === "teacher";
  }

  get isAdmin() {
    return this.user?.role === "admin";
  }

  get isStudent() {
    return this.user?.role === "student";
  }
}

export default new AuthStore();
