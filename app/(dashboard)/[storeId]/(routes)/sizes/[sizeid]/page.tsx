import prismadb from '@/lib/prismadb';
import SizeForm from './components/size-form';

const SizePage = async ({
  params
}: {
  params: { SizeId: string }
}) => {
  const SizeId = decodeURIComponent(params.SizeId);

  // Check if sizeId is "new" and handle accordingly
  // Decode the SizeId and handle undefined or invalid cases
  if (!SizeId || SizeId === "new" || SizeId === "undefined") {
    // Render form with initial data as null for a new entry
    return (
      <div className="flex-col">
        <div className="flex-1 space-y-4 p-8">
          <SizeForm initialData={null} />
        </div>
      </div>
    );
  }

  // Proceed with the query if the ID is not "new"
  let size = null;
  try {
    size = await prismadb.size.findUnique({
      where: {
        id: SizeId
      }
    });
  } catch (error) {
    // Handle potential errors from Prisma
    console.error("Error fetching size:", error);
  }

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8">
        <SizeForm initialData={size} />
      </div>
    </div>
  );
};

export default SizePage;
