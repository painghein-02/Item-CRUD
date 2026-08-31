import { getClientPromise } from "@/lib/mongodb";
import { errorResponse, printExceptionLog, successResponse } from "@/lib/utils";

export async function GET(request) {
  try {
    const client = await getClientPromise();
    const db = client.db(process.env.DB_NAME);
    const itemList = await db
      .collection("item")
      .find({ status: { $ne: "DELETED" } })
      .toArray();
    return successResponse({ itemList }, 200);
  } catch (error) {
    return errorResponse("GET Item Internal Error", 500);
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const client = await getClientPromise();
    const db = client.db(process.env.DB_NAME);
    const insertResult = await db.collection("item").insertOne({
      name: data.name,
      category: data.category,
      price: data.price,
      amount: data.amount,
      status: "ACTIVE",
    });
    return successResponse({ id: insertResult.insertedId }, 201);
  } catch (error) {
    return errorResponse("POST Item Internal Error", 500);
  }
}

export async function OPTIONS(request) {
  return successResponse({}, 200);
}
