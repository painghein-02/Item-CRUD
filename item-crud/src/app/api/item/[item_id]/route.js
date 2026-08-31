import { getClientPromise } from "@/lib/mongodb";
import { errorResponse, printExceptionLog, successResponse } from "@/lib/utils";
import { ObjectId } from "mongodb";

export async function GET(request, { params }) {
  const { item_id } = await params;
  try {
    const client = await getClientPromise();
    const db = client.db(process.env.DB_NAME);
    const item = await db
      .collection("item")
      .findOne({ _id: new ObjectId(item_id), status: { $ne: "DELETED" } });
    if (item) return successResponse({ item }, 200);
    return errorResponse("Item not found", 404);
  } catch (error) {
    return errorResponse("GET Error", 500);
  }
}

export async function PUT(request, { params }) {
  const { item_id } = await params;
  try {
    const data = await request.json();
    const client = await getClientPromise();
    const db = client.db(process.env.DB_NAME);
    const storedItem = await db
      .collection("item")
      .findOne({ _id: new ObjectId(item_id), status: { $ne: "DELETED" } });

    if (storedItem) {
      const updatedResult = await db
        .collection("item")
        .updateOne(
          { _id: new ObjectId(item_id) },
          {
            $set: {
              name: data.name,
              price: data.price,
              amount: data.amount,
              category: data.category,
            },
          },
        );
      if (updatedResult.modifiedCount > 0)
        return successResponse({ message: "Update success" }, 200);
      return errorResponse({ message: "Update failed" }, 400);
    }
    return errorResponse({ message: "Item not found" }, 404);
  } catch (error) {
    return errorResponse("PUT Error", 500);
  }
}

export async function DELETE(request, { params }) {
  const { item_id } = await params;
  try {
    const client = await getClientPromise();
    const db = client.db(process.env.DB_NAME);
    await db
      .collection("item")
      .updateOne(
        { _id: new ObjectId(item_id) },
        { $set: { status: "DELETED" } },
      );
    return successResponse({ message: "Delete Success" }, 200);
  } catch (error) {
    return errorResponse("DELETE Error", 500);
  }
}

export async function OPTIONS(request) {
  return successResponse({}, 200);
}
