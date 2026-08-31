import { NextResponse } from "next/server";
import corsHeaders from "./cors";
export function printExceptionLog(logMessage, error) {
  console.log(`==>${logMessage} Exception\n`, error);
}
export function errorResponse(message, status) {
  return NextResponse.json({ message }, { status, headers: corsHeaders });
}
export function successResponse(jsonData, status) {
  return NextResponse.json(jsonData, { status, headers: corsHeaders });
}
