
'use client';

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/header";
import { 
  Building, 
  Users, 
  Calendar, 
  DollarSign,
  TrendingUp,
  Clock,
  LogIn,
  LogOut
} from "lucide-react";
import { DashboardStats } from "@/lib/types";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      redirect("/login");
      return;
    }

    fetchStats();
  }, [session, status]);

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/dashboard");
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Erro ao buscar estatísticas:", error);
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader className="pb-3">
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!session) return null;

  const statCards = [
    {
      title: "Total de Quartos",
      value: stats?.totalRooms || 0,
      icon: Building,
      color: "text-blue-600",
      bg: "bg-blue-50"
    },
    {
      title: "Quartos Disponíveis",
      value: stats?.availableRooms || 0,
      icon: Building,
      color: "text-green-600",
      bg: "bg-green-50"
    },
    {
      title: "Quartos Ocupados",
      value: stats?.occupiedRooms || 0,
      icon: Users,
      color: "text-orange-600",
      bg: "bg-orange-50"
    },
    {
      title: "Taxa de Ocupação",
      value: `${stats?.occupancyRate || 0}%`,
      icon: TrendingUp,
      color: "text-purple-600",
      bg: "bg-purple-50"
    },
    {
      title: "Check-ins Hoje",
      value: stats?.todayCheckins || 0,
      icon: LogIn,
      color: "text-emerald-600",
      bg: "bg-emerald-50"
    },
    {
      title: "Check-outs Hoje",
      value: stats?.todayCheckouts || 0,
      icon: LogOut,
      color: "text-red-600",
      bg: "bg-red-50"
    },
    {
      title: "Total de Reservas",
      value: stats?.totalReservations || 0,
      icon: Calendar,
      color: "text-indigo-600",
      bg: "bg-indigo-50"
    },
    {
      title: "Receita Total",
      value: `R$ ${stats?.revenue?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '0,00'}`,
      icon: DollarSign,
      color: "text-green-600",
      bg: "bg-green-50"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Bem-vindo de volta, {session.user?.name}! Aqui está o resumo das suas operações.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader className="flex flex-row items-center justify-between pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </CardTitle>
                  <div className={`p-2 rounded-lg ${stat.bg}`}>
                    <Icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2 text-blue-600" />
                Atividades de Hoje
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center">
                    <LogIn className="h-4 w-4 text-green-600 mr-2" />
                    <span className="font-medium">Check-ins</span>
                  </div>
                  <span className="text-xl font-bold text-green-600">
                    {stats?.todayCheckins || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div className="flex items-center">
                    <LogOut className="h-4 w-4 text-red-600 mr-2" />
                    <span className="font-medium">Check-outs</span>
                  </div>
                  <span className="text-xl font-bold text-red-600">
                    {stats?.todayCheckouts || 0}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building className="h-5 w-5 mr-2 text-purple-600" />
                Status dos Quartos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">Disponíveis</span>
                  <div className="flex items-center">
                    <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full" 
                        style={{ 
                          width: `${((stats?.availableRooms || 0) / (stats?.totalRooms || 1)) * 100}%` 
                        }}
                      ></div>
                    </div>
                    <span className="text-sm font-bold">{stats?.availableRooms || 0}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">Ocupados</span>
                  <div className="flex items-center">
                    <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                      <div 
                        className="bg-orange-500 h-2 rounded-full" 
                        style={{ 
                          width: `${((stats?.occupiedRooms || 0) / (stats?.totalRooms || 1)) * 100}%` 
                        }}
                      ></div>
                    </div>
                    <span className="text-sm font-bold">{stats?.occupiedRooms || 0}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
