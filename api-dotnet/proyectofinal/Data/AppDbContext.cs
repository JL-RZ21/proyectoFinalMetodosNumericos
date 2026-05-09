using Microsoft.EntityFrameworkCore;
using proyectofinal.Models;

namespace proyectofinal.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    // Esta es la conexión a la tabla de tu script SQL
    public DbSet<Job> Jobs { get; set; }
}