import prismadb from '@/lib/prismadb';
import Sizeform from '../[colorId]/components/size-form';

const ColorPage = async ({
  params
}: {
  params: { colorId: string }
}) => {
  const colorId = decodeURIComponent(params.colorId);

  // Check if colorID is "new" and handle accordingly
  if (colorId === "new") {
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
  let color = null;
  try {
    color = await prismadb.color.findUnique({
      where: {
        id: params.colorId
      }
    });
  } catch (error) {
    // Handle potential errors from Prisma
    console.error("Error fetching billboard:", error);
  }

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8">
        <Sizeform initialData={color} />
      </div>
    </div>
  );
};

export default ColorPage;
