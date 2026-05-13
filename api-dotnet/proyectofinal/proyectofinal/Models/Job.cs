using System.ComponentModel.DataAnnotations;

namespace proyectofinal.Models;

public class Job
{
    public int Id { get; set; }

    [Required]
    public string Metodo { get; set; } = null!; // Newton-Raphson o Muller

    [Required]
    public string Expresion { get; set; } = null!; // La f(x)

    [Required]
    public string Parametros { get; set; } = null!; // El JSON con x0, tol, etc.[cite: 1]

    public string Estado { get; set; } = "PENDING"; // PENDING, RUNNING, DONE, FAILED[cite: 1]

    public string? Resultado { get; set; }
    public double? ErrorFinal { get; set; }
    public int? IteracionesTotal { get; set; }
    public bool? Converged { get; set; }
    public string? MensajeError { get; set; }

    public DateTime FechaCreacion { get; set; } = DateTime.Now;
    public DateTime? FechaInicio { get; set; }
    public DateTime? FechaFinalizacion { get; set; }
}