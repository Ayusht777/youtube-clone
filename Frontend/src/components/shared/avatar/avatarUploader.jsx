import { UserRoundPlus, Pencil } from "lucide-react";
import { useState } from "react";
import { cn } from "../../../utils/cn";

const AvatarUploader = ({ setAvatar ,className}) => {
  const [imagePreview, setImagePreview] = useState(null);

  // Handle image upload
  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file ) {
      setAvatar(file);
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);
    }
  };

  return (
    <div
      className={cn(
        "relative mx-auto size-24 rounded-full border border-input-border bg-input-background "
        ,className
      )}
    >
      <div className="flex items-center justify-center size-full">
        {imagePreview ? (
          <img
            src={imagePreview}
            alt="Avatar Preview"
            className="size-full rounded-full object-cover"
          />
        ) : (
          <UserRoundPlus className="size-14 text-input-text" />
        )}
      </div>

      <label className="absolute bottom-0 right-0 cursor-pointer">
        <span
          className={cn(
            "flex items-center justify-center size-6 rounded-full shadow-lg",
            "bg-button hover:bg-input-placeholder transition-colors duration-300"
          )}
        >
          <Pencil className="size-4 text-button-text" />
        </span>
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleAvatarUpload}
        />
      </label>
    </div>
  );
};

export default AvatarUploader;
