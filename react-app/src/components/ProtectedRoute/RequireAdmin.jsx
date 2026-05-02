import { observer } from "mobx-react-lite";
import { Link } from "react-router-dom";
import { authStore } from "../../stores";

const RequireAdmin = observer(({ children }) => {
  if (!authStore.isAdmin && !authStore.isTeacher) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f8fafd",
          padding: "24px",
        }}
      >
        <div
          style={{
            textAlign: "center",
            background: "white",
            borderRadius: "24px",
            padding: "60px 40px",
            border: "1px solid #fee2e2",
            maxWidth: "500px",
          }}
        >
          <i
            className="fas fa-lock"
            style={{ fontSize: "64px", color: "#ef4444", marginBottom: "24px" }}
          ></i>
          <h3
            style={{
              fontSize: "22px",
              fontWeight: 600,
              color: "#1e293b",
              marginBottom: "12px",
            }}
          >
            Доступ запрещен
          </h3>
          <p style={{ color: "#64748b", marginBottom: "28px" }}>
            У вас нет прав для доступа к этой странице
          </p>
          <Link
            to="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "12px 24px",
              background: "white",
              color: "#2563eb",
              textDecoration: "none",
              borderRadius: "40px",
              fontWeight: 500,
              border: "1px solid #e2e8f0",
            }}
          >
            <i className="fas fa-arrow-left"></i> Вернуться на главную
          </Link>
        </div>
      </div>
    );
  }

  return children;
});

export default RequireAdmin;
