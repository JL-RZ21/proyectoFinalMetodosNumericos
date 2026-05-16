using Microsoft.EntityFrameworkCore;
using proyectofinal.Data;
using proyectofinal.Models;
using StackExchange.Redis;
using Microsoft.AspNetCore.Builder;


var builder = WebApplication.CreateBuilder(args);

// 1. Configuración de SQL Server (Persistencia)
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection")));

// 2. Configuración de Redis (Encolado RPUSH)
var redisConnection = builder.Configuration["Redis:Connection"] ?? "redis:6379";

builder.Services.AddSingleton<IConnectionMultiplexer>(
    ConnectionMultiplexer.Connect(redisConnection));

// 3. CORS — permite que el frontend se conecte
builder.Services.AddCors(options => {
    options.AddPolicy("AllowAll", policy =>
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader());
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// 4. Swagger siempre activo (no solo en Development)
app.UseSwagger();
app.UseSwaggerUI();

// 5. Habilitar CORS antes de los controladores
app.UseCors("AllowAll");

app.UseAuthorization();
app.MapControllers();

app.Run();
