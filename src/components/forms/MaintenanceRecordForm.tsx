import { useForm, useFieldArray, SubmitHandler } from "react-hook-form";
import { v4 as uuidv4 } from 'uuid'; 
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";

// The function to generate the schema with equipment IDs
// Regenerate the schema upon retrieval
const createMaintenanceRecordSchema = (equipmentIds: string[]) => {
  if (equipmentIds.length === 0) {
    throw new Error("Equipment IDs cannot be empty");
  }

  return z.object({
    id: z.string().optional(),
    equipmentId: z.enum(equipmentIds as [string, ...string[]]),
    date: z.date().refine((date) => date <= new Date(), {
      message: 'Date must be in the past',
      path: ['date'],
    }),
    type: z.enum(["Preventive", "Repair", "Emergency"]),
    technician: z.string().min(2, "Technician is required").max(255),
    hoursSpent: z.number().min(0, "Hours spent must be positive").max(24, "Hours must be 24 or less"),
    description: z.string().min(10, "Description is required").max(500),
    partsReplaced: z.array(z.string().min(1)).optional(),
    priority: z.enum(["Low", "Medium", "High"]),
    completionStatus: z.enum(["Complete", "Incomplete", "Pending Parts"]),
  });
};

// Type for Maintenance Record Form Data
type MaintenanceRecordFormData = z.infer<ReturnType<typeof createMaintenanceRecordSchema>>;

const MaintenanceRecordForm = ({ onClose }: { onClose: () => void }) => {
  const [equipmentIds, setEquipmentIds] = useState<string[]>([]);
  const [isSuccessMessage, setIsSuccessMessage] = useState(false);

  useEffect(() => {
    // Fetch equipment data
    const fetchEquipmentData = async () => {
      try {
        const response = await fetch('/api/equipment');
        const equipmentData = await response.json();
        const ids = equipmentData.map((item: { id: string }) => item.id);
        setEquipmentIds(ids);
      } catch (error) {
        console.error("Error fetching equipment data", error);
      }
    };

    fetchEquipmentData();
  }, []);

  // Create the schema with equipmentIds once data is available
  const schema = equipmentIds.length ? createMaintenanceRecordSchema(equipmentIds) : null;

  // Avoid calling useForm if schema is not available
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<MaintenanceRecordFormData>({
    resolver: schema ? zodResolver(schema) : undefined, // Only use resolver when schema is available
  });

  const { fields, append, remove } = useFieldArray({
    control,
    // @ts-ignore
    name: "partsReplaced",
  });

  const onSubmit: SubmitHandler<MaintenanceRecordFormData> = async (data) => {
    const id = uuidv4().slice(0, 10)
    const idData = { ...data, id: id };
    const response = await fetch('/api/maintenance', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(idData)
    });
    if (response.ok) {
      setIsSuccessMessage(true);
      setTimeout(() => { 
        setIsSuccessMessage(false);
        onClose();
    }, 3000); 
    } 
  };

  // Show loading screen until schema is ready
  if (!schema) {
    return <div>Loading...</div>;
  }

  return (
    <>
    {isSuccessMessage && (
      <div className="fixed top-10 right-10 bg-green-500 text-white p-4 rounded shadow-lg">
        <p className="success-message">Maintenance record successfully created!</p>
      </div>
    )}
    {!isSuccessMessage && (
    <div className="z-0 fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 dark:bg-opacity-80 dark:bg-neutral-900 justify-center" onClick={onClose}>
      <form
        className="z-50 bg-slate-100 fixed inset-x-1/3 top-16 w-1/3 h-5/6 text-black p-10 flex flex-col overflow-auto align-center justify-center"
        onSubmit={handleSubmit(onSubmit)}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
          aria-label="Close"
          type="button"
        >
          ✖
        </button>
        <label className="p-2">
          Equipment:
          <select {...register("equipmentId")} className="border p-1 w-full">
            {equipmentIds.map((id) => (
              <option key={id} value={id}>{id}</option>
            ))}
          </select>
          {errors.equipmentId && <p className="text-red-500">{errors.equipmentId.message}</p>}
        </label>
        <label className="p-2">
          Date:
          <input
            type="date"
            {...register("date", {
              setValueAs: (value) => (value ? new Date(value) : undefined),
            })}
            className="border p-1 w-full"
          />
          {errors.date && <p className="text-red-500">Date must be in the past</p>}
        </label>
        <label className="p-2">
          Type:
          <select {...register("type")} className="border p-1 w-full">
            <option value="Preventive">Preventive</option>
            <option value="Repair">Repair</option>
            <option value="Emergency">Emergency</option>
          </select>
          {errors.type && <p className="text-red-500">{errors.type.message}</p>}
        </label>
        <label className="p-2">
          Technician:
          <input {...register("technician")} className="border p-1 w-full" />
          {errors.technician && <p className="text-red-500">{errors.technician.message}</p>}
        </label>
        <label className="p-2">
          Hours Spent:
          <input
            type="number"
            {...register("hoursSpent", { valueAsNumber: true })}
            className="border p-1 w-full"
          />
          {errors.hoursSpent && <p className="text-red-500 hoursSpent-error">{errors.hoursSpent.message}</p>}
        </label>
        <label className="p-2">
          Description:
          <input {...register("description")} className="border p-1 w-full" />
          {errors.description && <p className="text-red-500">{errors.description.message}</p>}
        </label>
        <div>
          <label className="p-2">
            Parts Replaced (optional):
            <button
              type="button"
              className="bg-green-500 text-white px-2 py-1 ml-2"
              onClick={() => append("")}
            >
              Add Part
            </button>
          </label>
          {fields.map((field, index) => (
            <div key={field.id} className="flex items-center space-x-2 p-2">
              <input
                {...register(`partsReplaced.${index}` as const)}
                className="border p-2 w-full"
              />
              <button
                type="button"
                className="bg-red-500 text-white px-2 py-1"
                onClick={() => remove(index)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
        <label className="p-2">
          Priority:
          <select {...register("priority")} className="border p-1 w-full">
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
          {errors.priority && <p className="text-red-500">{errors.priority.message}</p>}
        </label>
        <label className="p-2">
          Completion Status:
          <select {...register("completionStatus")} className="border p-1 w-full">
            <option value="Complete">Complete</option>
            <option value="Incomplete">Incomplete</option>
            <option value="Pending Parts">Pending Parts</option>
          </select>
          {errors.completionStatus && <p className="text-red-500">{errors.completionStatus.message}</p>}
        </label>
        <button type="submit" className="bg-blue-500 text-white p-2 mt-4 w-1/2 m-auto">
          Create
        </button>
      </form>
    </div>
    )}
    </>
  );
};

export default MaintenanceRecordForm;
