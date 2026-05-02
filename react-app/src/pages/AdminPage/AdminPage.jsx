import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import {
  topicStore,
  lessonStore,
  authStore,
  fileStore,
  additionalMaterialStore,
  taskStore,
  userStore,
} from "../../stores";
import TopicsTab from "../../components/AdminPage/TopicsTab/TopicsTab";
import LessonsTab from "../../components/AdminPage/LessonsTab/LessonsTab";
import FilesTab from "../../components/AdminPage/FilesTab/FilesTab";
import UsersTab from "../../components/AdminPage/UsersTab/UsersTab";
import TopicModal from "../../components/AdminPage/TopicModal/TopicModal";
import LessonModal from "../../components/AdminPage/LessonModal/LessonModal";
import TaskModal from "../../components/AdminPage/TaskModal/TaskModal";
import FileModal from "../../components/AdminPage/FileModal/FileModal";
import MaterialModal from "../../components/AdminPage/MaterialModal/MaterialModal";
import GradeModal from "../../components/AdminPage/GradeModal/GradeModal";
import styles from "./admin.module.css";

const TABS = [
  {
    key: "topics",
    icon: "book",
    label: "Темы",
    count: (s) => s.topics.length,
    adminOnly: false,
  },
  {
    key: "lessons",
    icon: "play-circle",
    label: "Уроки",
    count: (s) => s.lessons.length,
    adminOnly: false,
  },
  {
    key: "files",
    icon: "file",
    label: "Файлы",
    count: (s) => (s.files || []).length,
    adminOnly: false,
  },
  {
    key: "users",
    icon: "users",
    label: "Пользователи",
    count: (s) => (s.users || []).length,
    adminOnly: true,
  },
];

const AdminPage = observer(() => {
  const [activeTab, setActiveTab] = useState("topics");
  const [initialLoadDone, setInitialLoadDone] = useState(false);
  const [deletingTopicId, setDeletingTopicId] = useState(null);
  const [deletingFileId, setDeletingFileId] = useState(null);

  const [topicModal, setTopicModal] = useState({ open: false, editing: null });
  const [lessonModal, setLessonModal] = useState({
    open: false,
    editing: null,
  });
  const [taskModal, setTaskModal] = useState({ open: false, lessonId: null });
  const [fileModal, setFileModal] = useState({ open: false, lessonId: null });
  const [materialModal, setMaterialModal] = useState({
    open: false,
    lessonId: null,
  });
  const [gradeModal, setGradeModal] = useState({ open: false, userId: null });

  const isAdmin = authStore.isAdmin;

  useEffect(() => {
    const load = async () => {
      try {
        await topicStore.fetchAllTopics();
        await lessonStore.fetchAllLessons();
        await fileStore.fetchAllFiles();
        if (isAdmin) await userStore.getAllUsers();
      } catch (e) {
        console.error(e);
      }
      setInitialLoadDone(true);
    };
    load();
  }, [isAdmin]);

  const refresh = async () => {
    await topicStore.fetchAllTopics();
    await lessonStore.fetchAllLessons();
    await fileStore.fetchAllFiles();
    if (isAdmin) await userStore.getAllUsers();
  };

  const handleTopicSubmit = async (form) => {
    const r = topicModal.editing
      ? await topicStore.updateTopic(topicModal.editing.id, form)
      : await topicStore.createTopic(form);
    if (r.success) {
      setTopicModal({ open: false, editing: null });
      await refresh();
    }
  };

  const handleDeleteTopic = async (id, title) => {
    if (!isAdmin) return;
    if (window.confirm(`Удалить "${title}"?`)) {
      setDeletingTopicId(id);
      await topicStore.deleteTopic(id);
      setDeletingTopicId(null);
      await refresh();
    }
  };

  const handleLessonSubmit = async (form) => {
    const r = lessonModal.editing
      ? await lessonStore.updateLesson(lessonModal.editing.id, form)
      : await lessonStore.createLesson(form);
    if (r.success) {
      setLessonModal({ open: false, editing: null });
      await refresh();
    }
  };

  const handleDeleteLesson = async (id, title) => {
    if (!isAdmin) return;
    if (window.confirm(`Удалить "${title}"?`)) {
      await lessonStore.deleteLesson(id);
      await refresh();
    }
  };

  const handleTaskSubmit = async (form) => {
    const r = await taskStore.createTask(form);
    if (r.success) {
      setTaskModal({ open: false, lessonId: null });
      await refresh();
    }
  };

  const handleFileUpload = async (lessonId, file, fileName) => {
    const r = await fileStore.uploadFile(lessonId, file, {
      title: fileName || file.name,
    });
    if (!r.success) {
      alert("Ошибка: " + r.error);
      return false;
    }
    const lr = await fileStore.linkFileToLesson(lessonId, r.data.id);
    if (!lr.success) {
      alert("Ошибка привязки: " + lr.error);
      return false;
    }
    await refresh();
    return true;
  };

  const handleDeleteFile = async (id, name) => {
    if (!isAdmin) return;
    if (window.confirm(`Удалить "${name}"?`)) {
      setDeletingFileId(id);
      await fileStore.deleteFile(id);
      setDeletingFileId(null);
      await refresh();
    }
  };

  const handleMaterialSubmit = async (lessonId, form, file) => {
    const data = {
      title: form.title || (file ? file.name : "Материал"),
      lessonId,
    };
    if (form.content?.startsWith("http")) data.link = form.content;
    else if (form.content) data.content = form.content;
    if (file) {
      const r = await fileStore.uploadFile(lessonId, file, {
        title: data.title,
      });
      if (r.success) {
        data.fileId = r.data.id;
        await fileStore.linkFileToLesson(lessonId, r.data.id);
      } else {
        alert("Ошибка: " + r.error);
        return false;
      }
    }
    const r = await additionalMaterialStore.createAddMaterial(data);
    if (!r.success) {
      alert("Ошибка: " + r.error);
      return false;
    }
    await refresh();
    return true;
  };

  const handleBindGrade = async (gId, userId) => {
    const r = await userStore.bindUserWithGrade(gId, userId);
    if (r.success) {
      setGradeModal({ open: false, userId: null });
      await refresh();
    }
  };

  const handleUnbindGrade = async (userId, name) => {
    if (window.confirm(`Снять "${name}" с класса?`)) {
      await userStore.unbindUserWithGrade(userId);
      await refresh();
    }
  };

  if (!initialLoadDone) {
    return (
      <div className={styles.adminPage}>
        <div className={styles.container}>
          <div className={styles.loading}>
            <i className="fas fa-spinner fa-spin"></i>
            <p>Загрузка...</p>
          </div>
        </div>
      </div>
    );
  }

  const stores = {
    topics: topicStore.topics,
    lessons: lessonStore.lessons,
    files: fileStore.files || [],
    users: userStore.users || [],
  };

  return (
    <div className={styles.adminPage}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.headerInfo}>
            <h1>Панель управления</h1>
            <span className={styles.roleBadge}>
              <i className="fas fa-shield-alt"></i>
              {isAdmin ? "Администратор" : "Учитель"}
            </span>
          </div>
        </div>

        <div className={styles.tabs}>
          {TABS.filter((t) => !t.adminOnly || isAdmin).map((tab) => (
            <button
              key={tab.key}
              className={`${styles.tab} ${activeTab === tab.key ? styles.active : ""}`}
              onClick={() => setActiveTab(tab.key)}
            >
              <i className={`fas fa-${tab.icon}`}></i> {tab.label} (
              {tab.count(stores)})
            </button>
          ))}
        </div>

        {activeTab === "topics" && (
          <TopicsTab
            topics={stores.topics}
            onEdit={(t) => setTopicModal({ open: true, editing: t })}
            onDelete={isAdmin ? handleDeleteTopic : null}
            deletingId={deletingTopicId}
            isAdmin={isAdmin}
          />
        )}
        {activeTab === "lessons" && (
          <LessonsTab
            lessons={stores.lessons}
            topics={stores.topics}
            onEdit={(l) => setLessonModal({ open: true, editing: l })}
            onDelete={isAdmin ? handleDeleteLesson : null}
            onTask={(id) => setTaskModal({ open: true, lessonId: id })}
            onFile={(id) => setFileModal({ open: true, lessonId: id })}
            onMaterial={(id) => setMaterialModal({ open: true, lessonId: id })}
            isAdmin={isAdmin}
          />
        )}
        {activeTab === "files" && (
          <FilesTab
            files={stores.files}
            onDelete={isAdmin ? handleDeleteFile : null}
            deletingId={deletingFileId}
            isAdmin={isAdmin}
          />
        )}
        {activeTab === "users" && (
          <UsersTab
            users={stores.users}
            onBindGrade={(id) => setGradeModal({ open: true, userId: id })}
            onUnbindGrade={handleUnbindGrade}
          />
        )}
      </div>

      {topicModal.open && (
        <TopicModal
          editing={topicModal.editing}
          onSubmit={handleTopicSubmit}
          onClose={() => setTopicModal({ open: false, editing: null })}
          isLoading={topicStore.isLoading}
        />
      )}
      {lessonModal.open && (
        <LessonModal
          editing={lessonModal.editing}
          topics={stores.topics}
          onSubmit={handleLessonSubmit}
          onClose={() => setLessonModal({ open: false, editing: null })}
          isLoading={lessonStore.isLoading}
        />
      )}
      {taskModal.open && (
        <TaskModal
          lessonId={taskModal.lessonId}
          onSubmit={handleTaskSubmit}
          onClose={() => setTaskModal({ open: false, lessonId: null })}
          isLoading={taskStore.isLoading}
        />
      )}
      {fileModal.open && (
        <FileModal
          lessonId={fileModal.lessonId}
          onSubmit={handleFileUpload}
          onClose={() => setFileModal({ open: false, lessonId: null })}
          isLoading={fileStore.isLoading}
        />
      )}
      {materialModal.open && (
        <MaterialModal
          lessonId={materialModal.lessonId}
          onSubmit={handleMaterialSubmit}
          onClose={() => setMaterialModal({ open: false, lessonId: null })}
          isLoading={additionalMaterialStore.isLoading || fileStore.isLoading}
        />
      )}
      {gradeModal.open && (
        <GradeModal
          onSubmit={(gId) => handleBindGrade(gId, gradeModal.userId)}
          onClose={() => setGradeModal({ open: false, userId: null })}
          isLoading={userStore.isLoading}
        />
      )}
    </div>
  );
});

export default AdminPage;
