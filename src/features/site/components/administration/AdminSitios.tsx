import { useState } from "react";
import { useSites } from "../../hooks/useSites";
import { useSiteFilters } from "../../hooks/useSiteFilters";
import  useSiteForm  from "../../hooks/useSiteForm";
import { useSiteDelete } from "../../hooks/useSiteDelete";
import Toast from "@shared/ui/Loading/Toast";
import { DashboardLayout } from '@shared/ui/layouts/DashboardLayout';
import { SiteHeader } from "./SiteHeader";
import { SiteSearchBar } from "./SiteSearchBar";
import { SiteTable } from "./SiteTable";
import { SiteFormModal } from "./SiteFormModal";
import { SiteDeleteModal } from "./SiteDeleteModal";
import { SiteEmptyState } from "./SiteEmptyState";
import { SiteInfoBanner } from "./SiteInfoBanner";
import { useNavegation as useNavigation } from "@shared/hooks";

const AdminSitios = () => {
  const [toastOpen, setToastOpen] = useState(false);
  const [toastType, setToastType] = useState<"success" | "error">("success");
  const [toastMessage, setToastMessage] = useState("");
  const { go } = useNavigation();

  const showToast = (type: "success" | "error", message: string) => {
    setToastType(type);
    setToastMessage(message);
    setToastOpen(true);
  };

  // Hook para obtener sitios
  const { sites, error, refetch } = useSites();

  // Hook para filtros
  const { search, setSearch, filteredSites } = useSiteFilters(sites);

  // Hook para formulario
  const siteForm = useSiteForm({
    onSuccess: (message) => {
      showToast("success", message);
      refetch();
    },
    onError: (message) => {
      showToast("error", message);
    },
  });

  // Hook para eliminar
  const siteDelete = useSiteDelete({
    onSuccess: (message) => {
      showToast("success", message);
      refetch();
    },
    onError: (message) => {
      showToast("error", message);
    },
  });

  // Mostrar error si falla la carga
  if (error) {
    showToast("error", error);
  }

  return (
    <DashboardLayout contentClassName="">
      <div className="w-full max-w-7xl mx-auto">

        <SiteHeader count={filteredSites.length} />

        <SiteSearchBar
          search={search}
          onSearchChange={setSearch}
          onAddClick={go.sites.add}
          resultCount={filteredSites.length}
        />

        {filteredSites.length === 0 ? (
          <SiteEmptyState onAddClick={() => siteForm.openForm()} />
        ) : (
          <SiteTable
            sites={filteredSites}
            onEdit={siteForm.openForm}
            onDelete={siteDelete.openDeleteModal}
            deleting={siteDelete.loading}
            deletingId={siteDelete.selectedSite?.id}
          />
        )}

        <SiteInfoBanner />
      </div>

      {/* Modales */}
      <SiteFormModal
        isOpen={siteForm.isOpen}
        editMode={siteForm.editMode}
        formData={siteForm.formData}
        loading={siteForm.loading}
        onClose={siteForm.closeForm}
        onChange={siteForm.handleChange}
        onSubmit={siteForm.handleSubmit}
      />

      <SiteDeleteModal
        isOpen={siteDelete.isOpen}
        site={siteDelete.selectedSite}
        loading={siteDelete.loading}
        onClose={siteDelete.closeDeleteModal}
        onConfirm={siteDelete.handleDelete}
      />

      <Toast
        isOpen={toastOpen}
        type={toastType}
        message={toastMessage}
        onClose={() => setToastOpen(false)}
      />
    </DashboardLayout>
  );
};

export default AdminSitios;