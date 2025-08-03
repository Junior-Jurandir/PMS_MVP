
'use client';

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { Header } from "@/components/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  Plus,
  Edit,
  Trash2,
  LogIn,
  LogOut,
  Users,
  Building,
  DollarSign
} from "lucide-react";
import { ReservationWithDetails, ReservationStatus, PaymentStatus } from "@/lib/types";
import { ReservationForm } from "./reservation-form";
import { toast } from "sonner";

export default function ReservasPage() {
  const { data: session, status } = useSession();
  const [reservations, setReservations] = useState<ReservationWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingReservation, setEditingReservation] = useState<ReservationWithDetails | null>(null);

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      redirect("/login");
      return;
    }

    fetchReservations();
  }, [session, status]);

  const fetchReservations = async () => {
    try {
      const response = await fetch("/api/reservations");
      if (response.ok) {
        const data = await response.json();
        setReservations(data);
      }
    } catch (error) {
      console.error("Erro ao buscar reservas:", error);
      toast.error("Erro ao carregar reservas");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async (reservationId: string) => {
    try {
      const response = await fetch(`/api/reservations/${reservationId}/checkin`, {
        method: "POST",
      });

      if (response.ok) {
        await fetchReservations();
        toast.success("Check-in realizado com sucesso!");
      } else {
        toast.error("Erro ao realizar check-in");
      }
    } catch (error) {
      console.error("Erro:", error);
      toast.error("Erro ao realizar check-in");
    }
  };

  const handleCheckOut = async (reservationId: string) => {
    try {
      const response = await fetch(`/api/reservations/${reservationId}/checkout`, {
        method: "POST",
      });

      if (response.ok) {
        await fetchReservations();
        toast.success("Check-out realizado com sucesso!");
      } else {
        toast.error("Erro ao realizar check-out");
      }
    } catch (error) {
      console.error("Erro:", error);
      toast.error("Erro ao realizar check-out");
    }
  };

  const handleEdit = (reservation: ReservationWithDetails) => {
    setEditingReservation(reservation);
    setIsFormOpen(true);
  };

  const handleDelete = async (reservationId: string) => {
    if (!confirm("Tem certeza que deseja deletar esta reserva?")) return;

    try {
      const response = await fetch(`/api/reservations/${reservationId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchReservations();
        toast.success("Reserva deletada com sucesso");
      } else {
        toast.error("Erro ao deletar reserva");
      }
    } catch (error) {
      console.error("Erro:", error);
      toast.error("Erro ao deletar reserva");
    }
  };

  const getStatusColor = (status: ReservationStatus) => {
    switch (status) {
      case "CONFIRMADA":
        return "bg-blue-100 text-blue-800";
      case "CHECKIN":
        return "bg-green-100 text-green-800";
      case "CHECKOUT":
        return "bg-gray-100 text-gray-800";
      case "CANCELADA":
        return "bg-red-100 text-red-800";
      case "NO_SHOW":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: ReservationStatus) => {
    switch (status) {
      case "CONFIRMADA":
        return "Confirmada";
      case "CHECKIN":
        return "Check-in";
      case "CHECKOUT":
        return "Check-out";
      case "CANCELADA":
        return "Cancelada";
      case "NO_SHOW":
        return "No Show";
      default:
        return status;
    }
  };

  const getPaymentStatusColor = (status: PaymentStatus) => {
    switch (status) {
      case "PAGO":
        return "bg-green-100 text-green-800";
      case "PARCIAL":
        return "bg-yellow-100 text-yellow-800";
      case "PENDENTE":
        return "bg-red-100 text-red-800";
      case "REEMBOLSADO":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentStatusLabel = (status: PaymentStatus) => {
    switch (status) {
      case "PAGO":
        return "Pago";
      case "PARCIAL":
        return "Parcial";
      case "PENDENTE":
        return "Pendente";
      case "REEMBOLSADO":
        return "Reembolsado";
      default:
        return status;
    }
  };

  const formatDate = (dateString: Date) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getDaysDifference = (checkIn: Date, checkOut: Date) => {
    const timeDifference = new Date(checkOut).getTime() - new Date(checkIn).getTime();
    return Math.ceil(timeDifference / (1000 * 3600 * 24));
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-80 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Calendar className="h-8 w-8 mr-3 text-purple-600" />
              Reservas
            </h1>
            <p className="text-gray-600 mt-2">
              Gerencie as reservas do hotel
            </p>
          </div>
          <Button 
            onClick={() => {
              setEditingReservation(null);
              setIsFormOpen(true);
            }}
            className="flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nova Reserva
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reservations.map((reservation) => (
            <Card key={reservation.id} className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{reservation.guest.name}</CardTitle>
                    <CardDescription className="flex items-center mt-1">
                      <Building className="h-3 w-3 mr-1" />
                      Quarto {reservation.room.number} - {reservation.room.name}
                    </CardDescription>
                  </div>
                  <div className="flex flex-col space-y-1">
                    <Badge className={getStatusColor(reservation.status)}>
                      {getStatusLabel(reservation.status)}
                    </Badge>
                    <Badge className={getPaymentStatusColor(reservation.paymentStatus)}>
                      {getPaymentStatusLabel(reservation.paymentStatus)}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Check-in:</span>
                    <div className="font-medium">{formatDate(reservation.checkIn)}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Check-out:</span>
                    <div className="font-medium">{formatDate(reservation.checkOut)}</div>
                  </div>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Duração:</span>
                  <span className="font-medium">
                    {getDaysDifference(reservation.checkIn, reservation.checkOut)} dia(s)
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Hóspedes:</span>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1 text-gray-400" />
                    <span className="font-medium">
                      {reservation.adults} adulto(s)
                      {reservation.children > 0 && `, ${reservation.children} criança(s)`}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Valor Total:</span>
                  <div className="flex items-center">
                    <DollarSign className="h-4 w-4 mr-1 text-green-600" />
                    <span className="font-bold text-green-600">
                      R$ {Number(reservation.totalPrice).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>

                {reservation.source && (
                  <div className="text-sm text-gray-600">
                    📍 Origem: {reservation.source}
                  </div>
                )}

                {reservation.notes && (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-700 line-clamp-2">
                      {reservation.notes}
                    </p>
                  </div>
                )}

                <div className="flex flex-wrap gap-2 pt-4 border-t">
                  {reservation.status === "CONFIRMADA" && (
                    <Button
                      size="sm"
                      onClick={() => handleCheckIn(reservation.id)}
                      className="flex items-center"
                    >
                      <LogIn className="h-4 w-4 mr-1" />
                      Check-in
                    </Button>
                  )}
                  
                  {reservation.status === "CHECKIN" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleCheckOut(reservation.id)}
                      className="flex items-center"
                    >
                      <LogOut className="h-4 w-4 mr-1" />
                      Check-out
                    </Button>
                  )}

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(reservation)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  
                  {session.user.role === "ADMINISTRADOR" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(reservation.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {reservations.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              Nenhuma reserva encontrada
            </h3>
            <p className="text-gray-600 mb-6">
              Comece criando a primeira reserva.
            </p>
            <Button 
              onClick={() => {
                setEditingReservation(null);
                setIsFormOpen(true);
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Criar Primeira Reserva
            </Button>
          </div>
        )}

        <ReservationForm
          isOpen={isFormOpen}
          onClose={() => {
            setIsFormOpen(false);
            setEditingReservation(null);
          }}
          reservation={editingReservation}
          onSuccess={() => {
            fetchReservations();
            setIsFormOpen(false);
            setEditingReservation(null);
          }}
        />
      </div>
    </div>
  );
}
