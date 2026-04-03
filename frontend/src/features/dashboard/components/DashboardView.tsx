import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { Users, Trophy, Crosshair, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

const barData = [
  { name: 'Ene', partidas: 40 }, { name: 'Feb', partidas: 300 },
  { name: 'Mar', partidas: 200 }, { name: 'Abr', partidas: 278 },
  { name: 'May', partidas: 189 }, { name: 'Jun', partidas: 239 },
];

const pieData = [
  { name: 'En Proceso', value: 3, color: '#c8aa6e' }, // Dorado
  { name: 'Finalizados', value: 12, color: '#12b279' }, // Verde
  { name: 'Pendientes', value: 2, color: '#0bc6e3' }, // Celeste
];

export default function DashboardView() {
  const triggerNotification = () => {
    toast.success('¡Datos actualizados correctamente!', {
      description: 'El dashboard ha sincronizado la última información del servidor.'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Resumen General</h1>
        <button 
          onClick={triggerNotification}
          className="rounded bg-ls-primary/10 px-4 py-2 text-sm text-ls-primary border border-ls-primary/30 hover:bg-ls-primary/20 transition"
        >
          Sincronizar Datos
        </button>
      </div>

      {/* TARJETAS ESTADÍSTICAS */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          { title: 'Invocadores Activos', value: '1,245', icon: Users, color: 'text-ls-primary' },
          { title: 'Torneos en Curso', value: '3', icon: Trophy, color: 'text-ls-gold' },
          { title: 'Kills Totales', value: '14,500', icon: Crosshair, color: 'text-ls-danger' },
          { title: 'Win Rate Global', value: '49.8%', icon: TrendingUp, color: 'text-ls-success' },
        ].map((stat, index) => (
          <div key={index} className="flex items-center gap-4 rounded-lg border border-ls-gold/10 bg-ls-surface p-5 shadow-lg">
            <div className={`rounded-full bg-ls-bg p-3 ${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-400">{stat.title}</p>
              <h3 className="text-2xl font-bold text-white">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* GRÁFICOS */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Gráfico de Barras */}
        <div className="col-span-1 lg:col-span-2 rounded-lg border border-ls-gold/10 bg-ls-surface p-5 shadow-lg">
          <h3 className="mb-4 text-lg font-semibold text-gray-200">Partidas Mensuales</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" vertical={false} />
                <XAxis dataKey="name" stroke="#a0aec0" />
                <YAxis stroke="#a0aec0" />
                <RechartsTooltip cursor={{fill: '#2d3748'}} contentStyle={{ backgroundColor: '#1e2328', borderColor: '#c8aa6e' }} />
                <Bar dataKey="partidas" fill="#0bc6e3" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfico Circular */}
        <div className="col-span-1 rounded-lg border border-ls-gold/10 bg-ls-surface p-5 shadow-lg">
          <h3 className="mb-4 text-lg font-semibold text-gray-200">Estado de Torneos</h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip contentStyle={{ backgroundColor: '#1e2328', borderColor: '#c8aa6e' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 flex flex-col gap-2">
            {pieData.map((item, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }}></span>
                  <span className="text-gray-300">{item.name}</span>
                </div>
                <span className="font-bold text-white">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}