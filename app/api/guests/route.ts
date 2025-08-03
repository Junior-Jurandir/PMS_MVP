
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

    const guests = await prisma.guest.findMany({
      include: {
        reservations: {
          include: {
            room: true
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    });

    return NextResponse.json(guests);
  } catch (error) {
    console.error("Erro ao buscar hóspedes:", error);
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
    const { 
      name, email, phone, document, documentType, 
      address, city, state, zipCode, country, 
      birthDate, nationality, emergencyContact, notes 
    } = body;

    if (!name) {
      return NextResponse.json(
        { error: "Nome é obrigatório" },
        { status: 400 }
      );
    }

    const guest = await prisma.guest.create({
      data: {
        name,
        email,
        phone,
        document,
        documentType,
        address,
        city,
        state,
        zipCode,
        country: country || "Brasil",
        birthDate: birthDate ? new Date(birthDate) : null,
        nationality,
        emergencyContact,
        notes
      }
    });

    return NextResponse.json(guest, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar hóspede:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
