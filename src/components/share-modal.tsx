import React, { useRef, useState, useEffect } from 'react';
import { MapPin, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import html2canvas from 'html2canvas';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  prompt: string;
  result: string;
}

export default function ShareModal({ isOpen, onClose, prompt, result }: ShareModalProps) {
  const t = useTranslations();
  const contentRef = useRef<HTMLDivElement>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (isOpen && contentRef.current) {
      generateImage();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const generateImage = async () => {
    if (!contentRef.current) return;
    
    setIsGenerating(true);
    try {
      const canvas = await html2canvas(contentRef.current, {
        backgroundColor: '#fff',
        scale: 2, // Higher quality
      });
      
      const image = canvas.toDataURL('image/png');
      setGeneratedImage(image);
    } catch (error) {
      console.error('Error generating image:', error);
    }
    setIsGenerating(false);
  };

  const downloadImage = () => {
    if (generatedImage) {
      const link = document.createElement('a');
      link.href = generatedImage;
      link.download = 'made-in-canada-result.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
        >
          <X className="h-6 w-6" />
        </button>
        
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          {t('shareResult')}
        </h2>

        {/* Hidden content for capturing - with fixed width and better spacing */}
        <div 
          ref={contentRef} 
          className="bg-red-50 p-6 rounded-lg mb-6" 
          style={{ 
            position: 'absolute', 
            left: '-9999px',
            width: '800px', // Fixed width for consistent layout
            maxWidth: '800px'
          }}
        >
          <div className="flex items-center mb-4">
            <MapPin className="h-8 w-8 text-red-600 mr-2" />
            <h3 className="text-xl font-semibold text-gray-900">MadeInCanadaFinder.ca</h3>
          </div>
          
          <div className="">
            <div>
              <p className="text-sm text-gray-500">{t('yourSearch')}</p>
              <p className="text-gray-900 font-medium text-lg mb-4">{prompt}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500 mb-2">{t('canadianAlternative')}</p>
              <div 
                className="text-gray-900 space-y-6 prose max-w-none" 
                style={{
                    lineHeight: '1.5'
                }}
                dangerouslySetInnerHTML={{ __html: result }} 
              />
            </div>
          </div>
        </div>

        {/* Image Display */}
        {isGenerating ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
          </div>
        ) : generatedImage ? (
          <div className="mb-6">
            <img 
              src={generatedImage} 
              alt="Share image"
              className="w-full rounded-lg border border-gray-200"
            />
          </div>
        ) : null}

        <div className="flex gap-3">
          <button
            onClick={downloadImage}
            disabled={isGenerating || !generatedImage}
            className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition disabled:bg-red-300"
          >
            {t('downloadImage')}
          </button>
        </div>
      </div>
    </div>
  );
}
