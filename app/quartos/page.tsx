
'use client';

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { Header } from "@/components/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Building, 
  Plus,
  Users,
  Edit,
  Trash2,
  Settings
} from "lucide-react";
import { RoomWithReservations, RoomStatus, RoomType } from "@/lib/types";
import { RoomForm } from "./room-form";
import { toast } from "sonner";

export default function QuartosPage() {
  const { data: session, status } = useSession();
  const [rooms, setRooms] = useState<RoomWithReservations[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<RoomWithReservations | null>(null);

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      redirect("/login");
      return;
    }

    fetchRooms();
  }, [session, status]);

  const fetchRooms = async () => {
    try {
      const response = await fetch("/api/rooms");
      if (response.ok) {
        const data = await response.json();
        setRooms(data);
      }
    } catch (error) {
      console.error("Erro ao buscar quartos:", error);
      toast.error("Erro ao carregar quartos");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (roomId: string, newStatus: RoomStatus) => {
    try {
      const response = await fetch(`/api/rooms/${roomId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        await fetchRooms();
        toast.success("Status do quarto atualizado");
      } else {
        toast.error("Erro ao atualizar status");
      }
    } catch (error) {
      console.error("Erro:", error);
      toast.error("Erro ao atualizar status");
    }
  };

  const handleEdit = (room: RoomWithReservations) => {
    setEditingRoom(room);
    setIsFormOpen(true);
  };

  const handleDelete = async (roomId: string) => {
    if (!confirm("Tem certeza que deseja deletar este quarto?")) return;

    try {
      const response = await fetch(`/api/rooms/${roomId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchRooms();
        toast.success("Quarto deletado com sucesso");
      } else {
        toast.error("Erro ao deletar quarto");
      }
    } catch (error) {
      console.error("Erro:", error);
      toast.error("Erro ao deletar quarto");
    }
  };

  const getStatusColor = (status: RoomStatus) => {
    switch (status) {
      case "DISPONIVEL":
        return "bg-green-100 text-green-800";
      case "OCUPADO":
        return "bg-red-100 text-red-800";
      case "MANUTENCAO":
        return "bg-yellow-100 text-yellow-800";
      case "LIMPEZA":
        return "bg-blue-100 text-blue-800";
      case "INDISPONIVEL":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: RoomStatus) => {
    switch (status) {
      case "DISPONIVEL":
        return "Disponível";
      case "OCUPADO":
        return "Ocupado";
      case "MANUTENCAO":
        return "Manutenção";
      case "LIMPEZA":
        return "Limpeza";
      case "INDISPONIVEL":
        return "Indisponível";
      default:
        return status;
    }
  };

  const getRoomTypeLabel = (type: RoomType) => {
    switch (type) {
      case "SOLTEIRO":
        return "Solteiro";
      case "CASAL":
        return "Casal";
      case "SUITE":
        return "Suíte";
      case "FAMILIA":
        return "Família";
      case "PRESIDENCIAL":
        return "Presidencial";
      default:
        return type;
    }
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
              <Building className="h-8 w-8 mr-3 text-blue-600" />
              Quartos
            </h1>
            <p className="text-gray-600 mt-2">
              Gerencie os quartos do hotel
            </p>
          </div>
          <Button 
            onClick={() => {
              setEditingRoom(null);
              setIsFormOpen(true);
            }}
            className="flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Novo Quarto
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((room) => (
            <Card key={room.id} className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{room.name}</CardTitle>
                    <CardDescription>Quarto {room.number}</CardDescription>
                  </div>
                  <Badge className={getStatusColor(room.status)}>
                    {getStatusLabel(room.status)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tipo:</span>
                  <span className="font-medium">{getRoomTypeLabel(room.type)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Capacidade:</span>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1 text-gray-400" />
                    <span className="font-medium">{room.capacity} pessoas</span>
                  </div>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Preço:</span>
                  <span className="font-medium">
                    R$ {Number(room.price).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>

                {room.description && (
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {room.description}
                  </p>
                )}

                {room.reservations.length > 0 && (
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800 font-medium">
                      Reserva ativa
                    </p>
                  </div>
                )}

                <div className="flex justify-between items-center pt-4 border-t">
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(room)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    {session.user.role === "ADMINISTRADOR" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(room.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  
                  <select
                    value={room.status}
                    onChange={(e) => handleStatusChange(room.id, e.target.value as RoomStatus)}
                    className="text-xs border rounded px-2 py-1"
                  >
                    <option value="DISPONIVEL">Disponível</option>
                    <option value="OCUPADO">Ocupado</option>
                    <option value="LIMPEZA">Limpeza</option>
                    <option value="MANUTENCAO">Manutenção</option>
                    <option value="INDISPONIVEL">Indisponível</option>
                  </select>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {rooms.length === 0 && (
          <div className="text-center py-12">
            <Building className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              Nenhum quarto cadastrado
            </h3>
            <p className="text-gray-600 mb-6">
              Comece adicionando o primeiro quarto do hotel.
            </p>
            <Button 
              onClick={() => {
                setEditingRoom(null);
                setIsFormOpen(true);
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Primeiro Quarto
            </Button>
          </div>
        )}

        <RoomForm
          isOpen={isFormOpen}
          onClose={() => {
            setIsFormOpen(false);
            setEditingRoom(null);
          }}
          room={editingRoom}
          onSuccess={() => {
            fetchRooms();
            setIsFormOpen(false);
            setEditingRoom(null);
          }}
        />
      </div>
    </div>
  );
}
