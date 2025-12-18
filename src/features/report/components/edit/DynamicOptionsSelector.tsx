import { Locate, MapPin } from "lucide-react";
import { CustomSelect } from "@shared/ui/molecules/CustomSelect";

const DynamicsSelection = ({ formData, handleChange, sitios }: { formData: any; handleChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; sitios: any[] }) => {
    
    const siteOptions = [
        { value: "", label: "Seleccione un sitio", icon: <MapPin className="w-4 h-4" /> },
        ...sitios.map(sitio => ({
            value: sitio.id,
            label: sitio.zona?.locality || `Sitio ${sitio.id}`,
            subtitle: `Lat: ${sitio.latitude}, Lon: ${sitio.longitude}${sitio.event ? ` (${sitio.event.type})` : ''}`,
            icon: <MapPin className="w-4 h-4" />
        }))
    ];

    const handleSelectChange = (value: string | number) => {
        
        const syntheticEvent = {
            target: {
                name: "site_id",
                value: value
            }
        } as React.ChangeEvent<HTMLSelectElement>;
        handleChange(syntheticEvent);
    };

    return (
        <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                <Locate size={18} className="text-blue-600" />
                Sitio
            </label>
            
            <CustomSelect
                options={siteOptions}
                value={formData.site_id}
                onChange={handleSelectChange}
                placeholder="Seleccione un sitio"
                icon={<Locate className="w-5 h-5" />}
            />

            <span className="text-xs text-slate-500 mt-2 block">
                Al cambiar el sitio, la zona se actualizará automáticamente
            </span>
        </div>
    );
}

export default DynamicsSelection;