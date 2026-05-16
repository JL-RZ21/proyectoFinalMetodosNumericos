using Microsoft.EntityFrameworkCore;
using proyectofinal.Models;

namespace proyectofinal.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Job> Jobs { get; set; }
    public DbSet<Iteracion> Iteraciones { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Iteracion>()
            .ToTable("Iteraciones")
            .HasOne(i => i.Job)
            .WithMany()
            .HasForeignKey(i => i.JobId);
    }
}
