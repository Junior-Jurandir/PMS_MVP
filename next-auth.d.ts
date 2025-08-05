import "next/server";

declare module "next/server" {
  interface NextRequest {
    nextauth?: {
      token?: any;
    };
  }
}
