import { Navigate } from "react-router";
import { observer } from "mobx-react-lite";
import { authStore } from "../../stores";

const ProtectedRoute = observer(({ children }) => {
  if (!authStore.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
});

export default ProtectedRoute;
