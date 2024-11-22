import { useForm, SubmitHandler } from "react-hook-form";
import { v4 as uuidv4 } from 'uuid'; 
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Zod schema for equipment
const equipmentSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(3, "Name must be at least 3 characters").max(255),
    location: z.string().min(1, "Location is required").max(255),
    department: z.enum(['Machining', 'Assembly', 'Packaging', 'Shipping']),
    model: z.string().min(1, "Model is required").max(255),
    serialNumber: z.string().regex(/^[a-z0-9]+$/i),
    installDate: z.date().refine((date) => date <= new Date(), {
      message: 'Date must be in the past',
      path: ['date'],
    }),
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

  const onSubmit: SubmitHandler<EquipmentSchemaFormData> = async (data) => {  
    const id = uuidv4().slice(0, 10)
    const idData = { ...data, id: id };
    onClose();
    const response = await fetch('/api/equipment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(idData)
    });
  };

    return (      
      <div className="z-0 fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 dark:bg-opacity-80 dark:bg-neutral-900" onClick={onClose}>
        <form
            className="z-50 bg-slate-100 fixed inset-x-1/3 top-16 w-1/3 h-5/6 text-black p-5 flex flex-col overflow-auto"
            onSubmit={handleSubmit(onSubmit)}
            onClick={(e) => e.stopPropagation()}
        >
          <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
          aria-label="Close"
          >
          ✖
          </button>
          <label className="p-2">
          Name:
          <input {...register("name")} className="border p-1 w-full" />
          {errors.name && <p className="text-red-500">{errors.name.message}</p>}
          </label>
          <label className="p-2">
          Location:
          <input {...register("location")} className="border p-1 w-full" />
          {errors.location && <p className="text-red-500">{errors.location.message}</p>}
          </label>
          <label className="p-2">
          Department:
          <select {...register("department")} className="border p-1 w-full">
              <option value="Machining">Machining</option>
              <option value="Assembly">Assembly</option>
              <option value="Packaging">Packaging</option>
              <option value="Shipping">Shipping</option>
          </select>
          {errors.department && <p className="text-red-500">{errors.department.message}</p>}
          </label>
          <label className="p-2">
          Model:
          <input {...register("model")} className="border p-1 w-full" />
          {errors.model && <p className="text-red-500">{errors.model.message}</p>}
          </label>
          <label className="p-2">
          Serial Number:
          <input {...register("serialNumber")} className="border p-1 w-full" />
          {errors.serialNumber && <p className="text-red-500">{errors.serialNumber.message}</p>}
          </label>
          <label className="p-2">
          Install Date:
          <input
              type="date"
              {...register("installDate", { setValueAs: (v) => (v ? new Date(v) : undefined) })}
              className="border p-1 w-full"
          />
          {errors.installDate && <p className="text-red-500">Date must be in the past</p>}
          </label>
          <label className="p-2">
          Status:
          <select {...register("status")} className="border p-1 w-full">
              <option value="Retired">Retired</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Down">Down</option>
              <option value="Operational">Operational</option>
          </select>
          {errors.status && <p className="text-red-500">{errors.status.message}</p>}
          </label>
          <button type="submit" className="bg-blue-500 text-white p-2 mt-4 m-auto w-1/2">
          Create
          </button>
      </form>
    </div>
    )
}
export default EquipmentForm