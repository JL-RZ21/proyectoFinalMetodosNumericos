using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using proyectofinal.Data;
using proyectofinal.Models;
using StackExchange.Redis;

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

    // POST: api/Jobs
    [HttpPost]
    public async Task<ActionResult<Job>> PostJob(Job nuevoJob)
    {
        nuevoJob.Estado = "PENDING";
        nuevoJob.FechaCreacion = DateTime.Now;

        _context.Jobs.Add(nuevoJob);
        await _context.SaveChangesAsync();

        var db = _redis.GetDatabase();
        await db.ListRightPushAsync("queue:jobs", nuevoJob.Id.ToString());

        return CreatedAtAction(nameof(GetJob), new { id = nuevoJob.Id }, nuevoJob);
    }

    // GET: api/Jobs — historial completo
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Job>>> GetJobs()
    {
        var jobs = await _context.Jobs
            .OrderByDescending(j => j.FechaCreacion)
            .ToListAsync();
        return Ok(jobs);
    }

    // GET: api/Jobs/5 — estado del job
    [HttpGet("{id}")]
    public async Task<ActionResult<Job>> GetJob(int id)
    {
        var job = await _context.Jobs.FindAsync(id);
        if (job == null) return NotFound();
        return job;
    }

    // GET: api/Jobs/5/iterations — iteraciones para tabla y gráfica
    [HttpGet("{id}/iterations")]
    public async Task<ActionResult<IEnumerable<Iteracion>>> GetIteraciones(int id)
    {
        var job = await _context.Jobs.FindAsync(id);
        if (job == null) return NotFound();

        var iteraciones = await _context.Iteraciones
            .Where(i => i.JobId == id)
            .OrderBy(i => i.NumeroIteracion)
            .ToListAsync();

        return Ok(iteraciones);
    }
}
