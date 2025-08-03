
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

    const reservations = await prisma.reservation.findMany({
      include: {
        guest: true,
        room: true
      },
      orderBy: {
        checkIn: 'desc'
      }
    });

    return NextResponse.json(reservations);
  } catch (error) {
    console.error("Erro ao buscar reservas:", error);
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
      guestId, roomId, checkIn, checkOut, adults, children, 
      totalPrice, source, notes, specialRequests 
    } = body;

    if (!guestId || !roomId || !checkIn || !checkOut || !totalPrice) {
      return NextResponse.json(
        { error: "Campos obrigatórios: hóspede, quarto, check-in, check-out e preço total" },
        { status: 400 }
      );
    }

    // Verificar se o quarto está disponível no período
    const existingReservation = await prisma.reservation.findFirst({
      where: {
        roomId,
        status: {
          in: ["CONFIRMADA", "CHECKIN"]
        },
        OR: [
          {
            checkIn: {
              lte: new Date(checkOut)
            },
            checkOut: {
              gte: new Date(checkIn)
            }
          }
        ]
      }
    });

    if (existingReservation) {
      return NextResponse.json(
        { error: "Quarto não disponível no período selecionado" },
        { status: 400 }
      );
    }

    const reservation = await prisma.reservation.create({
      data: {
        guestId,
        roomId,
        checkIn: new Date(checkIn),
        checkOut: new Date(checkOut),
        adults: parseInt(adults) || 1,
        children: parseInt(children) || 0,
        totalPrice: parseFloat(totalPrice),
        source,
        notes,
        specialRequests
      },
      include: {
        guest: true,
        room: true
      }
    });

    return NextResponse.json(reservation, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar reserva:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
