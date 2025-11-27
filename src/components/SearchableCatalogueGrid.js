'use client';

import { useState, useMemo } from 'react';
import CatalogueGrid from './CatalogueGrid';

// Simple fuzzy search function
function fuzzyMatch(pattern, str) {
  pattern = pattern.toLowerCase();
  str = str.toLowerCase();
  
  let patternIdx = 0;
  let strIdx = 0;
  
  while (patternIdx < pattern.length && strIdx < str.length) {
    if (pattern[patternIdx] === str[strIdx]) {
      patternIdx++;
    }
    strIdx++;
  }
  
  return patternIdx === pattern.length;
}

// Calculate similarity score (Levenshtein distance based)
function calculateSimilarity(str1, str2) {
  str1 = str1.toLowerCase();
  str2 = str2.toLowerCase();
  
  if (str1 === str2) return 1;
  if (str1.includes(str2) || str2.includes(str1)) return 0.8;
  
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;
  
  if (longer.length === 0) return 1;
  
  // Check if all characters in pattern exist in order in the string
  if (fuzzyMatch(shorter, longer)) {
    return 0.6;
  }
  
  // Simple character matching score
  let matches = 0;
  for (let i = 0; i < shorter.length; i++) {
    if (longer.includes(shorter[i])) {
      matches++;
    }
  }
  
  return matches / longer.length;
}

// Search in catalogue fields
function searchInCatalogue(catalogue, searchTerm) {
  if (!searchTerm || searchTerm.trim() === '') return { match: true, score: 1 };
  
  const term = searchTerm.trim().toLowerCase();
  const searchFields = [
    catalogue.bodyType?.name || '',
    catalogue.bodyType?.shortName || '',
    catalogue.article || '',
    catalogue.leadTime || '',
    catalogue.notes || '',
  ];
  
  // Also search in sizes and chassis
  if (catalogue.sizes) {
    catalogue.sizes.forEach(size => {
      searchFields.push(size.sizeType?.name || '');
      searchFields.push(size.sizeType?.shortName || '');
      searchFields.push(size.sizeCustom || '');
    });
  }
  
  if (catalogue.chassis) {
    catalogue.chassis.forEach(ch => {
      searchFields.push(ch.chassisType?.name || '');
      searchFields.push(ch.chassisType?.shortName || '');
      if (ch.chassisDetails) {
        ch.chassisDetails.forEach(detail => {
          searchFields.push(detail);
        });
      }
    });
  }
  
  // Check for matches
  let maxScore = 0;
  for (const field of searchFields) {
    if (field) {
      const fieldLower = field.toLowerCase();
      
      // Exact match
      if (fieldLower === term) {
        return { match: true, score: 1 };
      }
      
      // Contains match
      if (fieldLower.includes(term)) {
        maxScore = Math.max(maxScore, 0.8);
      }
      
      // Fuzzy match
      if (fuzzyMatch(term, fieldLower)) {
        maxScore = Math.max(maxScore, 0.6);
      }
      
      // Similarity score
      const similarity = calculateSimilarity(term, fieldLower);
      maxScore = Math.max(maxScore, similarity);
    }
  }
  
  // Consider it a match if score is above threshold
  return { match: maxScore >= 0.3, score: maxScore };
}

export default function SearchableCatalogueGrid({ catalogues: initialCatalogues, searchTerm: initialSearchTerm = '' }) {
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  
  const filteredCatalogues = useMemo(() => {
    if (!searchTerm || searchTerm.trim() === '') {
      return initialCatalogues || [];
    }
    
    const results = (initialCatalogues || [])
      .map(catalogue => ({
        catalogue,
        ...searchInCatalogue(catalogue, searchTerm)
      }))
      .filter(result => result.match)
      .sort((a, b) => b.score - a.score) // Sort by relevance
      .map(result => result.catalogue);
    
    return results;
  }, [initialCatalogues, searchTerm]);
  
  return (
    <div>
      <CatalogueGrid catalogues={filteredCatalogues} />
    </div>
  );
}

// Export search function for use in parent
export function useSearchableCatalogues(catalogues, searchTerm) {
  return useMemo(() => {
    if (!searchTerm || searchTerm.trim() === '') {
      return catalogues || [];
    }
    
    const results = (catalogues || [])
      .map(catalogue => ({
        catalogue,
        ...searchInCatalogue(catalogue, searchTerm)
      }))
      .filter(result => result.match)
      .sort((a, b) => b.score - a.score)
      .map(result => result.catalogue);
    
    return results;
  }, [catalogues, searchTerm]);
}





