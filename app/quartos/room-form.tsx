
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
import { RoomWithReservations, RoomType } from "@/lib/types";
import { toast } from "sonner";

interface RoomFormProps {
  isOpen: boolean;
  onClose: () => void;
  room?: RoomWithReservations | null;
  onSuccess: () => void;
}

export function RoomForm({ isOpen, onClose, room, onSuccess }: RoomFormProps) {
  const [formData, setFormData] = useState({
    number: "",
    name: "",
    type: "" as RoomType,
    capacity: "",
    price: "",
    description: "",
    amenities: [] as string[]
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (room) {
      setFormData({
        number: room.number,
        name: room.name,
        type: room.type,
        capacity: room.capacity.toString(),
        price: room.price.toString(),
        description: room.description || "",
        amenities: room.amenities || []
      });
    } else {
      setFormData({
        number: "",
        name: "",
        type: "" as RoomType,
        capacity: "",
        price: "",
        description: "",
        amenities: []
      });
    }
  }, [room, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const url = room ? `/api/rooms/${room.id}` : "/api/rooms";
      const method = room ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success(room ? "Quarto atualizado com sucesso!" : "Quarto criado com sucesso!");
        onSuccess();
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "Erro ao salvar quarto");
      }
    } catch (error) {
      console.error("Erro:", error);
      toast.error("Erro ao salvar quarto");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {room ? "Editar Quarto" : "Novo Quarto"}
          </DialogTitle>
          <DialogDescription>
            {room ? "Edite as informações do quarto." : "Adicione um novo quarto ao hotel."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="number">Número *</Label>
              <Input
                id="number"
                value={formData.number}
                onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                placeholder="101"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="capacity">Capacidade *</Label>
              <Input
                id="capacity"
                type="number"
                min="1"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                placeholder="2"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Nome *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Quarto Deluxe"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Tipo *</Label>
              <Select 
                value={formData.type} 
                onValueChange={(value: RoomType) => setFormData({ ...formData, type: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SOLTEIRO">Solteiro</SelectItem>
                  <SelectItem value="CASAL">Casal</SelectItem>
                  <SelectItem value="SUITE">Suíte</SelectItem>
                  <SelectItem value="FAMILIA">Família</SelectItem>
                  <SelectItem value="PRESIDENCIAL">Presidencial</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Preço (R$) *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="150.00"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Descrição do quarto..."
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Salvando..." : room ? "Atualizar" : "Criar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
