
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

    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

    // Buscar estatísticas
    const [
      totalRooms,
      availableRooms,
      occupiedRooms,
      totalReservations,
      todayCheckins,
      todayCheckouts,
      currentGuests,
      revenueData
    ] = await Promise.all([
      prisma.room.count(),
      prisma.room.count({ where: { status: "DISPONIVEL" } }),
      prisma.room.count({ where: { status: "OCUPADO" } }),
      prisma.reservation.count(),
      prisma.reservation.count({
        where: {
          checkIn: {
            gte: startOfDay,
            lt: endOfDay
          },
          status: "CONFIRMADA"
        }
      }),
      prisma.reservation.count({
        where: {
          checkOut: {
            gte: startOfDay,
            lt: endOfDay
          },
          status: "CHECKIN"
        }
      }),
      prisma.reservation.count({
        where: {
          status: "CHECKIN"
        }
      }),
      prisma.reservation.aggregate({
        _sum: {
          totalPrice: true
        },
        where: {
          status: {
            in: ["CHECKIN", "CHECKOUT"]
          }
        }
      })
    ]);

    const occupancyRate = totalRooms > 0 ? (occupiedRooms / totalRooms) * 100 : 0;
    const revenue = Number(revenueData._sum.totalPrice) || 0;

    const stats = {
      totalRooms,
      availableRooms,
      occupiedRooms,
      totalReservations,
      todayCheckins,
      todayCheckouts,
      currentGuests,
      revenue,
      occupancyRate: Math.round(occupancyRate * 100) / 100
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Erro ao buscar estatísticas:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
