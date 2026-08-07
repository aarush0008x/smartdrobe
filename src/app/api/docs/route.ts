import { NextResponse } from "next/server";

export async function GET() {
  const openApiSpec = {
    openapi: "3.0.0",
    info: {
      title: "SmartDrobe REST API Documentation",
      version: "1.0.0",
      description: "Production REST API for SmartDrobe AI-Powered Wardrobe Management Platform.",
    },
    servers: [
      {
        url: "http://localhost:3000/api",
        description: "Local Development Server",
      },
    ],
    paths: {
      "/auth/login": {
        post: {
          summary: "Authenticate user and receive JWT session cookie",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    email: { type: "string", example: "user@smartdrobe.ai" },
                    password: { type: "string", example: "password123" },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: "Login successful" },
            401: { description: "Invalid credentials" },
          },
        },
      },
      "/auth/signup": {
        post: {
          summary: "Register new user account",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    name: { type: "string", example: "Sophia Chen" },
                    email: { type: "string", example: "sophia@example.com" },
                    password: { type: "string", example: "securePass123" },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: "User registered" },
            400: { description: "Validation error" },
          },
        },
      },
      "/wardrobe": {
        get: {
          summary: "Fetch digital wardrobe items for logged-in user",
          parameters: [
            { name: "category", in: "query", schema: { type: "string" } },
            { name: "season", in: "query", schema: { type: "string" } },
            { name: "search", in: "query", schema: { type: "string" } },
          ],
          responses: {
            200: { description: "List of clothing items" },
            401: { description: "Unauthorized" },
          },
        },
        post: {
          summary: "Add a new clothing item to wardrobe",
          responses: {
            201: { description: "Item created" },
          },
        },
      },
      "/outfits/generate": {
        post: {
          summary: "Generate AI outfit recommendations based on occasion, weather, and mood",
          responses: {
            200: { description: "Generated outfit result with score and explanation" },
          },
        },
      },
      "/chat": {
        post: {
          summary: "Send message to AI Fashion Stylist Assistant",
          responses: {
            200: { description: "Assistant markdown response" },
          },
        },
      },
      "/admin/users": {
        get: {
          summary: "List platform users (Admin only)",
          responses: {
            200: { description: "List of user accounts" },
            403: { description: "Forbidden" },
          },
        },
      },
    },
  };

  return NextResponse.json(openApiSpec);
}
