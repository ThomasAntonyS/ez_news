import React, { useState, useRef } from 'react';
import { X, UploadCloud } from 'lucide-react';
import { useAuth } from "../context/AuthContext";
import { Ring2 } from 'ldrs/react';
import 'ldrs/react/Ring2.css';
import axios from 'axios';

const ProfileImageModal = ({ isOpen, onClose, currentImage = null, onUploadSuccess }) => {
  if (!isOpen) return null;

  const [preview, setPreview] = useState(currentImage);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setError] = useState('');
  const fileInputRef = useRef(null);
  const { userData, setProfilePic } = useAuth();

  const apiBase = import.meta.env.VITE_API_BASE;

  const processFile = async (file) => {
    setError('');

    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Invalid format. Please select a PNG or JPG file.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('File is too large. Maximum size threshold is 5MB.');
      return;
    }

    const localPreviewUrl = URL.createObjectURL(file);

    setPreview(localPreviewUrl);
    setIsUploading(true);

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await axios.post(
        `${apiBase}/api/upload-avatar`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          withCredentials: true,
        }
      );

      const imageUrl =
        response.data.imageUrl ||
        response.data.secureUrl ||
        response.data.url;

      if (!imageUrl) {
        throw new Error('No image URL returned from server');
      }

      setPreview(imageUrl);
      setProfilePic(imageUrl)

      if (onUploadSuccess) {
        onUploadSuccess(imageUrl);
      }

      onClose();

      URL.revokeObjectURL(localPreviewUrl);
    } catch (error) {
      console.error('AVATAR_UPLOAD_FAILURE', error);

      setPreview(currentImage);

      setError(
        error.response?.data?.message ||
        error.message ||
        'Network processing break. Upload to server crashed.'
      );

      URL.revokeObjectURL(localPreviewUrl);
    } finally {
      setIsUploading(false);
    }
  };

  const handleClearImage = async (e) => {
    e.stopPropagation();
    setIsUploading(true);
    setError('');
    
    try {
      await axios.post(`${apiBase}/api/remove-avatar`, {}, { withCredentials: true });
      
      setPreview(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      if (onUploadSuccess) onUploadSuccess(null); 
      setProfilePic(null)
    } catch (error) {
      console.error("AVATAR_DELETION_FAILURE", error);
      setError(error.response?.data?.message || 'Failed to remove asset signature from account profile record.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/20 backdrop-blur-md animate-in fade-in duration-200 p-4"
    >
      <div 
        onClick={(e) => e.stopPropagation()} 
        className="bg-white border border-neutral-200 h-[65vh] w-full sm:h-[50vh] sm:w-[50vw] max-w-2xl flex flex-col relative shadow-2xl rounded-xs animate-in zoom-in-98 duration-200 overflow-hidden"
      >
        <div className="absolute top-4 right-4 z-20">
          <button 
            onClick={onClose}
            disabled={isUploading}
            className="p-1.5 text-neutral-400 hover:text-neutral-900 bg-white/80 backdrop-blur-xs rounded-full border border-neutral-100 hover:border-neutral-200 transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <X size={14} strokeWidth={2.5} />
          </button>
        </div>

        <div className="flex-1 flex flex-col sm:flex-row h-full items-stretch">
          
          <div className="p-6 sm:p-8 flex flex-col justify-between border-b sm:border-b-0 sm:border-r border-neutral-100 sm:w-2/5 shrink-0 bg-neutral-50/40">
            <div>
              <h3 className="lora text-xl font-medium text-neutral-900 tracking-tight mb-2">
                Profile Picture
              </h3>
              <p className="manrope text-xs font-medium text-neutral-400 tracking-wide leading-relaxed">
                Replace or remove your profile picture.
              </p>
            </div>
            
            {errorMessage && (
              <div className="mt-4 px-3 py-2 bg-red-50 border border-red-100 rounded-xs animate-in fade-in duration-200">
                <p className="manrope text-xs font-semibold tracking-wide text-red-700 text-left leading-normal">
                  {errorMessage}
                </p>
              </div>
            )}
          </div>

          <div className="flex-1 p-6 sm:p-8 flex flex-col justify-center bg-white min-h-0">
            <div
              onClick={() => !isUploading && fileInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); if (!isUploading) setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => { 
                e.preventDefault(); 
                setIsDragging(false); 
                if (!isUploading) processFile(e.dataTransfer.files[0]); 
              }}
              className={`relative h-full w-full border border-dashed rounded-xs flex flex-col items-center justify-center p-4 text-center transition-all duration-300 ${
                isDragging ? 'border-neutral-900 bg-neutral-50/80 scale-[0.99]' : 'border-neutral-200 bg-neutral-50/20 hover:border-neutral-400'
              } ${preview || isUploading ? 'cursor-default' : 'cursor-pointer'}`}
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={(e) => processFile(e.target.files[0])} 
                accept="image/*" 
                disabled={isUploading}
                className="hidden" 
              />

              {isUploading ? (
                <div className="flex flex-col items-center gap-2 animate-in fade-in duration-200">
                  <Ring2 size="20" stroke="2.5" speed="0.8" color="#000" />
                  <span className="manrope text-xs font-semibold tracking-wide text-neutral-400">Processing asset...</span>
                </div>
              ) : preview ? (
                <div className="relative w-full h-full group/preview overflow-hidden rounded-sm animate-in fade-in duration-300">
                  <img 
                    src={preview} 
                    alt="Avatar Profile preview" 
                    className="w-full h-full object-cover" 
                  />
                  
                  <div className="absolute inset-0 bg-neutral-950/50 md:opacity-0 md:group-hover/preview:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center gap-2.5 p-2">
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                      className="manrope w-full max-w-30 text-center px-3 py-2 md:py-1.5 bg-white text-neutral-900 text-xs font-semibold tracking-wide rounded-sm hover:bg-neutral-100 transition-colors cursor-pointer shadow-sm active:scale-95"
                    >
                      Replace photo
                    </button>
                              
                    <button
                      type="button"
                      onClick={handleClearImage}
                      className="manrope w-full max-w-30 text-center text-white text-xs font-semibold tracking-wide hover:text-red-300 transition-colors cursor-pointer py-1 active:text-red-400"
                    >
                      Remove photo
                    </button>
                              
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center animate-in fade-in duration-300">
                  <div className="p-2.5 bg-white border border-neutral-100 rounded-full text-neutral-400 mb-3 shadow-2xs">
                    <UploadCloud size={16} />
                  </div>
                  <p className="manrope text-xs font-semibold text-neutral-700 tracking-tight">
                    Drop file here or <span className="text-neutral-900 underline underline-offset-2">browse</span>
                  </p>
                  <p className="manrope text-xs text-neutral-400 font-medium tracking-wide mt-1.5">
                    PNG, JPG up to 5MB maximum
                  </p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProfileImageModal;
