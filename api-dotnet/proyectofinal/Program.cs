using Microsoft.EntityFrameworkCore;
using proyectofinal.Data;
using proyectofinal.Models;
using StackExchange.Redis;
using Microsoft.AspNetCore.Builder;


var builder = WebApplication.CreateBuilder(args);

// 1. Configuración de SQL Server (Persistencia)
// Asegúrate de que el nombre de la base de datos coincida con la que crearon tus compañeros
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer("Server=localhost;Database=MetodosNumericos;Trusted_Connection=True;TrustServerCertificate=True;"));

// 2. Configuración de Redis (Encolado RPUSH)
builder.Services.AddSingleton<IConnectionMultiplexer>(ConnectionMultiplexer.Connect("localhost"));

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(); // Esto genera la documentación OpenAPI que pide el Ing. Mayén

var app = builder.Build();

// 3. Configurar Swagger para ver tu API en el navegador
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();