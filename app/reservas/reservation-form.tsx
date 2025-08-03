
'use client';

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ReservationWithDetails, Guest, Room, ReservationStatus, PaymentStatus } from "@/lib/types";
import { toast } from "sonner";

interface ReservationFormProps {
  isOpen: boolean;
  onClose: () => void;
  reservation?: ReservationWithDetails | null;
  onSuccess: () => void;
}

export function ReservationForm({ isOpen, onClose, reservation, onSuccess }: ReservationFormProps) {
  const [formData, setFormData] = useState({
    guestId: "",
    roomId: "",
    checkIn: "",
    checkOut: "",
    adults: "1",
    children: "0",
    totalPrice: "",
    status: "CONFIRMADA" as ReservationStatus,
    paymentStatus: "PENDENTE" as PaymentStatus,
    source: "",
    notes: "",
    specialRequests: ""
  });
  const [guests, setGuests] = useState<Guest[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchGuests();
      fetchRooms();
    }
  }, [isOpen]);

  useEffect(() => {
    if (reservation) {
      setFormData({
        guestId: reservation.guestId,
        roomId: reservation.roomId,
        checkIn: new Date(reservation.checkIn).toISOString().split('T')[0],
        checkOut: new Date(reservation.checkOut).toISOString().split('T')[0],
        adults: reservation.adults.toString(),
        children: reservation.children.toString(),
        totalPrice: reservation.totalPrice.toString(),
        status: reservation.status,
        paymentStatus: reservation.paymentStatus,
        source: reservation.source || "",
        notes: reservation.notes || "",
        specialRequests: reservation.specialRequests || ""
      });
    } else {
      setFormData({
        guestId: "",
        roomId: "",
        checkIn: "",
        checkOut: "",
        adults: "1",
        children: "0",
        totalPrice: "",
        status: "CONFIRMADA" as ReservationStatus,
        paymentStatus: "PENDENTE" as PaymentStatus,
        source: "",
        notes: "",
        specialRequests: ""
      });
    }
  }, [reservation, isOpen]);

  const fetchGuests = async () => {
    try {
      const response = await fetch("/api/guests");
      if (response.ok) {
        const data = await response.json();
        setGuests(data);
      }
    } catch (error) {
      console.error("Erro ao buscar hóspedes:", error);
    }
  };

  const fetchRooms = async () => {
    try {
      const response = await fetch("/api/rooms");
      if (response.ok) {
        const data = await response.json();
        setRooms(data.filter((room: Room) => room.status === "DISPONIVEL"));
      }
    } catch (error) {
      console.error("Erro ao buscar quartos:", error);
    }
  };

  const calculatePrice = () => {
    if (formData.checkIn && formData.checkOut && formData.roomId) {
      const checkIn = new Date(formData.checkIn);
      const checkOut = new Date(formData.checkOut);
      const days = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 3600 * 24));
      
      const room = rooms.find(r => r.id === formData.roomId);
      if (room && days > 0) {
        const totalPrice = Number(room.price) * days;
        setFormData(prev => ({ ...prev, totalPrice: totalPrice.toString() }));
      }
    }
  };

  useEffect(() => {
    calculatePrice();
  }, [formData.checkIn, formData.checkOut, formData.roomId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const url = reservation ? `/api/reservations/${reservation.id}` : "/api/reservations";
      const method = reservation ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success(reservation ? "Reserva atualizada com sucesso!" : "Reserva criada com sucesso!");
        onSuccess();
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "Erro ao salvar reserva");
      }
    } catch (error) {
      console.error("Erro:", error);
      toast.error("Erro ao salvar reserva");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {reservation ? "Editar Reserva" : "Nova Reserva"}
          </DialogTitle>
          <DialogDescription>
            {reservation ? "Edite as informações da reserva." : "Crie uma nova reserva no sistema."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="guestId">Hóspede *</Label>
              <Select 
                value={formData.guestId} 
                onValueChange={(value) => setFormData({ ...formData, guestId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o hóspede" />
                </SelectTrigger>
                <SelectContent>
                  {guests.map((guest) => (
                    <SelectItem key={guest.id} value={guest.id}>
                      {guest.name} {guest.email && `(${guest.email})`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="roomId">Quarto *</Label>
              <Select 
                value={formData.roomId} 
                onValueChange={(value) => setFormData({ ...formData, roomId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o quarto" />
                </SelectTrigger>
                <SelectContent>
                  {rooms.map((room) => (
                    <SelectItem key={room.id} value={room.id}>
                      {room.number} - {room.name} (R$ {Number(room.price).toFixed(2)})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="checkIn">Check-in *</Label>
              <Input
                id="checkIn"
                type="date"
                value={formData.checkIn}
                onChange={(e) => setFormData({ ...formData, checkIn: e.target.value })}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="checkOut">Check-out *</Label>
              <Input
                id="checkOut"
                type="date"
                value={formData.checkOut}
                onChange={(e) => setFormData({ ...formData, checkOut: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="adults">Adultos *</Label>
              <Input
                id="adults"
                type="number"
                min="1"
                value={formData.adults}
                onChange={(e) => setFormData({ ...formData, adults: e.target.value })}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="children">Crianças</Label>
              <Input
                id="children"
                type="number"
                min="0"
                value={formData.children}
                onChange={(e) => setFormData({ ...formData, children: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="totalPrice">Preço Total (R$) *</Label>
              <Input
                id="totalPrice"
                type="number"
                step="0.01"
                min="0"
                value={formData.totalPrice}
                onChange={(e) => setFormData({ ...formData, totalPrice: e.target.value })}
                required
              />
            </div>
          </div>

          {reservation && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select 
                  value={formData.status} 
                  onValueChange={(value: ReservationStatus) => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CONFIRMADA">Confirmada</SelectItem>
                    <SelectItem value="CHECKIN">Check-in</SelectItem>
                    <SelectItem value="CHECKOUT">Check-out</SelectItem>
                    <SelectItem value="CANCELADA">Cancelada</SelectItem>
                    <SelectItem value="NO_SHOW">No Show</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="paymentStatus">Status Pagamento</Label>
                <Select 
                  value={formData.paymentStatus} 
                  onValueChange={(value: PaymentStatus) => setFormData({ ...formData, paymentStatus: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PENDENTE">Pendente</SelectItem>
                    <SelectItem value="PARCIAL">Parcial</SelectItem>
                    <SelectItem value="PAGO">Pago</SelectItem>
                    <SelectItem value="REEMBOLSADO">Reembolsado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="source">Origem da Reserva</Label>
            <Input
              id="source"
              value={formData.source}
              onChange={(e) => setFormData({ ...formData, source: e.target.value })}
              placeholder="Site, telefone, balcão..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="specialRequests">Solicitações Especiais</Label>
            <Textarea
              id="specialRequests"
              value={formData.specialRequests}
              onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
              placeholder="Cama extra, vista para o mar..."
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Observações</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Observações internas..."
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Salvando..." : reservation ? "Atualizar" : "Criar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
