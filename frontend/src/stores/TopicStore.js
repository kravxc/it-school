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
      const data = response.data;

      console.log(data);

      runInAction(() => {
        const numericId = Number(id);

        const index = this.topics.findIndex((t) => t.id === numericId);
        if (index !== -1) {
          this.topics[index] = data;
        }

        this.currentTopic = data;
        this.isLoading = false;
        this.error = null;

        console.log(this.currentTopic);
      });

      return { success: true, data };
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
      const response = await apiClient.post("/topics", topicData);

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
        const numericId = Number(id);
        const index = this.topics.findIndex((t) => t.id === numericId);

        if (index !== -1) {
          this.topics[index] = data;
        }

        if (this.currentTopic?.id === numericId) {
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

  async deleteTopic(id) {
    this.isLoading = true;
    this.error = null;

    try {
      await apiClient.delete(`/topics/${id}`);

      runInAction(() => {
        const numericId = Number(id);
        this.topics = this.topics.filter((t) => t.id !== numericId);

        if (this.currentTopic?.id === numericId) {
          this.currentTopic = null;
        }

        this.isLoading = false;
        this.error = null;
      });

      return { success: true };
    } catch (error) {
      let errorMessage = "Ошибка удаления темы";

      if (error.response) {
        const errorData = error.response.data;
        console.log("Error from server:", errorData);

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

  async fetchTopicLessons(topicId) {
    this.isLoading = true;
    this.error = null;

    try {
      const response = await apiClient.get(`/lessons/topic/${topicId}`);
      const data = response.data;

      console.log(data);

      runInAction(() => {
        const numericTopicId = Number(topicId);
        const currentId = this.currentTopic?.id;

        console.log({ numericTopicId, currentId });

        if (currentId === numericTopicId) {
          this.currentTopic = {
            ...this.currentTopic,
            lessons: data,
          };
          console.log(this.currentTopic);
        }

        const index = this.topics.findIndex((t) => t.id === numericTopicId);
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
        console.log("Error from server:", errorData);

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
}

export default new TopicStore();
