import { getCatalogueById } from '@/lib/api';
import ProductPageClient from './page-client';

export default async function ProductPage(props) {
  const params = await props.params;
  const { id } = params;
  // Get session token from URL query parameter
  const searchParams = await props.searchParams || {};
  const sessionToken = searchParams.session || null;
  
  let catalogue;
  let sessionError = null;
  
  try {
    catalogue = await getCatalogueById(id, sessionToken);
  } catch (error) {
    if (error.message?.includes('session token')) {
      sessionError = error.message;
    } else {
      sessionError = 'Failed to load product';
    }
  }

  return <ProductPageClient catalogue={catalogue} sessionError={sessionError} />;
}
