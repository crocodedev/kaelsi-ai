import { useState, useRef, useEffect } from 'react';
import { Input } from '../input';
import { useLocationSearch } from '@/hooks/useLocationSearch';
import { useTranslation } from '@/hooks/useTranslation';
import { Loader } from '../loader';
import { Section } from '@/components/layouts/section';

interface LocationInputProps {
  label: string;
  placeholder?: string;
  value: string;
  onChange: (place: string, latitude: number, longitude: number) => void;
  className?: string;
}

export function LocationInput({ label, placeholder, value, onChange, className }: LocationInputProps) {
  const { t } = useTranslation();
  const [inputValue, setInputValue] = useState(value);
  const [showResults, setShowResults] = useState(false);
  const { searchResults, isLoading, error, searchLocation, clearResults } = useLocationSearch();
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null!);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (resultsRef.current && !resultsRef.current.contains(event.target as Node)) {
        setShowResults(false);
        clearResults();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [clearResults]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    
    if (newValue.length >= 3) {
      searchLocation(newValue);
      setShowResults(true);
    } else {
      clearResults();
      setShowResults(false);
    }
  };

  const handleLocationSelect = (result: any) => {
    const place = result.display_name;
    const latitude = parseFloat(result.lat);
    const longitude = parseFloat(result.lon);
    
    setInputValue(place);
    onChange(place, latitude, longitude);
    setShowResults(false);
    clearResults();
  };

  const handleInputFocus = () => {
    if (inputValue.length >= 3) {
      setShowResults(true);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <Input
        ref={inputRef}
        label={label}
        placeholder={placeholder}
        value={inputValue}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        className="w-full"
      />
      
      {isLoading && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <Loader />
        </div>
      )}

      {showResults && searchResults.length > 0 && (
        <Section
          ref={resultsRef}
          className="p-0 absolute z-50 w-full mt-1 left-[-20px] rounded-lg shadow-lg max-h-40 overflow-y-auto hide-scrollbar"
        >
          {searchResults.map((result) => (
            <div
              key={result.place_id}
              className="px-4 py-3 cursor-pointer border-b"
              onClick={() => handleLocationSelect(result)}
            >
              <div className="text-sm text-white">{result.display_name}</div>
              <div className="text-xs text-gray-500">
                {result.lat}, {result.lon}
              </div>
            </div>
          ))}
        </Section>
      )}

      {error && (
        <div className="text-red-500 text-xs mt-1">{error}</div>
      )}
    </div>
  );
} 