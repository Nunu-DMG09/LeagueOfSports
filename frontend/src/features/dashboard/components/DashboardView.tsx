export default function DashboardView() {
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  return (
    <div className="min-h-screen p-8 text-center">
      <h1 className="text-4xl font-bold text-ls-primary">Panel General</h1>
      {user && (
        <p className="mt-4 text-xl">
          Bienvenido, <span className="text-ls-gold">{user.nickname}</span> (Rango: {user.elo})
        </p>
      )}
    </div>
  );
}