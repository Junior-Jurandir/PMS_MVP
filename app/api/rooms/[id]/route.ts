
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const room = await prisma.room.findUnique({
      where: { id: params.id },
      include: {
        reservations: {
          include: {
            guest: true
          }
        }
      }
    });

    if (!room) {
      return NextResponse.json({ error: "Quarto não encontrado" }, { status: 404 });
    }

    return NextResponse.json(room);
  } catch (error) {
    console.error("Erro ao buscar quarto:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const { number, name, type, capacity, price, description, amenities, status } = body;

    const room = await prisma.room.update({
      where: { id: params.id },
      data: {
        ...(number && { number }),
        ...(name && { name }),
        ...(type && { type }),
        ...(capacity && { capacity: parseInt(capacity) }),
        ...(price && { price: parseFloat(price) }),
        ...(description !== undefined && { description }),
        ...(amenities && { amenities }),
        ...(status && { status })
      }
    });

    return NextResponse.json(room);
  } catch (error) {
    console.error("Erro ao atualizar quarto:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== "ADMINISTRADOR") {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    await prisma.room.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ message: "Quarto deletado com sucesso" });
  } catch (error) {
    console.error("Erro ao deletar quarto:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
