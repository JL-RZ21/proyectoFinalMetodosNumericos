using Microsoft.EntityFrameworkCore;
using proyectofinal.Data;
using proyectofinal.Models;
using StackExchange.Redis;
using Microsoft.AspNetCore.Builder;

var builder = WebApplication.CreateBuilder(args);

// 1. Configuración de SQL Server
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(
        "Server=db;Database=metodos_db;User Id=sa;Password=TuPasswordSeguro123;TrustServerCertificate=True;"));

// 2. Configuración de Redis
builder.Services.AddSingleton<IConnectionMultiplexer>(
    ConnectionMultiplexer.Connect("redis:6379,abortConnect=false"));

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();


// AGREGA ESTO ↓↓↓
var scope = app.Services.CreateScope();
var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
db.Database.EnsureCreated();
// ↑↑↑


// Swagger
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "API v1");
    c.RoutePrefix = string.Empty;
});

app.UseAuthorization();
app.MapControllers();

app.Run();