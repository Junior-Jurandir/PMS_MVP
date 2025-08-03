
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const reservation = await prisma.reservation.findUnique({
      where: { id: params.id },
      include: { room: true }
    });

    if (!reservation) {
      return NextResponse.json({ error: "Reserva não encontrada" }, { status: 404 });
    }

    if (reservation.status !== "CONFIRMADA") {
      return NextResponse.json(
        { error: "Reserva não está confirmada" },
        { status: 400 }
      );
    }

    // Atualizar reserva e quarto
    const [updatedReservation] = await Promise.all([
      prisma.reservation.update({
        where: { id: params.id },
        data: { status: "CHECKIN" },
        include: {
          guest: true,
          room: true
        }
      }),
      prisma.room.update({
        where: { id: reservation.roomId },
        data: { status: "OCUPADO" }
      })
    ]);

    return NextResponse.json(updatedReservation);
  } catch (error) {
    console.error("Erro no check-in:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
