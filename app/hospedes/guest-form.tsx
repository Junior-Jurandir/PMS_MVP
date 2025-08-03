
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
import { Guest } from "@/lib/types";
import { toast } from "sonner";

interface GuestFormProps {
  isOpen: boolean;
  onClose: () => void;
  guest?: Guest | null;
  onSuccess: () => void;
}

export function GuestForm({ isOpen, onClose, guest, onSuccess }: GuestFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    document: "",
    documentType: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "Brasil",
    birthDate: "",
    nationality: "Brasileira",
    emergencyContact: "",
    notes: ""
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (guest) {
      setFormData({
        name: guest.name,
        email: guest.email || "",
        phone: guest.phone || "",
        document: guest.document || "",
        documentType: guest.documentType || "",
        address: guest.address || "",
        city: guest.city || "",
        state: guest.state || "",
        zipCode: guest.zipCode || "",
        country: guest.country || "Brasil",
        birthDate: guest.birthDate ? new Date(guest.birthDate).toISOString().split('T')[0] : "",
        nationality: guest.nationality || "Brasileira",
        emergencyContact: guest.emergencyContact || "",
        notes: guest.notes || ""
      });
    } else {
      setFormData({
        name: "",
        email: "",
        phone: "",
        document: "",
        documentType: "",
        address: "",
        city: "",
        state: "",
        zipCode: "",
        country: "Brasil",
        birthDate: "",
        nationality: "Brasileira",
        emergencyContact: "",
        notes: ""
      });
    }
  }, [guest, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const url = guest ? `/api/guests/${guest.id}` : "/api/guests";
      const method = guest ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success(guest ? "Hóspede atualizado com sucesso!" : "Hóspede criado com sucesso!");
        onSuccess();
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "Erro ao salvar hóspede");
      }
    } catch (error) {
      console.error("Erro:", error);
      toast.error("Erro ao salvar hóspede");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {guest ? "Editar Hóspede" : "Novo Hóspede"}
          </DialogTitle>
          <DialogDescription>
            {guest ? "Edite as informações do hóspede." : "Adicione um novo hóspede ao sistema."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome Completo *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="João Silva"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="joao@email.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="(11) 99999-9999"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="documentType">Tipo de Documento</Label>
              <Select 
                value={formData.documentType} 
                onValueChange={(value) => setFormData({ ...formData, documentType: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CPF">CPF</SelectItem>
                  <SelectItem value="RG">RG</SelectItem>
                  <SelectItem value="PASSAPORTE">Passaporte</SelectItem>
                  <SelectItem value="CNH">CNH</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="document">Número do Documento</Label>
              <Input
                id="document"
                value={formData.document}
                onChange={(e) => setFormData({ ...formData, document: e.target.value })}
                placeholder="000.000.000-00"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="birthDate">Data de Nascimento</Label>
              <Input
                id="birthDate"
                type="date"
                value={formData.birthDate}
                onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nationality">Nacionalidade</Label>
              <Input
                id="nationality"
                value={formData.nationality}
                onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                placeholder="Brasileira"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Endereço</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Rua das Flores, 123"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">Cidade</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="São Paulo"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">Estado</Label>
              <Input
                id="state"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                placeholder="SP"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="zipCode">CEP</Label>
              <Input
                id="zipCode"
                value={formData.zipCode}
                onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                placeholder="01234-567"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="emergencyContact">Contato de Emergência</Label>
            <Input
              id="emergencyContact"
              value={formData.emergencyContact}
              onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
              placeholder="Maria Silva - (11) 88888-8888"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Observações</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Observações sobre o hóspede..."
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Salvando..." : guest ? "Atualizar" : "Criar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
