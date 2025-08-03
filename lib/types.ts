
import { User, Room, Guest, Reservation, UserRole, RoomType, RoomStatus, ReservationStatus, PaymentStatus } from "@prisma/client";

export type {
  User,
  Room,
  Guest,
  Reservation,
  UserRole,
  RoomType,
  RoomStatus,
  ReservationStatus,
  PaymentStatus
};

export interface DashboardStats {
  totalRooms: number;
  availableRooms: number;
  occupiedRooms: number;
  totalReservations: number;
  todayCheckins: number;
  todayCheckouts: number;
  currentGuests: number;
  revenue: number;
  occupancyRate: number;
}

export interface RoomWithReservations extends Room {
  reservations: Reservation[];
}

export interface ReservationWithDetails extends Reservation {
  guest: Guest;
  room: Room;
}

declare module "next-auth" {
  interface User {
    role: UserRole;
  }

  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: UserRole;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: UserRole;
  }
}
