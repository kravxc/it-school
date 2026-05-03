import { observer } from "mobx-react-lite";
import { Link } from "react-router-dom";
import { authStore } from "../../stores";

const RequireGrade = observer(({ children }) => {
  if (!authStore.gradeId) {
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
            className="fas fa-exclamation-triangle"
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
            Класс не указан
          </h3>
          <p style={{ color: "#64748b", marginBottom: "28px" }}>
            Обратитесь к администратору для привязки к классу
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

export default RequireGrade;
