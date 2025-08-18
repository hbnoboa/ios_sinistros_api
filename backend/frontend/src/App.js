import React from "react";
import { Routes, Route } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import Navbar from "./components/Navbar";
import Home from "./views/Home";
import ConfirmEmail from "./views/auth/ConfirmEmail";
import Login from "./views/auth/Login";
import Register from "./views/auth/Register";
import PrivateRoute from "./components/PrivateRoute";
import BranchNew from "./views/insured/branch/new";
import BranchEdit from "./views/insured/branch/edit";
import InsuredIndex from "./views/insured/index";
import InsuredNew from "./views/insured/new";
import InsuredEdit from "./views/insured/edit";
import InsuredShow from "./views/insured/show";
import ContactNew from "./views/insured/contact/new";
import ContactEdit from "./views/insured/contact/edit";
import PolicyNew from "./views/insured/policy/new";
import PolicyEdit from "./views/insured/policy/edit";
import ShippingCompanyIndex from "./views/shippingCompany/index";
import ShippingCompanyNew from "./views/shippingCompany/new";
import ShippingCompanyEdit from "./views/shippingCompany/edit";
import ShippingCompanyShow from "./views/shippingCompany/show";
import DriverIndex from "./views/shippingCompany/driver/index";
import DriverNew from "./views/shippingCompany/driver/new";
import DriverEdit from "./views/shippingCompany/driver/edit";
import DriverShow from "./views/shippingCompany/driver/show";
import AttendanceIndex from "./views/attendances/index";
import AttendanceNew from "./views/attendances/new";
import AttendanceEdit from "./views/attendances/edit";
import AttendanceShow from "./views/attendances/show";
import SettingListIndex from "./views/settingList/index";
import AdminUserPanel from "./views/admin/userPanel";
import AuditLogPanel from "./views/admin/logPanel";

const App = () => {
  const { token } = useAuth();

  return (
    <main>
      {token && <Navbar />}
      <Routes>
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
        <Route path="/confirm/:token" element={<ConfirmEmail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/insureds/:insuredId/branches/new"
          element={<BranchNew />}
        />
        <Route
          path="/insureds/:insuredId/branches/:id/edit"
          element={<BranchEdit />}
        />
        <Route path="/insureds" element={<InsuredIndex />} />
        <Route path="/insureds/new" element={<InsuredNew />} />
        <Route path="/insureds/:id/edit" element={<InsuredEdit />} />
        <Route path="/insureds/:id" element={<InsuredShow />} />
        <Route
          path="/insureds/:insuredId/contacts/new"
          element={<ContactNew />}
        />
        <Route
          path="/insureds/:insuredId/contacts/:id/edit"
          element={<ContactEdit />}
        />
        <Route
          path="/insureds/:insuredId/policies/new"
          element={<PolicyNew />}
        />
        <Route
          path="/insureds/:insuredId/policies/:id/edit"
          element={<PolicyEdit />}
        />
        <Route path="/shipping_companies" element={<ShippingCompanyIndex />} />
        <Route
          path="/shipping_companies/new"
          element={<ShippingCompanyNew />}
        />
        <Route
          path="/shipping_companies/:id/edit"
          element={<ShippingCompanyEdit />}
        />
        <Route
          path="/shipping_companies/:id"
          element={<ShippingCompanyShow />}
        />

        <Route
          path="/shipping_companies/:shippingCompanyId/drivers"
          element={<DriverIndex />}
        />
        <Route
          path="/shipping_companies/:shippingCompanyId/drivers/new"
          element={<DriverNew />}
        />
        <Route
          path="/shipping_companies/:shippingCompanyId/drivers/:id/edit"
          element={<DriverEdit />}
        />
        <Route
          path="/shipping_companies/:shippingCompanyId/drivers/:id"
          element={<DriverShow />}
        />
        <Route path="/attendances" element={<AttendanceIndex />} />
        <Route path="/attendances/new" element={<AttendanceNew />} />
        <Route path="/attendances/:id/edit" element={<AttendanceEdit />} />
        <Route path="/attendances/:id" element={<AttendanceShow />} />
        <Route path="/settingList" element={<SettingListIndex />} />
        <Route path="/userPanel" element={<AdminUserPanel />} />
        <Route path="/auditLog" element={<AuditLogPanel />} />
        <Route
          path="*"
          element={
            <div style={{ textAlign: "center", marginTop: "50px" }}>
              <h2>404 - Página não encontrada</h2>
            </div>
          }
        />
      </Routes>
    </main>
  );
};

export default App;
