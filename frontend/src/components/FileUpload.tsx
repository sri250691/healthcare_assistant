import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, X } from 'lucide-react';
import { motion } from 'framer-motion';

interface FileUploadProps {
  onFileUpload: (file: File) => void;
  isLoading?: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload, isLoading }) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileUpload(acceptedFiles[0]);
    }
  }, [onFileUpload]);

  const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/msword': ['.doc'],
      'text/plain': ['.txt'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
    },
    maxFiles: 1,
    disabled: isLoading,
  });

  return (
    <div className="w-full">
      <motion.div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
          ${isDragActive 
            ? 'border-healthcare-primary bg-blue-50' 
            : 'border-gray-300 hover:border-healthcare-primary'
          }
          ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        whileHover={!isLoading ? { scale: 1.02 } : {}}
        whileTap={!isLoading ? { scale: 0.98 } : {}}
      >
        <input {...getInputProps()} />
        
        <div className="flex flex-col items-center space-y-2">
          <motion.div
            animate={isLoading ? { rotate: 360 } : { rotate: 0 }}
            transition={{ duration: 2, repeat: isLoading ? Infinity : 0, ease: "linear" }}
          >
            <Upload className="w-8 h-8 text-gray-400" />
          </motion.div>
          
          <div>
            <p className="text-sm font-medium text-gray-700">
              {isDragActive ? 'Drop file here...' : 'Upload document'}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Supports PDF, Word, Excel, and text files
            </p>
          </div>
        </div>
      </motion.div>

      {acceptedFiles.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 p-3 bg-gray-50 rounded-lg"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <File className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-700">
                {acceptedFiles[0].name}
              </span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                acceptedFiles.length = 0;
              }}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};
