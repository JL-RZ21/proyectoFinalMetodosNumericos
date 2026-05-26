using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using proyectofinal.Data;
using proyectofinal.Models;
using proyectofinal.DTOs;
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
    public async Task<ActionResult<JobDto>> PostJob(CrearJobDto dto)
    {
        var nuevoJob = new Job
        {
            Metodo = dto.Metodo,
            Expresion = dto.Expresion,
            Parametros = dto.Parametros,
            Estado = "PENDING",
            FechaCreacion = DateTime.Now
        };

        _context.Jobs.Add(nuevoJob);
        await _context.SaveChangesAsync();

        var db = _redis.GetDatabase();
        await db.ListRightPushAsync("queue:jobs", nuevoJob.Id.ToString());

        return CreatedAtAction(nameof(GetJob), new { id = nuevoJob.Id }, MapJobDto(nuevoJob));
    }

    // GET: api/Jobs
    [HttpGet]
    public async Task<ActionResult<IEnumerable<JobDto>>> GetJobs(
        [FromQuery] string? status,
        [FromQuery] string? method)
    {
        var query = _context.Jobs.AsQueryable();

        if (!string.IsNullOrEmpty(status))
            query = query.Where(j => j.Estado == status);

        if (!string.IsNullOrEmpty(method))
            query = query.Where(j => j.Metodo == method);

        var jobs = await query
            .OrderByDescending(j => j.FechaCreacion)
            .ToListAsync();

        return Ok(jobs.Select(MapJobDto));
    }

    // GET: api/Jobs/5
    [HttpGet("{id}")]
    public async Task<ActionResult<JobDto>> GetJob(int id)
    {
        var job = await _context.Jobs.FindAsync(id);
        if (job == null) return NotFound();
        return Ok(MapJobDto(job));
    }

    // GET: api/Jobs/5/iterations
    [HttpGet("{id}/iterations")]
    public async Task<ActionResult<IEnumerable<IteracionDto>>> GetIteraciones(int id)
    {
        var job = await _context.Jobs.FindAsync(id);
        if (job == null) return NotFound();

        var iteraciones = await _context.Iteraciones
            .Where(i => i.JobId == id)
            .OrderBy(i => i.NumeroIteracion)
            .ToListAsync();

        return Ok(iteraciones.Select(i => new IteracionDto
        {
            Id = i.Id,
            JobId = i.JobId,
            NumeroIteracion = i.NumeroIteracion,
            ValorX = i.ValorX,
            Error = i.Error,
            DatosAdicionales = i.DatosAdicionales
        }));
    }

    // Método helper para mapear Job a JobDto
    private static JobDto MapJobDto(Job j) => new JobDto
    {
        Id = j.Id,
        Metodo = j.Metodo,
        Expresion = j.Expresion,
        Parametros = j.Parametros,
        Estado = j.Estado,
        Resultado = j.Resultado,
        ErrorFinal = j.ErrorFinal,
        IteracionesTotal = j.IteracionesTotal,
        Converged = j.Converged,
        MensajeError = j.MensajeError,
        FechaCreacion = j.FechaCreacion,
        FechaInicio = j.FechaInicio,
        FechaFinalizacion = j.FechaFinalizacion
    };
}