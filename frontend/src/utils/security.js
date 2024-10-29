export const generateSecureHash = (familyId) => {
  // Simple hash for demo - replace with more secure implementation
  return btoa(`family-${familyId}-${Date.now()}`);
}; 