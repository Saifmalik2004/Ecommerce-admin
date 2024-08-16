import prismadb from '@/lib/prismadb';
import CategoryForm from './components/category-form';

const CategoryPage = async ({
  params
}: {
  params: { categoryId: string,storeid:string }
}) => {
  const categoryId = decodeURIComponent(params.categoryId);
  const billboards = await prismadb.billboard.findMany({
    where:{
      storeId:params.storeid
    }
  })
  // Check if billboardId is "new" and handle accordingly
  if (categoryId === "new") {
    
    // Render form with initial data as null for a new entry
    return (
      <div className="flex-col">
        <div className="flex-1 space-y-4 p-8">
          <CategoryForm billboards={billboards} initialData={null} />
        </div>
      </div>
    );
  }

  // Proceed with the query if the ID is not "new"
  let category = null;
  try {
    category = await prismadb.category.findUnique({
      where: {
        id: categoryId
      }
    });
  } catch (error) {
    // Handle potential errors from Prisma
    console.error("Error fetching category:", error);
  }
 

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8">
        <CategoryForm billboards={billboards} initialData={category} />
      </div>
    </div>
  );
};

export default CategoryPage;
