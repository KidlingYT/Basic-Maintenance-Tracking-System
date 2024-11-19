import { useForm, useFieldArray, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Zod schema for maintenance records
const maintenanceRecordSchema = z.object({
  id: z.string().min(1, "ID is required").max(255),
  equipmentId: z.string().min(1, "Equipment ID is required").max(255),
  date: z.date(),
  type: z.enum(["Preventive", "Repair", "Emergency"]),
  technician: z.string().min(1, "Technician is required").max(255),
  hoursSpent: z.number().min(0, "Hours spent must be positive"),
  description: z.string().min(1, "Description is required").max(255),
  partsReplaced: z.array(z.string()).optional(),
  priority: z.enum(["Low", "Medium", "High"]),
  completionStatus: z.enum(["Complete", "Incomplete", "Pending Parts"]),
});

// Infer the TypeScript type from the Zod schema
type MaintenanceRecordFormData = z.infer<typeof maintenanceRecordSchema>;

const MaintenanceRecordForm = ({ onClose }: { onClose: () => void }) => {
  // React Hook Form setup with maintenance form
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<MaintenanceRecordFormData>({
    resolver: zodResolver(maintenanceRecordSchema),
  });
  // Set up useFieldArray for partsReplaced
  const { fields, append, remove } = useFieldArray({
    control,
    name: "partsReplaced",
    rules: { required: false }
  });
  const onSubmit: SubmitHandler<MaintenanceRecordFormData> = (data) => {
    console.log(data);
  };

  return (
    <form
      className="bg-slate-100 fixed inset-x-1/4 top-16 w-1/4 h-5/6 text-black p-10 flex flex-col overflow-auto"
      onSubmit={handleSubmit(onSubmit)}
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
        Id:
        <input {...register("id")} className="border p-2 w-full" />
        {errors.id && <p className="text-red-500">{errors.id.message}</p>}
      </label>
      <label className="p-2">
        Equipment Id:
        <input {...register("equipmentId")} className="border p-2 w-full" />
        {errors.equipmentId && <p className="text-red-500">{errors.equipmentId.message}</p>}
      </label>
      <label className="p-2">
        Date:
        <input
          type="date"
          {...register("date", {
            setValueAs: (value) => (value ? new Date(value) : undefined),
          })}
          className="border p-2 w-full"
        />
        {errors.date && <p className="text-red-500">Invalid date</p>}
      </label>
      <label className="p-2">
        Type:
        <select {...register("type")} className="border p-2 w-full">
          <option value="Preventive">Preventive</option>
          <option value="Repair">Repair</option>
          <option value="Emergency">Emergency</option>
        </select>
        {errors.type && <p className="text-red-500">{errors.type.message}</p>}
      </label>
      <label className="p-2">
        Technician:
        <input {...register("technician")} className="border p-2 w-full" />
        {errors.technician && <p className="text-red-500">{errors.technician.message}</p>}
      </label>
      <label className="p-2">
        Hours Spent:
        <input
          type="number"
          {...register("hoursSpent", { valueAsNumber: true })}
          className="border p-2 w-full"
        />
        {errors.hoursSpent && <p className="text-red-500">{errors.hoursSpent.message}</p>}
      </label>
      <label className="p-2">
        Description:
        <input {...register("description")} className="border p-2 w-full" />
        {errors.description && <p className="text-red-500">{errors.description.message}</p>}
      </label>
      <div>
        <label className="p-2">
        Parts Replaced (optional):
        <button
            type="button"
            className="bg-green-500 text-white px-2 py-1 ml-2"
            onClick={() => append("")} // Add a new empty field
        >
            Add Part
        </button>
        </label>
        {fields.map((field, index) => (
        <div key={field.id} className="flex items-center space-x-2 p-2">
            <input
            {...register(`partsReplaced.${index}` as const)} // Register each part field
            className="border p-2 w-full"
            />
            <button
            type="button"
            className="bg-red-500 text-white px-2 py-1"
            onClick={() => remove(index)} // Remove the field at this index
            >
            Remove
            </button>
        </div>
        ))}
        {errors.partsReplaced && (
        <p className="text-red-500">{errors.partsReplaced.message}</p>
        )}
      </div>
      <label className="p-2">
        Priority:
        <select {...register("priority")} className="border p-2 w-full">
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
        {errors.priority && <p className="text-red-500">{errors.priority.message}</p>}
      </label>
      <label className="p-2">
        Completion Status:
        <select {...register("completionStatus")} className="border p-2 w-full">
          <option value="Complete">Complete</option>
          <option value="Incomplete">Incomplete</option>
          <option value="Pending Parts">Pending Parts</option>
        </select>
        {errors.completionStatus && <p className="text-red-500">{errors.completionStatus.message}</p>}
      </label>
      <button type="submit" className="bg-blue-500 text-white p-2 mt-4">
        Create
      </button>
    </form>
  );
};

export default MaintenanceRecordForm;
