import prismadb from '@/lib/prismadb';
import BillboardForm from './components/billboard-form';

const BillboardPage = async ({
  params
}: {
  params: { billboardId: string }
}) => {
  const billboardId = decodeURIComponent(params.billboardId);

  // Check if billboardId is "new" and handle accordingly
  if (billboardId === "new") {
    // Render form with initial data as null for a new entry
    return (
      <div className="flex-col">
        <div className="flex-1 space-y-4 p-8">
          <BillboardForm initialData={null} />
        </div>
      </div>
    );
  }

  // Proceed with the query if the ID is not "new"
  let billboard = null;
  try {
    billboard = await prismadb.billboard.findUnique({
      where: {
        id: billboardId
      }
    });
  } catch (error) {
    // Handle potential errors from Prisma
    console.error("Error fetching billboard:", error);
  }

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8">
        <BillboardForm initialData={billboard} />
      </div>
    </div>
  );
};

export default BillboardPage;
