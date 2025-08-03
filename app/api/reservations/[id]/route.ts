
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

    const reservation = await prisma.reservation.findUnique({
      where: { id: params.id },
      include: {
        guest: true,
        room: true
      }
    });

    if (!reservation) {
      return NextResponse.json({ error: "Reserva não encontrada" }, { status: 404 });
    }

    return NextResponse.json(reservation);
  } catch (error) {
    console.error("Erro ao buscar reserva:", error);
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
      checkIn, checkOut, adults, children, totalPrice, 
      status, paymentStatus, source, notes, specialRequests 
    } = body;

    // Se mudando para CHECKIN, atualizar status do quarto
    if (status === "CHECKIN") {
      const reservation = await prisma.reservation.findUnique({
        where: { id: params.id }
      });
      
      if (reservation) {
        await prisma.room.update({
          where: { id: reservation.roomId },
          data: { status: "OCUPADO" }
        });
      }
    }

    // Se mudando para CHECKOUT, atualizar status do quarto
    if (status === "CHECKOUT") {
      const reservation = await prisma.reservation.findUnique({
        where: { id: params.id }
      });
      
      if (reservation) {
        await prisma.room.update({
          where: { id: reservation.roomId },
          data: { status: "LIMPEZA" }
        });
      }
    }

    const reservation = await prisma.reservation.update({
      where: { id: params.id },
      data: {
        ...(checkIn && { checkIn: new Date(checkIn) }),
        ...(checkOut && { checkOut: new Date(checkOut) }),
        ...(adults && { adults: parseInt(adults) }),
        ...(children !== undefined && { children: parseInt(children) }),
        ...(totalPrice && { totalPrice: parseFloat(totalPrice) }),
        ...(status && { status }),
        ...(paymentStatus && { paymentStatus }),
        ...(source !== undefined && { source }),
        ...(notes !== undefined && { notes }),
        ...(specialRequests !== undefined && { specialRequests })
      },
      include: {
        guest: true,
        room: true
      }
    });

    return NextResponse.json(reservation);
  } catch (error) {
    console.error("Erro ao atualizar reserva:", error);
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

    await prisma.reservation.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ message: "Reserva deletada com sucesso" });
  } catch (error) {
    console.error("Erro ao deletar reserva:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
