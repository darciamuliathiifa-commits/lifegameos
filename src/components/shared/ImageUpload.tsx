import { useState, useRef } from 'react';
import { Camera, Upload, X, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ImageUploadProps {
  currentImage?: string;
  onImageChange: (imageUrl: string) => void;
  className?: string;
  variant?: 'avatar' | 'card' | 'banner';
}

export const ImageUpload = ({ 
  currentImage, 
  onImageChange, 
  className,
  variant = 'card' 
}: ImageUploadProps) => {
  const [isHovering, setIsHovering] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageChange(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onImageChange('');
  };

  const sizeClasses = {
    avatar: 'w-24 h-24 rounded-full',
    card: 'w-full h-32 rounded-lg',
    banner: 'w-full h-48 rounded-xl',
  };

  return (
    <div
      className={cn(
        "relative overflow-hidden cursor-pointer transition-all duration-300 border-2 border-dashed",
        sizeClasses[variant],
        isDragging
          ? "border-primary bg-primary/10"
          : currentImage
          ? "border-transparent"
          : "border-border hover:border-primary/50",
        className
      )}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {currentImage ? (
        <>
          <img
            src={currentImage}
            alt="Uploaded"
            className="w-full h-full object-cover"
          />
          {isHovering && (
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center gap-2 animate-scale-in">
              <Button size="icon" variant="outline" className="rounded-full">
                <Camera className="w-4 h-4" />
              </Button>
              <Button 
                size="icon" 
                variant="destructive" 
                className="rounded-full"
                onClick={handleRemove}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-muted-foreground">
          {variant === 'avatar' ? (
            <Camera className="w-6 h-6" />
          ) : (
            <>
              <ImageIcon className="w-8 h-8" />
              <span className="text-xs font-body">Click or drag to upload</span>
            </>
          )}
        </div>
      )}
    </div>
  );
};
