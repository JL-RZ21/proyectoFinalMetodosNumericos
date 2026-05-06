using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using proyectofinal.Data;   // Aquí buscaremos la conexión a DB
using proyectofinal.Models; // Aquí buscaremos los modelos
using StackExchange.Redis;  // Para el encolado RPUSH

namespace proyectofinal.Controllers;

[Route("api/[controller]")]
[ApiController]
public class JobsController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IConnectionMultiplexer _redis;

    public JobsController(AppDbContext context, IConnectionMultiplexer redis)
    {
        _context = context;
        _redis = redis;
    }

    // POST: api/Jobs - Aquí es donde el Frontend manda el Newton-Raphson
    [HttpPost]
    public async Task<ActionResult<Job>> PostJob(Job nuevoJob)
    {
        // 1. Validamos y ponemos estado inicial según el script SQL
        nuevoJob.Estado = "PENDING";
        nuevoJob.FechaCreacion = DateTime.Now;

        // 2. Persistencia en SQL Server 2022 usando EF Core 9
        _context.Jobs.Add(nuevoJob);
        await _context.SaveChangesAsync();

        // 3. Encolado en Redis (RPUSH) para que el Worker de Python lo lea
        var db = _redis.GetDatabase();
        await db.ListRightPushAsync("queue:jobs", nuevoJob.Id.ToString());

        return CreatedAtAction(nameof(GetJob), new { id = nuevoJob.Id }, nuevoJob);
    }

    // GET: api/Jobs/5 - Para que el Frontend vea si ya terminó el cálculo
    [HttpGet("{id}")]
    public async Task<ActionResult<Job>> GetJob(int id)
    {
        var job = await _context.Jobs.FindAsync(id);
        if (job == null) return NotFound();
        return job;
    }
}