
'use client';

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { Header } from "@/components/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Plus,
  Edit,
  Trash2,
  Phone,
  Mail,
  Calendar,
  IdCard
} from "lucide-react";
import { Guest } from "@/lib/types";
import { GuestForm } from "./guest-form";
import { toast } from "sonner";

interface GuestWithReservations extends Guest {
  reservations: Array<{
    id: string;
    checkIn: Date;
    checkOut: Date;
    status: string;
    room: {
      number: string;
      name: string;
    };
  }>;
}

export default function HospedesPage() {
  const { data: session, status } = useSession();
  const [guests, setGuests] = useState<GuestWithReservations[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingGuest, setEditingGuest] = useState<GuestWithReservations | null>(null);

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      redirect("/login");
      return;
    }

    fetchGuests();
  }, [session, status]);

  const fetchGuests = async () => {
    try {
      const response = await fetch("/api/guests");
      if (response.ok) {
        const data = await response.json();
        setGuests(data);
      }
    } catch (error) {
      console.error("Erro ao buscar hóspedes:", error);
      toast.error("Erro ao carregar hóspedes");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (guest: GuestWithReservations) => {
    setEditingGuest(guest);
    setIsFormOpen(true);
  };

  const handleDelete = async (guestId: string) => {
    if (!confirm("Tem certeza que deseja deletar este hóspede?")) return;

    try {
      const response = await fetch(`/api/guests/${guestId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchGuests();
        toast.success("Hóspede deletado com sucesso");
      } else {
        toast.error("Erro ao deletar hóspede");
      }
    } catch (error) {
      console.error("Erro:", error);
      toast.error("Erro ao deletar hóspede");
    }
  };

  const formatDate = (dateString: Date) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
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
                <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
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
              <Users className="h-8 w-8 mr-3 text-green-600" />
              Hóspedes
            </h1>
            <p className="text-gray-600 mt-2">
              Gerencie os hóspedes do hotel
            </p>
          </div>
          <Button 
            onClick={() => {
              setEditingGuest(null);
              setIsFormOpen(true);
            }}
            className="flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Novo Hóspede
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {guests.map((guest) => (
            <Card key={guest.id} className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{guest.name}</CardTitle>
                    <CardDescription className="flex items-center mt-1">
                      {guest.email && (
                        <>
                          <Mail className="h-3 w-3 mr-1" />
                          {guest.email}
                        </>
                      )}
                    </CardDescription>
                  </div>
                  {guest.reservations.length > 0 && (
                    <Badge variant="outline" className="bg-green-50 text-green-700">
                      Hóspede
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {guest.phone && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="h-4 w-4 mr-2 text-gray-400" />
                    {guest.phone}
                  </div>
                )}
                
                {guest.document && (
                  <div className="flex items-center text-sm text-gray-600">
                    <IdCard className="h-4 w-4 mr-2 text-gray-400" />
                    {guest.documentType}: {guest.document}
                  </div>
                )}

                {guest.birthDate && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                    {formatDate(guest.birthDate)}
                  </div>
                )}

                {guest.city && guest.state && (
                  <div className="text-sm text-gray-600">
                    📍 {guest.city}, {guest.state}
                  </div>
                )}

                {guest.reservations.length > 0 && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm font-medium text-blue-900 mb-2">
                      Reservas Ativas:
                    </p>
                    {guest.reservations.slice(0, 2).map((reservation) => (
                      <div key={reservation.id} className="text-xs text-blue-700">
                        Quarto {reservation.room.number} - {formatDate(reservation.checkIn)} a {formatDate(reservation.checkOut)}
                      </div>
                    ))}
                    {guest.reservations.length > 2 && (
                      <p className="text-xs text-blue-600 mt-1">
                        +{guest.reservations.length - 2} mais...
                      </p>
                    )}
                  </div>
                )}

                <div className="flex justify-between items-center pt-4 border-t">
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(guest)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    {session.user.role === "ADMINISTRADOR" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(guest.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  
                  <span className="text-xs text-gray-500">
                    {guest.reservations.length} reserva(s)
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {guests.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              Nenhum hóspede cadastrado
            </h3>
            <p className="text-gray-600 mb-6">
              Comece adicionando o primeiro hóspede.
            </p>
            <Button 
              onClick={() => {
                setEditingGuest(null);
                setIsFormOpen(true);
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Primeiro Hóspede
            </Button>
          </div>
        )}

        <GuestForm
          isOpen={isFormOpen}
          onClose={() => {
            setIsFormOpen(false);
            setEditingGuest(null);
          }}
          guest={editingGuest}
          onSuccess={() => {
            fetchGuests();
            setIsFormOpen(false);
            setEditingGuest(null);
          }}
        />
      </div>
    </div>
  );
}
