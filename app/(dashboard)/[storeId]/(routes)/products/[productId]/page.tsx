import prismadb from '@/lib/prismadb';
import ProductForm from './components/product-form';

const ProductPage = async ({
  params
}: {
  params: { productId: string,storeId:string }
}) => {
  const productId = decodeURIComponent(params.productId);
  const categories = await prismadb.category.findMany({
    where:{
      storeId:params.storeId
    }
  })
  const sizes = await prismadb.size.findMany({
    where:{
      storeId:params.storeId
    }
  })
  const colors = await prismadb.color.findMany({
    where:{
      storeId:params.storeId
    }
  })
  // Check if billboardId is "new" and handle accordingly
  if (productId === "new") {
    // Render form with initial data as null for a new entry
    return (
      <div className="flex-col">
        <div className="flex-1 space-y-4 p-8">
          <ProductForm 
          categories={categories}
          colors={colors}
          sizes={sizes}

          initialData={null} />
        </div>
      </div>
    );
  }

  // Proceed with the query if the ID is not "new"
  let product = null;
  try {
    product = await prismadb.product.findUnique({
      where: {
        id: productId
      },
      include:{
        images:true
      }
    });
  } catch (error) {
    // Handle potential errors from Prisma
    console.error("Error fetching billboard:", error);
  }

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8">
        <ProductForm 
        categories={categories}
        colors={colors}
        sizes={sizes}
        initialData={product} />
      </div>
    </div>
  );
};

export default ProductPage;
