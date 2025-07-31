import Label from "@/components/atoms/Label";
import Input from "@/components/atoms/Input";
import Textarea from "@/components/atoms/Textarea";
import Select from "@/components/atoms/Select";
import { cn } from "@/utils/cn";

const FormField = ({ 
  label, 
  type = "input", 
  error, 
  required = false,
  className,
  children,
  ...props 
}) => {
  const renderInput = () => {
    switch (type) {
      case "textarea":
        return <Textarea {...props} className={error ? "border-error" : ""} />;
      case "select":
        return (
          <Select {...props} className={error ? "border-error" : ""}>
            {children}
          </Select>
        );
      default:
        return <Input type={type} {...props} className={error ? "border-error" : ""} />;
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <Label>
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </Label>
      )}
      {renderInput()}
      {error && (
        <p className="text-sm text-error">{error}</p>
      )}
    </div>
  );
};

export default FormField;