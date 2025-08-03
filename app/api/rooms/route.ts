
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const rooms = await prisma.room.findMany({
      include: {
        reservations: {
          where: {
            status: {
              in: ["CONFIRMADA", "CHECKIN"]
            }
          },
          include: {
            guest: true
          }
        }
      },
      orderBy: {
        number: 'asc'
      }
    });

    return NextResponse.json(rooms);
  } catch (error) {
    console.error("Erro ao buscar quartos:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const { number, name, type, capacity, price, description, amenities } = body;

    if (!number || !name || !type || !capacity || !price) {
      return NextResponse.json(
        { error: "Campos obrigatórios: número, nome, tipo, capacidade e preço" },
        { status: 400 }
      );
    }

    const room = await prisma.room.create({
      data: {
        number,
        name,
        type,
        capacity: parseInt(capacity),
        price: parseFloat(price),
        description,
        amenities: amenities || []
      }
    });

    return NextResponse.json(room, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar quarto:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
