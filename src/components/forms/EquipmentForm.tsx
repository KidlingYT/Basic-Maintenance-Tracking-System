import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Zod schema for equipment
const equipmentSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters").max(255),
    location: z.string().min(1, "Location is required").max(255),
    department: z.enum(['Machining', 'Assembly', 'Packaging', 'Shipping']),
    model: z.string().min(1, "Model is required").max(255),
    serialnumber: z.string().regex(/^[a-z0-9]+$/i),
    install_date: z.date(),
    status: z.enum(['Retired', 'Maintenance', 'Down', 'Operational']),
  });  

// Infer the TypeScript type from the Zod schema
type EquipmentSchemaFormData = z.infer<typeof equipmentSchema>;

const EquipmentForm = ({ onClose }: { onClose: () => void }) => {

  // React Hook Form setup with maintenance form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EquipmentSchemaFormData>({
    resolver: zodResolver(equipmentSchema),
  });

  const onSubmit: SubmitHandler<EquipmentSchemaFormData> = (data) => {
    console.log(data);
  };

    return (
    <form
        className="bg-slate-100 fixed inset-x-1/4 top-16 w-1/4 h-5/6 text-black p-5 flex flex-col overflow-auto"
        onSubmit={handleSubmit(onSubmit)}
    >
        <button
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
        aria-label="Close"
        >
        ✖
        </button>
        <label className="p-4">
        Name:
        <input {...register("name")} className="border p-2 w-full" />
        {errors.name && <p className="text-red-500">{errors.name.message}</p>}
        </label>
        <label className="p-4">
        Location:
        <input {...register("location")} className="border p-2 w-full" />
        {errors.location && <p className="text-red-500">{errors.location.message}</p>}
        </label>
        <label className="p-4">
        Department:
        <select {...register("department")} className="border p-2 w-full">
            <option value="Machining">Machining</option>
            <option value="Assembly">Assembly</option>
            <option value="Packaging">Packaging</option>
            <option value="Shipping">Shipping</option>
        </select>
        {errors.department && <p className="text-red-500">{errors.department.message}</p>}
        </label>
        <label className="p-4">
        Model:
        <input {...register("model")} className="border p-2 w-full" />
        {errors.model && <p className="text-red-500">{errors.model.message}</p>}
        </label>
        <label className="p-4">
        Serial Number:
        <input {...register("serialnumber")} className="border p-2 w-full" />
        {errors.serialnumber && <p className="text-red-500">{errors.serialnumber.message}</p>}
        </label>
        <label className="p-4">
        Install Date:
        <input
            type="date"
            {...register("install_date", { setValueAs: (v) => (v ? new Date(v) : undefined) })}
            className="border p-2 w-full"
        />
        {errors.install_date && <p className="text-red-500">{errors.install_date.message}</p>}
        </label>
        <label className="p-4">
        Status:
        <select {...register("status")} className="border p-2 w-full">
            <option value="Retired">Retired</option>
            <option value="Maintenance">Maintenance</option>
            <option value="Down">Down</option>
            <option value="Operational">Operational</option>
        </select>
        {errors.status && <p className="text-red-500">{errors.status.message}</p>}
        </label>
        <button type="submit" className="bg-blue-500 text-white p-2 mt-4">
        Create
        </button>
    </form>
    )
}
export default EquipmentForm