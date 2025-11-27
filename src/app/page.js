import { getCatalogues } from '@/lib/api';
import HomeClient from './page-client';

export default async function Home() {
  const { catalogues } = await getCatalogues(1, 100); // Fetch first 100 for now

  return <HomeClient initialCatalogues={catalogues || []} />;
}
