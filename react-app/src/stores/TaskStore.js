import { makeAutoObservable, runInAction } from "mobx";
import apiClient from "../api/client";

class TaskStore {
  tasks = [];
  isLoading = false;
  error = null;

  constructor() {
    makeAutoObservable(this);
  }


  async fetchAllTasks(){
    this.isLoading = true;
    this.error = null;
    
    try {
        const response = await apiClient.get("/tasks");

        runInAction(()=>{
            this.tasks = response.data,
            this.isLoading = false,
            this.error = null
        });

        return { success: true, data: response.data }
    } catch (error) {
        let errorMessage = "Ошибка загрузки задач";

        console.log(error);

        runInAction(()=>{
            this.isLoading = false,
            this.error = errorMessage
        });
        
        return { success: false, error: errorMessage};
    }
  }


  async createTask(taskData) {
    this.isLoading = true;
    this.error = null;

    try {
      const response = await apiClient.post("/tasks", taskData);

      console.log(response);

      const data = response.data;

      runInAction(() => {
        (this.tasks.push(data), (this.isLoading = false), (this.error = null));
      });
      return { success: true, data };
    } catch (error) {
      let errorMessage = "Ошибка при создании задачи";
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

  async findTaskById(taskId) {
    this.isLoading = true;
    this.error = null;

    try {
      const response = await apiClient.get(`/tasks/${taskId}`);

      const data = response.data;
      console.log(data);

      runInAction(() => {
        const numericId = Number(taskId);
        const index = this.tasks.findIndex((t) => t.id === numericId);

        if (index !== 1) {
          this.tasks[index] = data;
        }

        this.isLoading = false;
        this.error = null;
      });

      return { success: true, data };
    } catch (error) {
      let errorMessage = "Ошибка загрузки урока";

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

  async updateTask(id, taskData) {
    this.isLoading = true;
    this.error = null;

    try {
      const response = await apiClient.put(`/tasks/${id}`, taskData);

      console.log(response);

      const data = response.data;

      runInAction(() => {
        const numericId = Number(id);
        const index = this.tasks.findIndex((t) => t.id === numericId);

        if (index !== -1) {
          this.tasks[index] = data;
        }

        this.isLoading = false;
        this.error = null;
      });

      return { success: true, data };
    } catch (error) {
      let errorMessage = "Ошибка при обновлении задачи";
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

  async deleteTask(id) {
    this.isLoading = true;
    this.error = null;

    try {
      await apiClient.delete(`/tasks/${id}`);

      runInAction(() => {
        const numericId = Number(id);

        this.tasks.filter((t) => t.id !== numericId);

        this.isLoading = false;
        this.error = null;
      });
      return { success: true };
    } catch (error) {
      let errorMessage = "Ошибка удаления задачи";

      console.log(error);

      if (error.response) {
        const errorData = error.response.data;
        console.log("Error from server:", errorData);
        if (error?.message) {
          errorMessage = errorData.message;
        }
      }

      runInAction(() => {
        ((this.isLoading = false), (this.error = errorMessage));
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

  reset() {
    runInAction(() => {
      this.topics = [];
      this.currentTopic = null;
      this.isLoading = false;
      this.error = null;
    });
  }
}

export default new TaskStore();