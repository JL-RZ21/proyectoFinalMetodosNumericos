namespace proyectofinal.DTOs;

public class JobDto
{
    public int Id { get; set; }
    public string Metodo { get; set; } = null!;
    public string Expresion { get; set; } = null!;
    public string Parametros { get; set; } = null!;
    public string Estado { get; set; } = null!;
    public string? Resultado { get; set; }
    public double? ErrorFinal { get; set; }
    public int? IteracionesTotal { get; set; }
    public bool? Converged { get; set; }
    public string? MensajeError { get; set; }
    public DateTime FechaCreacion { get; set; }
    public DateTime? FechaInicio { get; set; }
    public DateTime? FechaFinalizacion { get; set; }
}