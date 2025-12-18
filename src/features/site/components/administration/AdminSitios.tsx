import { useState, useEffect, useCallback, useMemo } from "react";
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
import { getAllZonas } from "@features/zone/services";
import { getAllEvents, type Event } from "@features/event/services";
import { devLog } from "@shared/utils/errorHandler";

const AdminSitios = () => {
  // ✅ OPTIMIZACIÓN: Consolidar estados de Toast
  const [toast, setToast] = useState<{
    open: boolean;
    type: "success" | "error";
    message: string;
  } | null>(null);
  
  const [zonas, setZonas] = useState<Array<{id: number; locality: string}>>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const { go } = useNavigation();

  // ✅ OPTIMIZACIÓN: Memoizar showToast con useCallback
  const showToast = useCallback((type: "success" | "error", message: string) => {
    setToast({ open: true, type, message });
  }, []);
  
  // ✅ OPTIMIZACIÓN: useEffect con cleanup para evitar setState después de unmount
  useEffect(() => {
    let cancelled = false;
    
    const fetchData = async () => {
      try {
        const [zonasData, eventsData] = await Promise.all([
          getAllZonas(),
          getAllEvents()
        ]);
        
        if (!cancelled) {
          setZonas(zonasData);
          setEvents(eventsData);
        }
      } catch (error) {
        if (!cancelled) {
          devLog.error('Error al cargar zonas y eventos', error);
        }
      }
    };
    
    fetchData();
    
    return () => {
      cancelled = true;
    };
  }, []);

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

  // ✅ OPTIMIZACIÓN: Mover error handling a useEffect (evitar side effect en render)
  useEffect(() => {
    if (error) {
      showToast("error", error);
    }
  }, [error, showToast]);

  // ✅ OPTIMIZACIÓN: Memoizar handler para addClick
  const handleAddClick = useCallback(() => {
    go.sites.add();
  }, [go.sites]);

  return (
    <DashboardLayout contentClassName="">
      <div className="w-full max-w-7xl mx-auto">

        <SiteHeader count={filteredSites.length} />

        <SiteSearchBar
          search={search}
          onSearchChange={setSearch}
          onAddClick={handleAddClick}
          resultCount={filteredSites.length}
        />

        {filteredSites.length === 0 ? (
          <SiteEmptyState onAddClick={() => siteForm.openForm()} />
        ) : (
          <SiteTable
            sites={filteredSites}
            onDelete={siteDelete.openDeleteModal}
            deleting={siteDelete.loading}
            deletingId={siteDelete.selectedSite?.id}
          />
        )}

        <SiteInfoBanner />
      </div>

      {/* Modal solo para crear */}
      <SiteFormModal
        isOpen={siteForm.isOpen && !siteForm.editMode}
        editMode={false}
        formData={siteForm.formData}
        loading={siteForm.loading}
        onClose={siteForm.closeForm}
        onChange={siteForm.handleChange}
        onSubmit={siteForm.handleSubmit}
        zonas={zonas}
        events={events}
        onCreateZona={go.zonas.list}
      />

      <SiteDeleteModal
        isOpen={siteDelete.isOpen}
        site={siteDelete.selectedSite}
        loading={siteDelete.loading}
        onClose={siteDelete.closeDeleteModal}
        onConfirm={siteDelete.handleDelete}
      />

      <Toast
        isOpen={toast?.open || false}
        type={toast?.type || "success"}
        message={toast?.message || ""}
        onClose={() => setToast(null)}
      />
    </DashboardLayout>
  );
};

export default AdminSitios;