import prismadb from '@/lib/prismadb';
import Sizeform from './components/size-form';

const SizePage = async ({
  params
}: {
  params: { sizeId: string }
}) => {
 
  const sizeId = decodeURIComponent(params.sizeId);

  // Check if billboardId is "new" and handle accordingly
  if (sizeId === "new") {
    // Render form with initial data as null for a new entry
    return (
      <div className="flex-col">
        <div className="flex-1 space-y-4 p-8">
          <Sizeform initialData={null} />
        </div>
      </div>
    );
  }

  // Proceed with the query if the ID is not "new"
  let size = null;
  try {
    size = await prismadb.size.findUnique({
      where: {
        id: sizeId
      }
    });
  } catch (error) {
    // Handle potential errors from Prisma
    console.error("Error fetching size:", error);
  }

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8">
        <Sizeform initialData={size} />
      </div>
    </div>
  );
};

export default SizePage;
