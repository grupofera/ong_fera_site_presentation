import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Users, Heart, Gift, Clock } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function Dashboard() {
  // Simulated data for charts
  const adoptionData = [
    { mes: "Jan", adocoes: 4 },
    { mes: "Fev", adocoes: 3 },
    { mes: "Mar", adocoes: 2 },
    { mes: "Abr", adocoes: 5 },
    { mes: "Mai", adocoes: 4 },
    { mes: "Jun", adocoes: 6 },
  ];

  const donationData = [
    { mes: "Jan", PIX: 1200, Banco: 800, Items: 5 },
    { mes: "Fev", PIX: 1500, Banco: 1000, Items: 3 },
    { mes: "Mar", PIX: 1100, Banco: 900, Items: 4 },
    { mes: "Abr", PIX: 1800, Banco: 1200, Items: 6 },
    { mes: "Mai", PIX: 1600, Banco: 1100, Items: 5 },
    { mes: "Jun", PIX: 2000, Banco: 1500, Items: 8 },
  ];

  const donationTypeData = [
    { name: "PIX", value: 8800, color: "#4a7c59" },
    { name: "Banco", value: 6500, color: "#ff6b35" },
    { name: "Items", value: 31, color: "#fbbf24" },
  ];

  const volunteerData = [
    { nome: "Maria Silva", horas: 120 },
    { nome: "João Santos", horas: 95 },
    { nome: "Ana Costa", horas: 110 },
    { nome: "Pedro Oliveira", horas: 85 },
    { nome: "Carla Souza", horas: 100 },
  ];

  const stats = [
    {
      title: "Total de Animais",
      value: "--",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Adoções este Mês",
      value: "--",
      icon: Heart,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      title: "Doações este Mês",
      value: "R$ --",
      icon: Gift,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Horas de Voluntariado",
      value: "--",
      icon: Clock,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Visão geral das operações da ONG FERA
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold text-foreground mt-2">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`${stat.bgColor} p-3 rounded-lg`}>
                    <Icon className={`${stat.color} h-6 w-6`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Adoptions Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Adoções por Mês</CardTitle>
            <CardDescription>Últimos 6 meses</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={adoptionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="adocoes"
                  stroke="#4a7c59"
                  strokeWidth={2}
                  name="Adoções"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Donations by Type Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Doações por Tipo</CardTitle>
            <CardDescription>Distribuição de doações</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={donationTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {donationTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Donations Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Doações por Mês</CardTitle>
            <CardDescription>Últimos 6 meses por tipo</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={donationData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="PIX" fill="#4a7c59" name="PIX (R$)" />
                <Bar dataKey="Banco" fill="#ff6b35" name="Banco (R$)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Volunteers */}
        <Card>
          <CardHeader>
            <CardTitle>Top Voluntários</CardTitle>
            <CardDescription>Mais horas de trabalho</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {volunteerData.map((volunteer, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-semibold text-primary">
                        {volunteer.nome.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{volunteer.nome}</p>
                      <p className="text-xs text-muted-foreground">
                        {volunteer.horas} horas
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-primary">{volunteer.horas}h</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader>
            <CardTitle className="text-green-900">Impacto Financeiro</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-700">R$ 15.300</p>
            <p className="text-sm text-green-600 mt-2">Doações totais este mês</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-900">Animais Resgatados</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-700">--</p>
            <p className="text-sm text-blue-600 mt-2">Aguardando dados</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardHeader>
            <CardTitle className="text-purple-900">Taxa de Adoção</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-purple-700">--</p>
            <p className="text-sm text-purple-600 mt-2">Animais adotados</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
