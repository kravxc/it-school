import { makeAutoObservable, runInAction } from "mobx";
import apiClient from "../api/client";


class TopicStore {
  topics = [];
  currentTopic = null;
  isLoading = false;
  error = null;

  constructor() {
    makeAutoObservable(this);
  }

  async fetchAllTopics() {
    this.isLoading = true;
    this.error = null;

    try {
      const response = await apiClient.get(`/topics`);

      runInAction(() => {
        this.topics = response.data;
        this.isLoading = false;
        this.error = null;
      });

      return { success: true, data: response.data };
    } catch (error) {
      let errorMessage = "Ошибка загрузки тем";
      console.log(error);

      runInAction(() => {
        this.isLoading = false;
        this.error = errorMessage;
      });

      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  async fetchTopicById(id) {
    this.isLoading = true;
    this.error = null;

    try {
      const response = await apiClient.get(`/topics/${id}`);

      runInAction(() => {
        const index = this.topics.findIndex((t) => t.id === id);

        if (index !== -1) {
          this.topics[index] = response.data;
        }

        this.currentTopic = response.data;
        this.isLoading = false;
        this.error = null;
      });

      return { success: true, data: response.data };
    } catch (e) {
      let errorMessage = "Ошибка загрузки темы";

      console.log(e);

      runInAction(() => {
        this.isLoading = false;
        this.error = errorMessage;
      });

      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  async createTopic(topicData) {
    this.isLoading = true;
    this.error = null;

    try {
      const response = apiClient.post("/topics", topicData);

      console.log(response);

      const data = response.data;

      runInAction(() => {
        this.topics.push(data);
        this.isLoading = false;
        this.error = null;
      });

      return { success: true, data };
    } catch (error) {
      let errorMessage = "Ошибка создания темы";
      let serverErrors = null;

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

  async updateTopic(id, topicData) {
    this.isLoading = true;
    this.error = null;

    try {
      const response = await apiClient.put(`/topics/${id}`, topicData);

      console.log(response);

      const data = response.data;

      runInAction(() => {
        const index = this.topics.findIndex((t) => t.id === id);

        if (index !== -1) {
          this.topics[index] = data;
        }

        if (this.currentTopic?.id === id) {
          this.currentTopic = data;
        }

        this.isLoading = false;
        this.error = null;
      });

      return { success: true, data };
    } catch (error) {
      let errorMessage = "Ошибка обновления темы";
      let serverErrors = null;

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

  async deleteTopic(id) {
    this.isLoading = true;
    this.error = null;

    try {
      await apiClient.delete(`/topics/${id}`);

      runInAction(() => {
        this.topics = this.topics.filter((t) => t.id !== id);

        if (this.currentTopic?.id === id) {
          this.currentTopic.id = null;
        }

        this.isLoading = false;
        this.error = null;
      });

      return { success: true };
    } catch (error) {
      let errorMessage = "Ошибка удаления темы";

      if (error.response) {
        const errorData = error.response.data;
        console.log("Error data from server:", errorData);

        if (errorData?.message) {
          errorMessage = errorData.message;
        }

        runInAction(() => {
          this.isLoading = false;
          this.error = errorMessage;
        });

        return {
          success: false,
          error: errorMessage,
        };
      }
    }
  }

  async fetchTopicLessons(topicId) {
    this.isLoading = true;
    this.error = null;

    try {
      const response = await apiClient.get(`lessons/topic/${topicId}`);

      const data = response.data;

      runInAction(() => {
        if (this.currentTopic?.id === topicId) {
          this.currentTopic = {
            ...this.currentTopic,
            lessons: data,
          };
        }
        const index = this.topics.findIndex((t) => t.id === topicId);

        if (index !== -1) {
          this.topics[index] = {
            ...this.topics[index],
            lessons: data,
          };
        }

        this.isLoading = false;
        this.error = null;
      });

      return { success: true, data };
    } catch (error) {
      let errorMessage = "Ошибка загрузки уроков";

      if (error.response) {
        const errorData = error.response.data;
        console.log("Error data from server:", errorData);

        if (errorData?.message) {
          errorMessage = errorData.message;
        }
        if (errorData?.error) {
          errorMessage = errorData.error;
        }
      }

      runInAction(() => {
        this.isLoading = false;
        this.error = errorMessage;
      });

      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  clearError() {
    this.error = null;
  }

  clearCurrentTopic() {
    this.currentTopic = null;
  }

  reset() {
    runInAction(() => {
      this.topics = [];
      this.currentTopic = null;
      this.isLoading = false;
      this.error = null;
    });
  }

  async fetchTopicsByGrade(gradeId) {
    this.isLoading = true;
    this.error = null;

    try {
      const response = await apiClient.get(`/topics/grade/${gradeId}`);

      runInAction(() => {
        this.topics = response.data;
        this.isLoading = false;
        this.error = null;
      });

      return { success: true, data: response.data };
    } catch (error) {
      let errorMessage = "Ошибка загрузки тем для класса";

      if (error.response) {
        const errorData = error.response.data;
        console.log(errorData);

        if (errorData?.message) {
          errorMessage = errorData.message;
        }
      }

      runInAction(() => {
        this.isLoading = false;
        this.error = errorMessage;
      });

      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  getTopicsByGradeId(gradeId) {
    return this.topics.filter((topic) => topic.gradeId === gradeId);
  }
  
}

export default new TopicStore();