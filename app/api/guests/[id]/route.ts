
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

    const guest = await prisma.guest.findUnique({
      where: { id: params.id },
      include: {
        reservations: {
          include: {
            room: true
          }
        }
      }
    });

    if (!guest) {
      return NextResponse.json({ error: "Hóspede não encontrado" }, { status: 404 });
    }

    return NextResponse.json(guest);
  } catch (error) {
    console.error("Erro ao buscar hóspede:", error);
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
    const { 
      name, email, phone, document, documentType, 
      address, city, state, zipCode, country, 
      birthDate, nationality, emergencyContact, notes 
    } = body;

    const guest = await prisma.guest.update({
      where: { id: params.id },
      data: {
        ...(name && { name }),
        ...(email !== undefined && { email }),
        ...(phone !== undefined && { phone }),
        ...(document !== undefined && { document }),
        ...(documentType !== undefined && { documentType }),
        ...(address !== undefined && { address }),
        ...(city !== undefined && { city }),
        ...(state !== undefined && { state }),
        ...(zipCode !== undefined && { zipCode }),
        ...(country !== undefined && { country }),
        ...(birthDate !== undefined && { birthDate: birthDate ? new Date(birthDate) : null }),
        ...(nationality !== undefined && { nationality }),
        ...(emergencyContact !== undefined && { emergencyContact }),
        ...(notes !== undefined && { notes })
      }
    });

    return NextResponse.json(guest);
  } catch (error) {
    console.error("Erro ao atualizar hóspede:", error);
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

    await prisma.guest.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ message: "Hóspede deletado com sucesso" });
  } catch (error) {
    console.error("Erro ao deletar hóspede:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
