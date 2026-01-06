import { getCatalogues } from '@/lib/api';
import HomeClient from './page-client';

export default async function Home(props) {
  // Get session token from URL query parameter (for initial access)
  // In Next.js App Router, searchParams is a prop
  const searchParams = await props.searchParams || {};
  const sessionToken = searchParams.session || null;
  
  // If no session token, show error immediately
  if (!sessionToken) {
    return <HomeClient initialCatalogues={[]} sessionError="Session token is required" />;
  }
  
  try {
    const { catalogues } = await getCatalogues(1, 100, '', sessionToken);
    return <HomeClient initialCatalogues={catalogues || []} sessionToken={sessionToken} />;
  } catch (error) {
    // Handle session errors
    const errorMessage = error.message || 'Failed to load catalogues';
    if (errorMessage.includes('session token') || errorMessage.includes('Session token')) {
      return <HomeClient initialCatalogues={[]} sessionError={errorMessage} />;
    }
    return <HomeClient initialCatalogues={[]} sessionError="Failed to load catalogues" />;
  }
}
